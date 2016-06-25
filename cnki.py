#! usr/bin/python
# coding=utf-8

import sys
import requests
import math
from bs4 import BeautifulSoup
import time
import datetime
import multiprocessing
import array

import crawler.crawler as crawler
import crawler.cnki.constants as constants
import crawler.cnki.cnki_class as cnki_class
import collection_utils.collection_utils as collection_utils
import mongo_utils.mongo_utils as mongo_utils
import feature_extractor.feature_extractor as feature_extractor

reload(sys)
sys.setdefaultencoding('utf-8')


session = requests.session()


############### build header or param ###############


def get_current_date():
    return str(datetime.datetime.fromtimestamp(time.time()))


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

############### end build header or param ###############
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


def build_and_insert_all_paper_detail_object_multiprocessing(process_num):
    for package in constants.all_package:
        urls = mongo_utils.get_url_by_tag(package)['urls']
        build_and_insert_paper_detail_object_multiprocessing(urls, process_num)


############### end build paper detail ###############
############### build paper url ###############

def find_doctor_ctl(html):
    soup = BeautifulSoup(html.decode("utf8"), "html.parser")
    res = soup.find_all(id='GroupItemALink')
    for i in res:
        if u'博士' in i.get_text():
            return i.parent['id']
    raise AttributeError("doctor db is not exist")


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


def parse_url_list(paper_list_page):
    def has_class_fz14(tag):
        return tag.has_attr('class') and u'fz14' in tag.get('class')
    soup = BeautifulSoup(paper_list_page.decode("utf8"), "html.parser")
    res = soup.find_all(has_class_fz14)
    return [i['href'] for i in res]


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
############### other process ###############

def reduce_repeat():
    all = [i for i in mongo_utils.get_all_paper_detail()]
    collection_utils.unique(all, lambda x, y: cmp(x['name']+x['title'], y['name']+y['title']))
    print(len(all))
    mongo_utils.insert_reduce_paper_detail(all)

############### end other process ###############


def main(arv):
    data = mongo_utils.get_all_seq_doctor()
    data = [i for i in data]
    feature_extractor.feature_extractor_tf_idf(data)
    for row in data:
        mongo_utils.update_abstract_tf_idf(row)
    print("hello")


if __name__ == '__main__':
    main(sys.argv[1:])
