#! usr/bin/python
# coding=utf-8

import scrapy
import cnki.spider_utils.util as spider_util
import global_constant
from cnki.items import PaperAbstract
from cnki.items import Author
from cnki.items import Title
from cnki.items import Source
from cnki.items import Reference
from cnki.items import Download

__author__ = 'roliy'


class CNKISpider(scrapy.Spider):
    name = "cnki"
    cookie = {}
    header = spider_util.build_request_header()
    global_constant.logger.info("Send header is %s", str(header))

    def start_requests(self):
        return self.request_cookie()

    def request_cookie(self):
        """
        请求cookie
        :return:
        """
        request_cookie_urls = [global_constant.default_result_url]
        for url in request_cookie_urls:
            yield scrapy.Request(url=url, method="POST", callback=self.parse_cookie, headers=self.header)

    def parse_cookie(self, response):
        """
        解析response,得到cookie
        :param response:
        :return:
        """
        sid_kns = str.split(spider_util.get_request_cookies(response)[0], "=")[1]
        asp_session_id = str.split(spider_util.get_response_cookies(response)[0], "; ")[0].split("=")[1]
        self.cookie = spider_util.wrap_cookie(sid_kns, asp_session_id)
        global_constant.logger.info("Get cookie is %s", str(self.cookie))
        return self.register_cookie()

    def register_cookie(self):
        """
        得到的cookie并不是合法的,需要注册
        :return:
        """
        urls = [global_constant.search_handler_url]
        for url in urls:
            yield scrapy.Request(url=url, headers=self.header, cookies=self.cookie, callback=self.parse_register)

    def parse_register(self, response):
        # do something with response
        return self.test_request_detail()

    def test_request_detail(self):
        urls = [global_constant.detail_test_url]
        for url in urls:
            yield scrapy.Request(url=url, headers=self.header, cookies=self.cookie, callback=self.test_parse_detail)

    def test_parse_detail(self, response):
        rows = response.css("table.GridTableContent TR")
        for row in rows[1:]:
            paper = wrap_paper_abstract(row)
            print paper["title"]["text"]
        # print response.css("a.KnowledgeNetLink")
        filename = 'tmp/test_detail.html'
        with open(filename, 'wb') as f:
            f.write(response.body)
        global_constant.logger.info('Saved file %s' % filename)


def wrap_paper_abstract(row):
    """

    :param row: Response[TR]
    :return:
    """
    paper_abstract = PaperAbstract()

    cols = row.css("td")

    title_col = cols[1]
    title = Title()
    title["text"] = title_col.css("a::text").extract_first().encode("utf-8")
    title["url"] = title_col.css("a::attr(href)").extract_first()
    paper_abstract["title"] = title

    authors = []
    authors_col = cols[2]
    for author_html in authors_col.css("a"):
        author = Author()
        author["name"] = author_html.css("a::text").extract_first().encode("utf-8")
        author["url"] = author_html.css("a::attr(href)").extract_first()
        authors.append(author)
    paper_abstract["authors"] = authors

    source_col = cols[3]
    source = Source()
    source["text"] = source_col.css("a::text").extract_first().encode("utf-8")
    source["url"] = source_col.css("a::attr(href)").extract_first()
    paper_abstract["source"] = source

    paper_abstract["publish_time"] = cols[4].css("td::text").extract_first().encode("utf-8")
    paper_abstract["database"] = cols[5].css("td::text").extract_first().encode("utf-8")

    reference = Reference()
    ref_num_html = cols[6].css("a.KnowledgeNetLink::text").extract_first()
    if ref_num_html is None:
        global_constant.logger.warn("reference is 0")
        reference["number"] = "0"
    else:
        reference["number"] = ref_num_html.encode("utf-8")
    reference["onclick"] = cols[6].css("a.KnowledgeNetLink::attr(onClick)").extract_first()  # todo 取到的是None
    paper_abstract["reference"] = reference

    download = Download()
    download_num_html = cols[7].css("span.downloadCount").css("a::text").extract_first()
    if download_num_html is None:
        global_constant.logger.warn("download is 0")
        download["number"] = "0"
    else:
        download["number"] = download_num_html.encode("utf-8")
    download["url"] = cols[7].css("a.briefDl_D::attr(href)").extract_first().encode("utf-8")
    paper_abstract["download"] = download

    return paper_abstract



