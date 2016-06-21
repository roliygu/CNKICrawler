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


############### build paper detail ###############


def find_school(soup):
    def has_class_but_no_id(tag):
        if tag.has_attr('class'):
            return u'KnowledgeNetLink' in tag.get('class') and tag.has_attr('onclick')
        return False
    return soup.find_all(has_class_but_no_id)[0].get_text()


def find_title(soup):
    title = soup.find(id='chTitle')
    if not title:
        title = soup.find(id='enTitle')
    title = title.get_text()
    title = title.replace("\r\n", "").replace("                ", "")
    return title


def find_keywords(soup):
    return [a.get_text().strip() for a in soup.find(id='ChDivKeyWord').find_all('a')]


def find_abstract(soup):
    abstract = soup.find(id='ChDivSummary')
    if not abstract:
        return ""
    else:
        return abstract.get_text()


def find_author_info(soup):
    def has_class_summary(tag):
        return tag.has_attr('class') and u'summary' in tag.get('class')
    ps = soup.find(has_class_summary).find_all('p')
    name, teachers, school, other = None, [], None, None
    for i in ps:
        html = i.get_text()
        if u'作者】' in html:
            name = html.split("】")[1].replace(u"；", "").strip()
        if u'作者基本信息' in html:
            school = i.find('a').get_text().strip()
            other = html.split("\r\n")
            other = other[len(other)-3:]
            other = [item.strip().replace(u'，', "") for item in other]
            other[1] = int(other[1])
        if u'导师' in html:
            teachers = [a.get_text().strip().replace(u'；', "") for a in i.find_all('a')]
    res = {
        'name': name,
        'teachers': teachers,
        'school': school,
        'other': other
    }
    return res


def find_paper_info(soup):
    tmp = [li.get_text().strip() for li in soup.find(attrs={"class": u"summary01"}).find_all('li')]
    tag, download, reference = [], 0, 0
    for i in tmp:
        if u'分类' in i:
            tag = i.split(u'】')[1].split(u';')
        if u'下载' in i:
            download = int(i.split(u'】')[1])
        if u'被引' in i:
            reference = int(i.split(u'】')[1])
    return {
        'tag': tag,
        'reference': download,
        'download': reference
    }


def get_paper_url_detail_doc(uri):
    """
    get doc object by uri
    :param uri: str: part of paper detail uri
    :return: doc object in soup and html
    """
    handle = crawler.retry_urlopen(constants.www_cnki_prefix + uri, 10, time_out=2.5)
    html = handle.read()
    return BeautifulSoup(html.decode("utf8"), "html.parser"), html


def parse_doc_to_paper_detail_object(doc, url):
    author_info = find_author_info(doc)
    title = find_title(doc)
    keywords = find_keywords(doc)
    abstract = find_abstract(doc)
    paper_info = find_paper_info(doc)
    return cnki_class.PaperDetail(author_info['name'], title, author_info['school'],
                                  abstract, url, author_info['other'], paper_info, keywords, author_info['teachers'])


def build_and_insert_paper_detail_object(uri):
    # doc, html = get_paper_url_detail_doc(uri)
    # obj = parse_doc_to_paper_detail_object(doc, uri)
    # mongo_utils.insert_paper_detail(obj.to_dic())
    try:
        doc, html = get_paper_url_detail_doc(uri)
        obj = parse_doc_to_paper_detail_object(doc, uri)
        mongo_utils.insert_paper_detail(obj.to_dic())
    except IndexError, e:
        print e, uri
    except AttributeError, e:
        print e, uri
    except UnicodeEncodeError, e:
        print e, uri
    except ValueError, e:
        print e, uri


def build_and_insert_paper_detail_object_multiprocessing(uris, process_num):
    pool = multiprocessing.Pool(processes=process_num)
    pool.map(build_and_insert_paper_detail_object, uris)
    pool.close()
    pool.join()


############### end build paper detail ###############


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

############### build paper url ###############

def build_paper_url_and_insert_all_multiprocessing():
    process_num = multiprocessing.cpu_count() * 2
    for package in constants.all_package[4:]:
        build_paper_url_and_insert_multiprocessing(package, process_num)


def build_paper_url_and_insert_multiprocessing(package, process_num):
    tag_a_list = constants.all_tag_map[package]
    tuple_list = [(package, tag) for tag in tag_a_list]
    pool = multiprocessing.Pool(processes=process_num)
    pool.map(build_paper_url_and_insert, tuple_list)
    pool.close()
    pool.join()


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
    result.urls = [uri.replace('kns', 'KCMS') for uri in result.urls]
    return result


############### build paper url end ###############


def main(arv):
    package_list = ["C", "D", "E", "F", "G", "H", "I", "J"]
    for package in package_list:
        paper_url = mongo_utils.get_url_by_tag(package)
        print package, len(paper_url['urls'])
        build_and_insert_paper_detail_object_multiprocessing(paper_url['urls'], 32)
    # url ="/KCMS/detail/detail.aspx?QueryID=2&CurRec=413&recid=&FileName=2000005045.nh&DbName=CDFD9908&DbCode=CDFD&pr="
    # build_and_insert_paper_detail_object(url)
    # print('hello')

if __name__ == '__main__':
    main(sys.argv[1:])
