#! usr/bin/python
# coding=utf-8

import sys
import requests
import math
from bs4 import BeautifulSoup
import time
import datetime
import socket
import urllib2
import os
import json
import multiprocessing
import uuid

import crawler.crawler as crawler
import crawler.cnki.constants as constants
import crawler.cnki.cnki_class as cnki_class
import collection_utils.collection_utils as collection_utils
import mongo_utils.mongo_utils as mongo_utils

reload(sys)
sys.setdefaultencoding('utf-8')


session = requests.session()


def create_and_open(directory, file_name, mode='w'):
    if not os.path.exists(directory):
        os.makedirs(directory)
    return open(directory+file_name, mode)


def get_current_date():
    return str(datetime.datetime.fromtimestamp(time.time()))


def write_log(log_file, msg):
    log_file.write("[%s] %s\n" % (get_current_date(), msg))


# 获取asp cookie
def get_asp_cookie():
    response = requests.get(constants.default_result_uri, headers=crawler.build_header())
    asp_cookie = response.cookies.get("ASP.NET_SessionId")
    if not asp_cookie:
        raise AttributeError("can't get asp cookie.")
    return asp_cookie


def build_search_handler_query(navi_code):
    res = {
        "NaviCode": navi_code,
        "ua": "1.15",
        "PageName": "ASP.brief_default_result_aspx",
        "DbPrefix": "SCDB",
        "DbCatalog": "中国学术文献网络出版总库",
        "ConfigFile": "SCDBINDEX.xml",
        "db_opt": "CJFQ,CJFN,CDFD,CMFD,CPFD,IPFD,CCND,CCJD,HBRD",
        "his": "0",
        "parentdb": "SCDB",
    }
    return res


def build_group_query():
    res = {
        "Param": "ASP.brief_default_result_aspx#SCDB/ButtonView/",
        "action": "21",
        "cid": "0",
        "clayer": "0",
    }
    return res


def build_first_page_query(ctl):
    res = {
        "ctl": ctl,
        "dest": "分组：文献来源 是 中国博士学位论文全文数据库",
        "action": "5",
        "dbPrefix": "SCDB",
        "PageName": "ASP.brief_default_result_aspx"
    }
    return res


def build_ith_page_query(ctl, current_page, query_id):
    res = {
        "curpage": current_page,
        "ctl": ctl,
        "RecordsPerPage": "50",
        "QueryID": query_id,
        "turnpage": "1",
        "tpagemode": "L",
        "dbPrefix": "SCDB",
        "DisplayMode": "listmode",
        "PageName": "ASP.brief_default_result_aspx"
    }
    return res


def build_valid_header():
    asp_id = get_asp_cookie()
    res = crawler.build_header()
    res["Host"] = "epub.cnki.net"
    res["Referer"] = "http://epub.cnki.net/kns/brief/default_result.aspx"
    res["Cache-Control"] = "max-age=0"
    res["Upgrade-Insecure-Requests"] = "1"
    res["Cookie"] = "RsPerPage=50; ASP.NET_SessionId=%s" % asp_id
    return res


def find_doctor_ctl(html):
    soup = BeautifulSoup(html.decode("utf8"), "html.parser")
    res = soup.find_all(id='GroupItemALink')
    for i in res:
        if u'博士' in i.get_text():
            return i.parent['id']
    raise AttributeError("doctor db is not exist")


def parse_url_list(paper_list_page):
    def has_class_fz14(tag):
        return tag.has_attr('class') and u'fz14' in tag.get('class')
    soup = BeautifulSoup(paper_list_page.decode("utf8"), "html.parser")
    res = soup.find_all(has_class_fz14)
    return [i['href'] for i in res]


def parse_query_id(html):
    soup = BeautifulSoup(html.decode("utf8"), "html.parser")
    tag = soup.find_all('a')
    querys = tag[-1]['href'].split("&")
    for query in querys:
        query_list = query.split("=")
        if u"QueryID" in query_list[0]:
            return query_list[1]
    raise AttributeError("error")


def is_check_code_page(html):
    res = html.find("CheckCode")
    if res > 0:
        return True
    else:
        return False


def find_item_num(html):
    def has_class_pager_title_cell(tag):
        return tag.has_attr('class') and u'pagerTitleCell' in tag.get('class')
    soup = BeautifulSoup(html.decode("utf8"), "html.parser")
    target = soup.find(has_class_pager_title_cell)
    value_str = target.get_text()[4:-5]
    value_str = value_str.replace(',', '')
    return int(value_str)


def calculate_page_num(item_num):
    return int(math.ceil(item_num*1.0/50))


def write_paper_list(w_file, paper_list):
    for paper in paper_list:
        w_file.write(paper+'\n')


def get_first_page(tag):
    # step 1, 访问网站,有新asp cookie的header
    new_header = build_valid_header()
    # step 2, login, 不确定是不是必须的步骤
    session.get(constants.login_uri, headers=new_header)
    # step 3, 使用分类tag初始化后端
    session.get(constants.search_handler_uri, params=build_search_handler_query(tag), headers=new_header)
    # step 4, 获取分组id,即ctl的html
    group_response = session.get(constants.group_uri, params=build_group_query(), headers=new_header)
    # step 5, get ctl
    ctl = find_doctor_ctl(group_response.text)
    # step 6 获取第一页,主要目的是queryId和总条数
    res = session.get(constants.ith_page_uri, params=build_first_page_query(ctl), headers=new_header)
    page_html = res.text
    return ctl, new_header, page_html


def build_paper_url_and_insert(parent_tag_tag_tuple):
    paper_url = None
    try:
        paper_url = build_paper_url(parent_tag_tag_tuple)
    except AttributeError, e:
        print(parent_tag_tag_tuple[1], e.message)
    if paper_url:
        mongo_utils.insert_url(paper_url.to_dic())


def build_paper_url(parent_tag_tag_tuple):
    """

    :param parent_tag_tag_tuple: tuple
    :return: PaperURL Object or None
    """
    parent_tag, tag = parent_tag_tag_tuple

    result = cnki_class.PaperURL([], tag, parent_tag)

    ctl, new_header, first_page_html = get_first_page(tag)
    item_num = find_item_num(first_page_html)
    page_num = calculate_page_num(item_num)

    if page_num == 1:
        paper_list = parse_url_list(first_page_html)
        result.urls = paper_list
    else:
        query_id = parse_query_id(first_page_html)
        for index in range(page_num):
            current_page = index + 1
            ith_page = session.get(constants.ith_page_uri,
                               params=build_ith_page_query(ctl, current_page, query_id),
                               headers=new_header).text
            if is_check_code_page(ith_page):
                ctl, new_header, first_page_html = get_first_page(tag)
                ith_page = session.get(constants.ith_page_uri,
                                       params=build_ith_page_query(ctl, current_page, query_id),
                                       headers=new_header).text
            paper_list = parse_url_list(ith_page)
            result.urls += paper_list
    if len(result.urls) == 0:
        return None
    collection_utils.unique(result.urls, lambda x, y: cmp(x, y))
    result.urls = [url.replace('kns', 'KCMS') for url in result.urls]
    return result


def generate_paper_list(package, tag, start=0):
    """
    生成各类下uri列表
    package是一级tag,比如A,B
    tag是三级tag,比如'A001_1','B014_1'
    """
    log_file = create_and_open(constants.page_package_log_path % package, tag)
    page_file = create_and_open(constants.page_package_paper_path % package, tag)

    ctl, new_header, first_page_html = get_first_page(tag)
    item_num = find_item_num(first_page_html)
    page_num = calculate_page_num(item_num)

    write_log(log_file, "itemNum: %s; pageNum %s;" % (item_num, page_num))

    if page_num == 1:
        # only one page
        paper_list = parse_url_list(first_page_html)
        write_paper_list(page_file, paper_list)
        page_file.close()
        log_file.close()
        return

    # not only one page
    query_id = parse_query_id(first_page_html)
    for index in range(start, page_num):
        time.sleep(1)
        current_page = index + 1
        write_log(log_file, "page %d" % current_page)
        ith_html = session.get(constants.ith_page_uri,
                               params=build_ith_page_query(ctl, current_page, query_id),
                               headers=new_header).text
        if is_check_code_page(ith_html):
            write_log(log_file, "page %d is checkCode. it will generate_paper_list a new asp cookie" % current_page)
            # 如果是验证码页,则新取一个asp cookie
            ctl, new_header, first_page_html = get_first_page(tag)
            write_log(log_file, "new asp cookie is %s" % new_header["Cookie"])
            ith_html = session.get(constants.ith_page_uri,
                                   params=build_ith_page_query(ctl, current_page, query_id),
                                   headers=new_header).text
        paper_list = parse_url_list(ith_html)
        write_log(log_file, "page: [%d] generate_paper_list: [%d]" % (current_page, len(paper_list)))
        write_paper_list(page_file, paper_list)
    page_file.close()
    log_file.close()


def generate_paper_list_all_tag_map(tag_map=constants.all_tag_map):
    for package in tag_map.keys():
        tag_list = constants.all_tag_map[package]
        generate_paper_list_all_tag(package, tag_list)


def generate_paper_list_all_tag(package, tag_list):
    for tag in tag_list:
        print(tag)
        try:
            generate_paper_list(package, tag)
        except AttributeError, e:
            print("tag: [%s] msg: [%s]\n" % (tag, e.message))
            continue
        except requests.ConnectionError, e:
            print("tag: [%s] msg: [%s]\n" % (tag, e.message))
            continue


def make_str(result, uri):
    def replace_invalid(row_str):
        return row_str.replace("\"", "'").replace("\n", "")\
            .replace("\r", "").replace("\\", " ").replace("                ", "")
    res = {
        'name': replace_invalid(result[3]['name']),
        'teacher': replace_invalid(result[3]['teacher']),
        'author_other': replace_invalid(result[3]['other']),
        'school': replace_invalid(result[3]['school']),
        'keywords': replace_invalid(result[1]),
        'title': replace_invalid(result[0]),
        'abstract': replace_invalid(result[2]),
        'other': replace_invalid(result[4]),
        'uri': uri
    }
    res_json = "{"
    for key in res.keys():
        res_json += "\"%s\": \"%s\", " % (key, res[key])
    res_json += "}"
    return res_json


# 分类号,引用数,下载数
def find_other(soup):
    return "**".join(li.get_text().strip() for li in soup.find(attrs={"class": u"summary01"}).find_all('li'))


def find_keywords(soup):
    return "**".join(a.get_text().strip() for a in soup.find(id='ChDivKeyWord').find_all('a'))


def find_author_info(soup):
    def has_class_summary(tag):
        return tag.has_attr('class') and u'summary' in tag.get('class')
    p_list = soup.find(has_class_summary).find_all('p')
    res = {
        'name': p_list[0].find('a').get_text().strip(),
        'teacher': "**".join([a.get_text().strip() for a in p_list[1].find_all('a')]),
        "school": p_list[2].find('a').get_text().strip(),
        'other': "**".join(i.strip() for i in p_list[2].get_text().split("\r\n"))
    }
    return res


def find_abstract(soup):
    return soup.find(id='ChDivSummary').get_text()


def find_title(soup):
    return soup.find(id='chTitle').get_text()


def find_school(soup):
    def has_class_but_no_id(tag):
        if tag.has_attr('class'):
            return u'KnowledgeNetLink' in tag.get('class') and tag.has_attr('onclick')
        return False
    return soup.find_all(has_class_but_no_id)[0].get_text()


def generate_paper_detail(uri_field):
    """

    :param uri_field: str
    :return: tuple
    """
    uri_field = uri_field.replace('kns', 'KCMS')
    page = crawler.retry_urlopen(constants.www_cnki_prefix+uri_field, 4, time_out=2.5)
    doc = page.read()
    soup = BeautifulSoup(doc.decode("utf8"), "html.parser")
    return find_title(soup), find_keywords(soup), find_abstract(soup), find_author_info(soup), find_other(soup)


def read_uri_write_paper_detail(package, tag):
    uri_file = open((constants.page_package_paper_path + tag) % package, 'r')
    log_file = create_and_open(constants.data_package_log_path % package, tag)
    paper_file = create_and_open(constants.data_package_paper_path % package, tag)
    for uri in uri_file.readlines():
        try:
            res = generate_paper_detail(uri)
        except AttributeError:
            write_log(log_file, uri)
            continue
        except urllib2.URLError or socket.timeout:
            write_log(log_file, "timeout: "+uri)
            continue
        json_str = make_str(res, uri.replace("\n", ""))
        print(json_str)
        paper_file.write(json_str+",\n")
    uri_file.close()
    paper_file.close()
    log_file.close()


def read_uri_write_paper_detail_all_tag_map(tag_map=constants.all_tag_map):
    for package in tag_map.keys():
        read_uri_write_paper_detail_all_tag(package, tag_map[package])


def read_uri_write_paper_detail_all_tag(package, tag_list):
    for tag in tag_list:
        read_uri_write_paper_detail(package, tag)


def process_str(line):
    line = list(line)
    line[-2] = ''
    line[-5] = ''
    line = "".join(line)
    return line


def process_other(data_json):
    """

    :param data_json: dictionary
    :return: void
    """
    dic_str = data_json['other']
    str_list = dic_str.split("**")
    other_json = {
        'reference': 0
    }
    for i in str_list:
        if u'分类' in i:
            other_json['tag'] = i.split("】")[1].split(";")
        if u'被引' in i:
            other_json['reference'] = int(i.split("】")[1])
        if u'下载' in i:
            other_json['download'] = int(i.split("】")[1])
    data_json['other'] = other_json


def process_keyword(data_json):
    data_json['keywords'] = data_json['keywords'].split("**")


def process_teacher(data_json):
    teachers = data_json['teacher'].split("**")
    parse_teachers = [teacher.replace(u";", "") for teacher in teachers]
    data_json['teacher'] = parse_teachers


def process_author_other(data_json):
    data_json['author_other'] = data_json['author_other'].replace('，', '').split("**")[2:]


def clean_raw_json_line(line):
    line = process_str(line)
    try:
        line = json.loads(line)
    except ValueError:
        print(line)
    process_other(line)
    process_keyword(line)
    process_teacher(line)
    process_author_other(line)
    return json.dumps(line, ensure_ascii=False)


def clean_raw_json_lines(lines):
    return [clean_raw_json_line(i) for i in lines]


def clean_raw_json_package_tag(package, tag):
    data_file = open((constants.data_package_paper_path+tag) % package, 'r')
    lines = data_file.readlines()
    json_file = open((constants.json_package_paper_path+tag) % package, 'w')
    res = clean_raw_json_lines(lines)
    for line in res:
        json_file.write(line+"\n")
    json_file.close()
    data_file.close()


def aggregate_all_file_in_dir(directory, target_directory, target_file_name):
    file_names = os.listdir(directory)
    res = ""
    for file_name in file_names:
        with open(directory+file_name, 'r') as r_file:
            res += r_file.read()
    w_file = create_and_open(target_directory, target_file_name)
    w_file.write(res)
    w_file.close()


def aggregate_detail_list(package):
    dir_path = constants.page_package_paper_path % package
    aggregate_all_file_in_dir(dir_path, dir_path)


def do_calculation(batch_lines):
    file_name = str(uuid.uuid1())
    log_file = open("tmp/log/"+file_name, 'w')
    with open("tmp/data/"+file_name, 'w') as tmp_file:
        for uri in batch_lines:
            uri = uri[:-1]
            try:
                res = generate_paper_detail(uri)
            except AttributeError, e:
                log_file.write("[%s] msg: [%s], uri: [%s]\n" % (get_current_date(), e.message, uri))
                continue
            except urllib2.URLError, e:
                log_file.write("[%s] msg: [%s], uri: [%s]\n" % (get_current_date(), e.message, uri))
                continue
            except socket.timeout, e:
                log_file.write("[%s] msg: [%s], uri: [%s]\n" % (get_current_date(), e.message, uri))
                continue
            json_str = make_str(res, uri.replace("\n", ""))
            tmp_file.write(json_str+",\n")


def product_paper_detail_multiprocessing(package, process_num):
    with open((constants.page_package_paper_path+'aggregate') % package, 'r') as data_file:
        lines = data_file.readlines()
    # 将lines划分成50个一组的batch,每个进程处理一个batch
    # 每个进程需要做的事: 拿到给定的uuid创建文件,将得到的数据写入文件,关闭文件
    # 每个进程都完成之后,主进程将所有文件aggregate到一个文件中,清空临时目录

    def start_process():
        print("starting %s\n" % multiprocessing.current_process().name)

    # 清除tmp/data和tmp/log下所有文件
    dir_path = 'tmp/%s/'
    file_names = os.listdir('tmp/data/')
    for file_name in file_names:
        os.remove((dir_path+file_name) % 'log')
        os.remove((dir_path+file_name) % 'data')

    step = 50
    groups = [lines[i:i+step] for i in range(0, len(lines), step)]
    pool = multiprocessing.Pool(processes=process_num, initializer=start_process)
    pool.map(do_calculation, groups)
    pool.close()
    pool.join()

    aggregate_all_file_in_dir("tmp/data/", "tmp/", "data_aggregate")
    aggregate_all_file_in_dir("tmp/log/", "tmp/", "log_aggregate")


def clean_raw_json_multiprocessing(process_num):
    with open("data/raw_json", "r") as json_file:
        lines = json_file.readlines()
    step = 5000
    groups = [lines[i:i+step] for i in range(0, len(lines), step)]
    pool = multiprocessing.Pool(processes=process_num)
    res = pool.map(clean_raw_json_lines, groups)
    pool.close()
    pool.join()
    with open("json/data", 'w') as w_file:
        for group in res:
            for line in group:
                w_file.write(line+"\n")


def build_paper_url_multiprocessing(package, process_num):
    tag_a_list = constants.all_tag_map[package]
    tuple_list = [(package, tag) for tag in tag_a_list]
    pool = multiprocessing.Pool(processes=process_num)
    pool.map(build_paper_url_and_insert, tuple_list)
    pool.close()
    pool.join()


def check_db(package):
    tag_list = constants.all_tag_map[package]
    for tag in tag_list:
        print(tag)
        with open("page/%s/paper/%s" % (package, tag), 'r') as r_file:
            num = len(r_file.readlines())
            query_data = mongo_utils.get_url_by_tag(tag)
            if num == 0:
                continue
            if num != len(query_data[u'urls']):
                print(num, len(query_data[u'urls']))


def main(arv):
    res = mongo_utils.get_url_all()
    print(len(res["urls"]))


if __name__ == '__main__':
    main(sys.argv[1:])
