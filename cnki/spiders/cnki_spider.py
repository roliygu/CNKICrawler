#! usr/bin/python
# coding=utf-8

import sys
import copy
import cnki.spider_utils.util as spider_util
import global_constant
from cnki.paper_abstract import *
from cnki.paper_detail import *

__author__ = 'roliy'

reload(sys)
sys.setdefaultencoding('utf-8')
LOGGER = global_constant.logger


class CNKICookieSpider(scrapy.Spider):
    name = "cnki"

    def start_requests(self):
        request_cookie_urls = [global_constant.default_result_url for i in range(global_constant.max_cookie_num)]
        for i, url in enumerate(request_cookie_urls):
            yield scrapy.Request(url=url, method="POST", callback=self.parse_cookie,
                                 dont_filter=True, meta={'cookiejar': i}, priority=100)

    def parse_cookie(self, response):
        requested_cookie = spider_util.get_cookie(response)
        LOGGER.info("Get Cookie is [%s]", str(requested_cookie))
        global_constant.cookie_batch.append(requested_cookie)
        return self.register_cookie({"cookie": requested_cookie})

    def register_cookie(self, meta):
        """
        step 3. 得到的cookie并不是合法的,需要注册,并且设置当前查询的tag
        :return:
        """
        tag = "A"
        urls = [spider_util.build_search_url(tag)]
        LOGGER.info("Register tag [%s]", tag)
        for url in urls:
            yield scrapy.Request(url=url, cookies=meta["cookie"], dont_filter=True, callback=self.parse_register)

    def parse_register(self, response):
        """
        step 4. cookie注册成功
        :param response:
        :return:
        """
        LOGGER.info("Register successful, and parse it")


class CNKISpider(scrapy.Spider):
    name = "cnki_cookie"
    cookie = {}
    header = spider_util.build_request_header()
    global_constant.logger.info("Send header is %s", str(header))

    def start_requests(self):
        """
        爬虫的起点
        :return:
        """
        # return self.test()
        LOGGER.info("Starting")
        return self.request_cookie()

    def request_cookie(self, only_update=False):
        """
        step 1. 请求cookie
        :return:
        """
        LOGGER.info("Request Cookie")
        request_cookie_urls = [global_constant.default_result_url]
        for url in request_cookie_urls:
            yield scrapy.Request(url=url, method="POST", callback=self.parse_cookie, headers=self.header,
                                 dont_filter=True, cookies={})

    def parse_cookie(self, response):
        """
        step 2. 解析response,得到cookie
        :param response:
        :return:
        """
        self.cookie = spider_util.get_cookie(response)
        LOGGER.info("Get Cookie is [%s]", str(self.cookie))
        return self.register_cookie()

    def register_cookie(self):
        """
        step 3. 得到的cookie并不是合法的,需要注册,并且设置当前查询的tag
        :return:
        """
        tag = "A"
        urls = [spider_util.build_search_url(tag)]
        LOGGER.info("Register tag [%s]", tag)
        for url in urls:
            yield scrapy.Request(url=url, headers=self.header, cookies=self.cookie, callback=self.parse_register)

    def parse_register(self, response):
        """
        step 4. cookie注册成功
        :param response:
        :return:
        """
        LOGGER.info("Register successful, and parse it")
        return self.request_first_abstract_list()

    def request_first_abstract_list(self):
        """
        step 5. 请求要查询的第一页结果，主要目的是为了获取论文总数和页数
        :return:
        """
        LOGGER.info("Request first abstract list page")
        urls = [global_constant.detail_test_url]
        for url in urls:
            yield scrapy.Request(url=url, headers=self.header, cookies=self.cookie,
                                 callback=self.parse_first_abstract_list)

    total_page_num = None

    def parse_first_abstract_list(self, response):
        """
        step 6. 解析论文总数和概要页数
        :param response:
        :return:
        """
        LOGGER.info("Got first abstract list page, and parse it")
        total_num = response.css("div.pagerTitleCell::text").extract_first()
        global_constant.logger.info("TotalNum is %s", total_num)
        self.total_page_num = int(response.css("span.countPageMark::text").extract_first().split("/")[1])
        global_constant.logger.info("TotalPageNum is %d", self.total_page_num)
        return self.request_all_abstract_list()

    meta = {}

    def request_all_abstract_list(self):
        """
        step 7. 构造每页概要列表请求
        :return:
        """
        total_page_num = 21
        interval = 10
        start = 1
        cookie_count = 0
        while start < total_page_num:
            _start = start
            _end = start + interval
            if _end > total_page_num:
                _end = total_page_num
            start += interval
            LOGGER.info("Ready for [%d, %d]", _start, _end)
            LOGGER.info("Request section [%d, %d)", _start, _end)
            for i in range(_start, _end):
                urls = [spider_util.build_abstract_list_url(i)]
                meta = {
                    "current_page": i
                }
                cookie = copy.deepcopy(global_constant.cookie_batch[cookie_count])
                LOGGER.error("Use cookie %s", cookie)
                for url in urls:
                    yield scrapy.Request(url=url, headers=self.header, cookies=cookie,
                                         callback=self.parse_abstract_list, meta=meta)
            cookie_count += 1

    def parse_abstract_list(self, response):
        LOGGER.info("Got abstract list page [%d], and start parse it", response.meta["current_page"])
        rows = response.css("table.GridTableContent TR")
        if len(rows) == 0:
            LOGGER.error("Rows is empty, page [%d]", response.meta["current_page"])
        detail_urls = []
        for row in rows[1:]:
            paper_abstract = parse_paper_abstract(row)
            detail_urls.append(global_constant.url_prefix + paper_abstract["title"]["url"])
        return self.request_paper_detail(detail_urls)

    def request_paper_detail(self, urls):
        for url in urls:
            yield scrapy.Request(url=url, headers=self.header, cookies=self.cookie, callback=self.parse_paper_detail)

    def parse_paper_detail(self, response):
        """
        step 7: 解析论文详情页面
        :param response:
        :return:
        """
        (title, authors, organizations) = parse_paper_detail_wxmain(response)
        (abstract, tutors, catalog, keywords, doi) = parse_paper_detail_wxinfo(response)
        (download_num, page_num, size) = parse_paper_detail_total(response)

        paper_detail = PaperDetail.new_instance(
            url=response.request.url, title=title, authors=authors, organizations=organizations, abstract=abstract,
            tutors=tutors, catalog=catalog, keywords=keywords, doi=doi, page_num=page_num, download_num=download_num,
            size=size
        )

        print paper_detail["title"]
        w_file.write(paper_detail["title"])
        w_file.write(paper_detail["url"] + "\n")

    def test(self):
        return self.request_paper_detail([
            "http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFQ&dbname=CAPJLAST&filename=FUHE20160905000&uid=WEEvREcwSlJHSldRa1Fhb09jMjQxYytZYjJOR0h1VzNHVHJjS29sZ0kybz0=$9A4hF_YAuvQ5obgVAqNKPCYcEjKensW4ggI8Fm4gTkoUKaID8j8gFw!!&v=MzEyNjRUM2ZscVdNMENMTDdSN3FlWU9ab0Zpam1Vci9OSlYwPUl6akRhN0c0SDlmTXBvOUFaT3NQWXc5TXptUm42ajU3"
        ])





w_file = open("./tmp/output", "w")


def parse_paper_detail_total(response):
    div_total = response.css("div.total").css("span").css("b::text").extract()
    download_num = div_total[0]
    page_num = div_total[1]
    size = div_total[2]
    return download_num, page_num, size


def parse_paper_detail_wxinfo(response):
    abstract = None
    tutors = None
    catalog = None
    keywords = None
    doi = None
    wx_info = response.css("div.wxInfo").css("div")
    for p in wx_info.css("p"):
        label_id = p.css("label::attr(id)").extract_first()
        if label_id is not None:
            label_id = label_id.strip()
            if label_id == "catalog_ABSTRACT":
                abstract = p.css("span::text").extract_first()
            elif label_id == "catalog_TUTOR":  # todo 有点问题,拿到的每个人会重复一遍
                tutors = []
                for tutor_html in p.css("a"):
                    onclick = tutor_html.css("::attr(onclick)").extract_first()
                    slices = onclick[onclick.find("(") + 1:onclick.rfind(")")].split(",")
                    tutor = TutorLink.new_instance(
                        slices[0], slices[1], slices[2]
                    )
                    tutors.append(tutor)
            elif label_id == "catalog_ZTCLS":  # todo 也有重复的问题
                catalog = p.css("p::text").extract_first()
            elif label_id == "catalog_KEYWORD":
                keywords = []
                for keyword_html in p.css("a"):
                    onclick = keyword_html.css("::attr(onclick)").extract_first()
                    slices = onclick[onclick.find("(") + 1:onclick.rfind(")")].split(",")
                    keyword = KeyWordLink.new_instance(
                        slices[0], slices[1], slices[2]
                    )
                    keywords.append(keyword)
            elif label_id == "catalog_ZCDOI":
                doi = p.css("p::text").extract_first()
    return abstract, tutors, catalog, keywords, doi


def parse_paper_detail_wxmain(response):
    """
    解析论文详情页中的wxmain
    :param response:
    :return:
    """
    wxmain = response.css("div.wxmain").css("div.wxTitle")
    title = "".join(wxmain.css("h2::text").extract())
    authors_html = wxmain.css("div.author").css("span")
    authors = []
    for author_html in authors_html:
        onclick = author_html.css("a::attr(onclick)").extract_first().strip()
        slices = onclick[onclick.find("(") + 1:onclick.rfind(")")].split("\',\'")
        if len(slices) != 3:
            LOGGER.error("Slices [%s]", onclick)
        author = AuthorLink.new_instance(
            slices[0], slices[1], slices[2]
        )
        authors.append(author)

    organizations_html = wxmain.css("div.orgn").css("span")
    organizations = []
    for organization_html in organizations_html:
        onclick = organization_html.css("a::attr(onclick)").extract_first().strip()
        slices = onclick[onclick.find("(") + 1:onclick.rfind(")")].split(",")
        organization = OrganizationLink.new_instance(
            slices[0], slices[1], slices[2]
        )
        organizations.append(organization)

    return title, authors, organizations


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
    if ref_num_html is not None:
        ref_num = ref_num_html.encode("utf-8")
    reference = Reference.new_instance(
        ref_num,
        cols[6].xpath("a.KnowledgeNetLink/@onClick").extract_first()  # todo 取到的是None
    )

    download_num = "0"
    download_num_html = cols[7].xpath("span.downloadCount/a/text()").extract_first()
    if download_num_html is not None:
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
