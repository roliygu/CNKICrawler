#! usr/bin/python
# coding=utf-8

import urllib2
import socket


def build_header():
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.3",
        "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, sdch",
        "Connection": "keep-alive",
    }
    return headers


def warp_header(dic):
    row_header = build_header()
    for key in dic.keys():
        row_header[key] = dic[key]
    return row_header


def retry_urlopen(uri, retry_time, data=None, time_out=3):
    if retry_time <= 0:
        raise AttributeError("retry_time is used up.")
    try:
        response = urllib2.urlopen(uri, data=data, timeout=time_out)
    except socket.timeout:
        return retry_urlopen(uri, retry_time - 1, data=data, time_out=time_out)
    except urllib2.URLError:
        return retry_urlopen(uri, retry_time - 1, data=data, time_out=time_out)
    return response
