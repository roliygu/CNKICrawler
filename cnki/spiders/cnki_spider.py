#! usr/bin/python
# coding=utf-8

import scrapy
import cnki.spider_utils.util as spider_util
import global_constant
from scrapy.loader import ItemLoader
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
        print parse_paper_abstract_with_xpath(rows[1])
        # for row in rows[1:]:
        #     paper = parse_paper_abstract_with_xpath(row)
        #     print paper["title"]["text"]
        filename = 'tmp/test_detail.html'
        with open(filename, 'wb') as f:
            f.write(response.body)
        global_constant.logger.info('Saved file %s' % filename)


def parse_paper_abstract_with_xpath(row):
    """
    基于xpath的解析
    :param row:
    :return:
    """
    cols = row.xpath("td")

    title_col = cols[1]
    title = Title.new_instance(
        title_col.xpath("a/text()").extract_first(),
        title_col.xpath("a/@href").extract_first()
    )

    authors = []
    authors_col = cols[2]
    for author_html in authors_col.xpath("a"):
        author = Author().new_instance(
            author_html.xpath("text()").extract_first(),
            author_html.xpath("@href").extract_first()
        )
        authors.append(author)

    source_col = cols[3]
    source = Source.new_instance(
        source_col.xpath("a/text()").extract_first(),
        source_col.xpath("a/@href").extract_first()
    )

    ref_num = "0"
    ref_num_html = cols[6].xpath("a.KnowledgeNetLink/text()").extract_first()
    if ref_num_html is None:
        global_constant.logger.warn("reference is 0")
    else:
        ref_num = ref_num_html.encode("utf-8")
    reference = Reference.new_instance(
        ref_num,
        cols[6].xpath("a.KnowledgeNetLink/@onClick").extract_first()    # todo 取到的是None
    )

    download_num = "0"
    download_num_html = cols[7].xpath("span.downloadCount/a/text()").extract_first()
    if download_num_html is None:
        global_constant.logger.warn("download is 0")
    else:
        download_num = download_num_html.encode("utf-8")
    download = Download.new_instance(
        download_num,
        cols[7].xpath("a/@href").extract_first()
    )

    return PaperAbstract.new_instance(
        title, authors, source,
        cols[4].xpath("text()").extract_first(),
        cols[5].xpath("text()").extract_first(),
        reference, download
    )
