#! usr/bin/python
# coding=utf-8

import logging.handlers

__author__ = 'roliy'

# url
# default_result用来获取cookie
default_result_url = "http://kns.cnki.net/kns/brief/default_result.aspx"
# 用来注册cookie
search_handler_url = "http://kns.cnki.net/kns/request/SearchHandler.ashx?action=&NaviCode=A001_1&ua=1.15&PageName=ASP.brief_default_result_aspx&DbPrefix=SCDB&DbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDBINDEX.xml&db_opt=CJFQ%2CCDFD%2CCMFD%2CCPFD%2CIPFD%2CCCND&his=0&parentdb=SCDB&__=Thu%20Jun%2029%202017%2015%3A31%3A58%20GMT%2B0800%20(CST)"
# 测试是否能获取到详情
detail_test_url = "http://kns.cnki.net/kns/brief/brief.aspx?ctl=0bdf61dc-04e9-480a-a751-48730966dbe2&dest=%E5%88%86%E7%BB%84%EF%BC%9A%E5%8F%91%E8%A1%A8%E5%B9%B4%E5%BA%A6%20%E6%98%AF%202015&action=5&dbPrefix=SCDB&PageName=ASP.brief_default_result_aspx&Param=%e5%b9%b4+%3d+%272015%27&SortType=%e5%b9%b4&ShowHistory=1"

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
