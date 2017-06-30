#! usr/bin/python
# coding=utf-8

import scrapy

import cnki.spider_utils.util as spider_util
import global_constant
from cnki.paper_abstract import Author as AbstractAuthor
from cnki.paper_detail import Author as DetailAuthor
from cnki.paper_abstract import Download
from cnki.paper_abstract import PaperAbstract
from cnki.paper_abstract import Reference
from cnki.paper_abstract import Source
from cnki.paper_abstract import Title


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
        return self.request_abstract_list()

    def request_abstract_list(self):
        urls = [global_constant.detail_test_url]
        for url in urls:
            yield scrapy.Request(url=url, headers=self.header, cookies=self.cookie, callback=self.parse_abstract_list)

    def parse_abstract_list(self, response):
        rows = response.css("table.GridTableContent TR")
        detail_urls = []
        for row in rows[1:]:
            paper_abstract = parse_paper_abstract(row)
            detail_urls.append(global_constant.url_prefix + paper_abstract["title"]["url"])
        for url in detail_urls:
            yield scrapy.Request(url=url, headers=self.header, cookies=self.cookie, callback=parse_paper_detail)

    index = 1

    def parse_detail(self, response):
        filename = 'tmp/test_detail_%d.html' % self.index
        self.index += 1
        with open(filename, 'wb') as f:
            f.write(response.body)


def parse_paper_detail(response):
    """

    :param response:
    :return:
    """
    wxmain = response.css("div.wxmain").css("div.wxTitle")
    title = wxmain.css("h2::text").extract_first()
    print title
    # authors_html = wxmain.css("div.author").css("span")
    # for author_html in authors_html:
    #     onclick = author_html.css("a::attr(onclick)").extract_first().strip()
    #     slices = onclick[onclick.find("(") + 1:onclick.find(")")].split(",")
    #     author = DetailAuthor.new_instance(
    #         slices[0],
    #         slices[1],
    #         slices[2]
    #     )
    #     print author


def parse_paper_abstract(row):
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
        author = AbstractAuthor().new_instance(
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
        cols[6].xpath("a.KnowledgeNetLink/@onClick").extract_first()  # todo 取到的是None
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
