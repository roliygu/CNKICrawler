#! usr/bin/python
# coding=utf-8

import requests

__author__ = 'roliy'

# url
home_page = "http://www.cnki.net/"
login = "http://kns.cnki.net/kns/Request/login.aspx?pt=1&p=/kns&td=1499197894225"
default_result = "http://kns.cnki.net/kns/brief/default_result.aspx"
search_handler = "http://kns.cnki.net/kns/request/SearchHandler.ashx?action=&NaviCode=A001_1&ua=1.15&PageName=ASP.brief_default_result_aspx&DbPrefix=SCDB&DbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDBINDEX.xml&db_opt=CJFQ%2CCDFD%2CCMFD%2CCPFD%2CIPFD%2CCCND&his=0&parentdb=SCDB&__=Wed%20Jul%2005%202017%2003%3A57%3A27%20GMT%2B0800%20(CST)"
year_group = "http://kns.cnki.net/kns/group/doGroupLeft.aspx?action=1&Param=ASP.brief_default_result_aspx%23SCDB/%u53D1%u8868%u5E74%u5EA6/%u5E74%2Ccount%28*%29/%u5E74/%28%u5E74%2C%27date%27%29%23%u5E74%24desc/1000000%24/-/40/40000/ButtonView&cid=0&clayer=0&__=Wed%20Jul%2005%202017%2003%3A57%3A29%20GMT%2B0800%20(CST)"
year_2007_first = "http://kns.cnki.net/kns/brief/brief.aspx?ctl=2595d38c-21f6-445c-9242-a1869dbcc3d5&dest=%E5%88%86%E7%BB%84%EF%BC%9A%E5%8F%91%E8%A1%A8%E5%B9%B4%E5%BA%A6%20%E6%98%AF%202007&action=5&dbPrefix=SCDB&PageName=ASP.brief_default_result_aspx&Param=%e5%b9%b4+%3d+%272007%27&SortType=%e5%b9%b4&ShowHistory=1"
# param

default_result_form = {
    "txt_1_sel": "SU$%=|",
    "txt_1_value1": "",
    "txt_1_special1": "%",
    "txt_extension": "",
    "expertvalue": "",
    "cjfdcode": "",
    "currentid": "txt_1_value1",
    "dbJson": "coreJson",
    "dbPrefix": "SCDB",
    "db_opt": "CJFQ,CDFD,CMFD,CPFD,IPFD,CCND",
    "db_value": "",
    "hidTabChange": "",
    "hidDivIDS": "",
    "singleDB": "SCDB",
    "db_codes": "",
    "singleDBName": "",
    "selectbox": "A001_1",
    "selecteboxname": "自然科学研究的方针政策",
    "againConfigJson": "false",
    "action": "scdbsearch",
    "ua": "1.15"
}


def main():
    session = requests.session()
    cookie = {}
    home_page_response = requests.get(home_page)
    for key, value in home_page_response.cookies.items():
        print key, value
        cookie[key] = value
    login_response = requests.get(login, cookies=cookie)
    for key, value in login_response.cookies.items():
        print key, value
        cookie[key] = value
    default_result_response = requests.post(default_result, data=default_result_form, cookies=cookie)
    for key, value in default_result_response.cookies.items():
        print key, value
        cookie[key] = value
    search_handler_response = requests.get(search_handler, cookies=cookie)
    for key, value in search_handler_response.cookies.items():
        print key, value
        cookie[key] = value
    year_group_response = requests.get(year_group, cookies=cookie)
    for key, value in year_group_response.cookies.items():
        print key, value
        cookie[key] = value
    print year_group_response.content
    year_2007_first_response = requests.get(year_2007_first, cookies=cookie)
    print year_2007_first_response.content
