#! usr/bin/python
# coding=utf-8

import cnki.spiders.global_constant as global_constant

__author__ = 'roliy'


def get_cookie(response):
    cookies = response.headers.getlist('Set-Cookie')
    res = {
        "SID_kns": None,
        "ASP.NET_SessionId": None,
        "RsPerPage": str(global_constant.page_detail_num)
    }
    for item in cookies:
        if item.find("ASP.NET_SessionId") != -1:
            res["ASP.NET_SessionId"] = item.split("; ")[0].split("=")[1]
        if item.find("SID_kns") != -1:
            res["SID_kns"] = item.split("; ")[0].split("=")[1]
    return res


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
    """
    封装一个合法的查询url
    :param tag:
    :return:
    """
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
