#! usr/bin/python
# coding=utf-8

__author__ = 'roliy'


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


def wrap_cookie(sid_kns, asp_session_id):
    """
    封装一个合法的cookie
    :param sid_kns:
    :param asp_session_id:
    :return: cnki cookie
    """
    return {
        "SID_kns": sid_kns,
        "ASP.NET_SessionId": asp_session_id
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
