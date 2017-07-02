#! usr/bin/python
# coding=utf-8

__author__ = 'roliy'

import cnki.spiders.global_constant as global_constant


def get_cookie(response):
    cookies = response.headers.getlist('Set-Cookie')
    res = {
        "SID_kns": None,
        "ASP.NET_SessionId": None,
        "RsPerPage": 50
    }
    for item in cookies:
        if item.find("ASP.NET_SessionId") != -1:
            res["ASP.NET_SessionId"] = item.split("; ")[0].split("=")[1]
        if item.find("SID_kns") != -1:
            res["SID_kns"] = item.split("; ")[0].split("=")[1]
    return res


def get_request_cookies(response):
    """
    获取request的cookie
    :param response:  ['SID_kns=123118']
    :return: request's cookie
    """
    return response.request.headers.getlist('Cookie')


def get_response_cookies(response):
    """
    获取response的cookie
    :param response: ['ASP.NET_SessionId=jj1wtcinhsxmohcdgbye5wwe; path=/; HttpOnly', 'Ecp_ClientId=2170629155304878469; domain=cnki.net; expires=Tue, 29-Jun-2117 07:53:18 GMT; path=/; HttpOnly', 'Ecp_IpLoginFail=170629124.205.46.130; domain=cnki.net; expires=Sun, 02-Jul-2017 07:53:18 GMT; path=/; HttpOnly']
    :return: response's cookie
    """
    return response.headers.getlist('Set-Cookie')


def build_abstract_list_url(page_num):
    """
    封装page_num页的概要页请求url
    :param page_num:
    :return:
    """
    params = {
        "curpage": str(page_num),
        "RecordsPerPage": "50",
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


def wrap_cookie(sid_kns, asp_session_id):
    """
    封装一个合法的cookie
    :param sid_kns:
    :param asp_session_id:
    :return: cnki cookie
    """
    return {
        "SID_kns": sid_kns,
        "ASP.NET_SessionId": asp_session_id,
        "RsPerPage": 50
    }


def build_request_header():
    """
    封装一个合法的header
    :return:
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.3",
        "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, sdch",
        "Connection": "keep-alive",
    }
    return headers
