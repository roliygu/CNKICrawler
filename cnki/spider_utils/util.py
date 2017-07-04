#! usr/bin/python
# coding=utf-8

import requests

import cnki.spiders.global_constant as global_constant

__author__ = 'roliy'

LOGGER = global_constant.logger


def get_cookie(tag):
    cookie_response = requests.post(global_constant.cookie_url)
    cookie = {
        "ASP.NET_SessionId": cookie_response.cookies["ASP.NET_SessionId"],
        "SID_kns": cookie_response.cookies["SID_kns"],
        "RsPerPage": str(global_constant.page_detail_num)
    }
    url = build_search_url(tag)
    register_response = requests.get(url, cookies=cookie)
    if register_response.status_code != 200:
        LOGGER.error("Register failure")
        return None
    else:
        LOGGER.info("Got cookie %s", str(cookie))
        return cookie


def build_abstract_first_list_url_by_year(year):
    params = {
        "dest": "分组：发表年度 是 %s" % year,
        "action": "5",
        "dbPrefix": "SCDB",
        "PageName": "ASP.brief_default_result_aspx",
        "Param": "年 = '%s'" % year,
        "SortType": "年",
        "ShowHistory": "1",
        "DisplayMode": "listmode",
    }
    url = global_constant.abstract_list_url + "?"
    for key, value in params.items():
        url += key + "=" + value + "&"
    return url[:-1]


def build_abstract_list_url(page_num):
    """
    封装page_num页的概要页请求url
    :param page_num:
    :return:
    """
    params = {
        "curpage": str(page_num),
        "RecordsPerPage": str(global_constant.page_detail_num),
        "QueryID": "36",
        "ID": "",
        "turnpage": "1",
        "tpagemode": "L",
        "dbPrefix": "SCDB",
        "Fields": "",
        "DisplayMode": "listmode",
        "PageName": "ASP.brief_default_result_aspx"
    }
    url = global_constant.abstract_list_url + "?"
    for key, value in params.items():
        url += key + "=" + value + "&"
    return url[:-1]


def build_search_url(tag):
    params = {
        "action": "",
        "NaviCode": tag,
        "ua": "1.15",
        "formDefaultResult": "",
        "PageName": "ASP.brief_default_result_aspx",
        "DbPrefix": "SCDB",
        "DbCatalog": "%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93",
        "ConfigFile": "SCDBINDEX.xml",
        "db_opt": "CJFQ%2CCDFD%2CCMFD%2CCPFD%2CIPFD%2CCCND",
        "his": "0",
        "parentdb": "SCDB"
    }
    url = global_constant.search_handler_url + "?"
    for key, value in params.items():
        url += key + "=" + value + "&"
    return url[:-1]  # 多拼一个&
