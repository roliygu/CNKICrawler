#! usr/bin/python
# coding=utf-8

import logging.handlers

__author__ = 'roliy'

# url
url_prefix = "http://kns.cnki.net"
# default_result用来获取cookie
cookie_url = "http://kns.cnki.net/kns/brief/default_result.aspx"
# 用来注册cookie和获取查询首页
search_handler_url = "http://kns.cnki.net/kns/request/SearchHandler.ashx"
first_abstract_list_url = "http://kns.cnki.net/kns/brief/brief.aspx?ctl=0bdf61dc-04e9-480a-a751-48730966dbe2&dest=%E5%88%86%E7%BB%84%EF%BC%9A%E5%8F%91%E8%A1%A8%E5%B9%B4%E5%BA%A6%20%E6%98%AF%202015&action=5&dbPrefix=SCDB&PageName=ASP.brief_default_result_aspx&Param=%e5%b9%b4+%3d+%272015%27&SortType=%e5%b9%b4&ShowHistory=1"
abstract_list_url = "http://kns.cnki.net/kns/brief/brief.aspx"
year_group_url = "http://kns.cnki.net/kns/group/doGroupLeft.aspx?action=1&Param=ASP.brief_default_result_aspx%23SCDB/%u53D1%u8868%u5E74%u5EA6/%u5E74%2Ccount%28*%29/%u5E74/%28%u5E74%2C%27date%27%29%23%u5E74%24desc/1000000%24/-/40/40000/ButtonView&cid=0&clayer=0"
# 参考文献
refer_paper = "http://kns.cnki.net/kcms/detail/frame/list.aspx?dbcode=CDFD&filename=2007097337.nh&dbname=CDFD9908&RefType=1&vl="
# 关联作者
relate_author = "http://kns.cnki.net/kcms/detail/frame/asynlist.aspx?dbcode=CDFD&dbname=CDFD9908&filename=2007097337.nh&curdbcode=CDMD&reftype=601&catalogId=lcatalog_func601&catalogName=%E5%85%B3%E8%81%94%E4%BD%9C%E8%80%85%0A%20%20%20%20%20%20%20%20%20%20"
# 读者推荐
recommend = "http://kns.cnki.net/kcms/detail/frame/asynlist.aspx?dbcode=CDFD&dbname=CDFD9908&filename=2007097337.nh&curdbcode=CDMD&reftype=605&catalogId=lcatalog_func605&catalogName=%E8%AF%BB%E8%80%85%E6%8E%A8%E8%8D%90%0A%20%20%20%20%20%20%20%20%20%20"

# logging
# 输出log路径
LOG_PATH = "./log/runtime.log"
# 输出log级别
LOG_LEVEL = logging.INFO
# 最大保留文件数
LOG_MAX_RETAIN = 30
# 单个日志文件大小
LOG_FILE_SIZE = 1024 * 1024 * 10

# program init
logger = logging.getLogger("User")
logger.setLevel(LOG_LEVEL)
handler = logging.handlers.RotatingFileHandler(LOG_PATH, maxBytes=LOG_FILE_SIZE, backupCount=LOG_MAX_RETAIN)
handler.setFormatter(logging.Formatter('%(asctime)s %(filename)s [line:%(lineno)d] %(levelname)s: %(message)s', '%a, %d %b %Y %H:%M:%S'))
logger.addHandler(handler)

tag = "A001_1"
# 每个批的大小
batch_size = 10
total_page_num = None
total_paper_num = None
# 每页概要的详情条数
page_detail_num = 50

is_test = False
test_total_page_num = 20


def get_total_paper_num():
    return total_paper_num


def set_total_paper_num(_total_paper_num):
    global total_paper_num
    total_paper_num = _total_paper_num


def get_total_page_num():
    if is_test:
        return test_total_page_num
    else:
        return total_page_num


def set_total_page_num(_total_page_num):
    if is_test:
        return
    else:
        global total_page_num
        total_page_num = _total_page_num

tag_a = ['A001_1', 'A001_2', 'A001_3', 'A001_4', 'A002_1', 'A002_2', 'A002_3', 'A002_4', 'A002_5', 'A002_6', 'A002_7',
         'A002_8', 'A002_9', 'A002_A', 'A002_B', 'A002_C', 'A002_D', 'A003_1', 'A003_2', 'A004_1', 'A004_2', 'A004_3',
         'A004_4', 'A004_5', 'A004_6', 'A004_7', 'A004_8', 'A004_9', 'A005_1', 'A005_2', 'A005_3', 'A005_4', 'A005_5',
         'A005_6', 'A005_7', 'A005_8', 'A005_9', 'A005_A', 'A005_B', 'A005_C', 'A005_D', 'A005_E', 'A005_F', 'A005_G',
         'A005_H', 'A005_I', 'A005_J', 'A006_1', 'A006_2', 'A006_3', 'A006_4', 'A006_5', 'A006_6', 'A006_7', 'A006_8',
         'A006_9', 'A006_A', 'A006_B', 'A006_C', 'A006_D', 'A006_E', 'A006_F', 'A006_G', 'A007_1', 'A007_2', 'A007_3',
         'A007_4', 'A007_5', 'A007_6', 'A007_7', 'A007_8', 'A007_9', 'A007_A', 'A008_1', 'A008_2', 'A009_1', 'A009_2',
         'A009_3', 'A009_4', 'A009_5', 'A009_6', 'A009_7', 'A009_8', 'A009_9', 'A009_A', 'A009_B', 'A009_C', 'A010_1',
         'A010_2', 'A010_3', 'A010_4', 'A010_5', 'A010_6', 'A010_7', 'A010_8', 'A010_9', 'A010_A', 'A010_B', 'A010_C',
         'A010_D', 'A010_E', 'A011_1', 'A011_2', 'A011_3', 'A011_4', 'A011_5', 'A011_6', 'A011_7', 'A011_8', 'A011_9',
         'A011_A', 'A011_B', 'A011_C', 'A011_D', 'A011_E', 'A011_F', 'A011_G', 'A011_H', 'A011_I', 'A011_K', 'A012_1',
         'A012_2', 'A012_3', 'A012_4', 'A012_5', 'A012_6', 'A012_7', 'A012_8', 'A012_9', 'A012_A', 'A012_B', 'A012_C',
         'A012_D', 'A012_E', 'A012_F', 'A013_1', 'A013_2']