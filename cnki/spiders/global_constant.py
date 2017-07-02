#! usr/bin/python
# coding=utf-8

import logging.handlers

__author__ = 'roliy'

# url
url_prefix = "http://kns.cnki.net"
# default_result用来获取cookie
default_result_url = "http://kns.cnki.net/kns/brief/default_result.aspx"
# 用来注册cookie和获取查询首页
search_handler_url = "http://kns.cnki.net/kns/request/SearchHandler.ashx"
# 测试是否能获取到详情
detail_test_url = "http://kns.cnki.net/kns/brief/brief.aspx?ctl=0bdf61dc-04e9-480a-a751-48730966dbe2&dest=%E5%88%86%E7%BB%84%EF%BC%9A%E5%8F%91%E8%A1%A8%E5%B9%B4%E5%BA%A6%20%E6%98%AF%202015&action=5&dbPrefix=SCDB&PageName=ASP.brief_default_result_aspx&Param=%e5%b9%b4+%3d+%272015%27&SortType=%e5%b9%b4&ShowHistory=1"
abstract_list_url = "http://kns.cnki.net/kns/brief/brief.aspx"
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
handler.setFormatter(logging.Formatter('%(asctime)s %(filename)s [line:%(lineno)d] %(levelname)s %(message)s', '%a, %d %b %Y %H:%M:%S'))
logger.addHandler(handler)

tag = "A"
# 每个批的大小
batch_size = 10
total_page_num = None
total_paper_num = None
