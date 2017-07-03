#! usr/bin/python
# coding=utf-8

import sys
import math
import cnki.spider_utils.util as spider_util
import global_constant
from cnki.paper_abstract import *
from cnki.paper_detail import *

__author__ = 'roliy'

reload(sys)
sys.setdefaultencoding('utf-8')
LOGGER = global_constant.logger


class CNKISpider(scrapy.Spider):
    name = "cnki"
    cookie = {}

    def start_requests(self):
        LOGGER.info("Starting CNKISpider")
        return self.request_single_cookie()

    def request_single_cookie(self):
        """

        :return:
        """
        LOGGER.info("Request Cookie")
        request_cookie_urls = [global_constant.default_result_url]
        for url in request_cookie_urls:
            yield scrapy.Request(url=url, method="POST", callback=self.parse_cookie, dont_filter=True)

    def request_batch_cookie(self, batch_seq_no):
        LOGGER.info("Request Batch Cookie, order is [%d]", batch_seq_no)
        request_cookie_urls = [global_constant.default_result_url for i in range(batch_seq_no)]
        for i, url in enumerate(request_cookie_urls):
            yield scrapy.Request(url=url, method="POST", callback=self.parse_batch_cookie, dont_filter=True,
                                 meta={"cookiejar": i})

    def parse_batch_cookie(self, response):
        requested_cookie = spider_util.get_cookie(response)
        LOGGER.info("Got Batch Cookie is [%s]", str(requested_cookie))
        urls = [spider_util.build_search_url(global_constant.tag)]
        LOGGER.info("Register cookie [%s] for tag [%s]", str(requested_cookie), global_constant.tag)
        for url in urls:
            yield scrapy.Request(url=url, cookies=requested_cookie, callback=self.parse_batch_register,
                                 dont_filter=True,
                                 meta={"cookie": requested_cookie, "cookiejar": response.meta["cookiejar"]})

    def parse_cookie(self, response):
        cookie = spider_util.get_cookie(response)
        LOGGER.info("Got Cookie is [%s]", str(cookie))
        urls = [spider_util.build_search_url(global_constant.tag)]
        LOGGER.info("Register cookie [%s] for tag [%s]", str(cookie), global_constant.tag)
        for url in urls:
            yield scrapy.Request(url=url, cookies=cookie, callback=self.parse_register, dont_filter=True,
                                 meta={"cookie": cookie})

    def parse_register(self, response):
        LOGGER.info("Register cookie [%s] successful", response.meta["cookie"])
        return self.request_first_abstract_list(response.meta["cookie"])

    def parse_batch_register(self, response):
        LOGGER.info("Register cookie batch [%d] successful, cookie is [%s]", response.meta["cookiejar"],
                    response.meta["cookie"])
        batch_seq = int(response.meta["cookiejar"])
        start = batch_seq * global_constant.batch_size + 1
        end = start + global_constant.batch_size
        if end > global_constant.total_page_num + 1:
            end = global_constant.total_page_num
        return self.request_section_abstract_list(start, end, response.meta["cookie"])

    def request_first_abstract_list(self, cookie):
        LOGGER.info("Request first abstract list page")
        urls = [global_constant.detail_test_url]
        for url in urls:
            yield scrapy.Request(url=url, cookies=cookie, callback=self.parse_first_abstract_list)

    def parse_first_abstract_list(self, response):
        LOGGER.info("Got first abstract list page")
        total_paper_num = parse_total_paper_num(response.css("div.pagerTitleCell::text").extract_first())
        global_constant.logger.info("TotalPaperNum is %d", total_paper_num)
        # total_page_num = int(response.css("span.countPageMark::text").extract_first().split("/")[1])
        total_page_num = 200
        global_constant.logger.info("TotalPageNum is %d", total_page_num)
        global_constant.total_paper_num = total_paper_num
        global_constant.total_page_num = total_page_num
        return self.request_all_abstract_list()

    def request_all_abstract_list(self):
        total_page_num = global_constant.total_page_num
        LOGGER.info("Receive total page [%d]", global_constant.total_page_num)
        batch_num = int(math.ceil(total_page_num * 1.0 / global_constant.batch_size))
        return self.request_batch_cookie(batch_num)

    def request_section_abstract_list(self, start, end, cookie):
        LOGGER.info("Request page section [%d, %d)", start, end)
        for i in range(start, end):
            urls = [spider_util.build_abstract_list_url(i)]
            meta = {
                "current_page": i,
                "cookie": cookie
            }
            for url in urls:
                yield scrapy.Request(url=url, cookies=cookie,
                                     callback=self.parse_abstract_list, meta=meta, dont_filter=True)

    def parse_abstract_list(self, response):
        LOGGER.info("Got abstract list page [%d], and start parse it", response.meta["current_page"])
        rows = response.css("table.GridTableContent TR")
        LOGGER.info("Rows number is [%d] in page [%d]", len(rows), response.meta["current_page"])
        if len(rows) == 0:
            LOGGER.error("Rows is empty, page [%d]", response.meta["current_page"])
        detail_urls = []
        for row in rows[1:]:
            paper_abstract = parse_paper_abstract(row)
            detail_urls.append(global_constant.url_prefix + paper_abstract["title"]["url"])
            # print global_constant.url_prefix + paper_abstract["title"]["url"]
        return self.request_paper_detail(detail_urls, response.meta["cookie"])

    def request_paper_detail(self, urls, cookie):
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse_paper_detail, dont_filter=True, cookies=cookie)

    def parse_paper_detail(self, response):
        (title, authors, organizations) = parse_paper_detail_wxmain(response)
        (abstract, tutors, catalog, keywords, doi) = parse_paper_detail_wxinfo(response)
        (download_num, page_num, size) = parse_paper_detail_total(response)

        paper_detail = PaperDetail.new_instance(
            url=response.request.url, title=title, authors=authors, organizations=organizations, abstract=abstract,
            tutors=tutors, catalog=catalog, keywords=keywords, doi=doi, page_num=page_num, download_num=download_num,
            size=size
        )

        print paper_detail["title"]
        w_file.write(paper_detail["title"] + "\n")
        # w_file.write(paper_detail["url"] + "\n")

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


def parse_total_paper_num(string):
    sum = 0
    for i in string:
        if i >= u'0' and i <= u'9':
            sum *= 10
            sum += int(i)
    return sum


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
