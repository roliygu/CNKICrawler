#! usr/bin/python
# coding=utf-8


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


