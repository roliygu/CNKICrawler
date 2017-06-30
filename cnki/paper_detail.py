# -*- coding: utf-8 -*-

# 论文详情页面的Model

import scrapy

__author__ = 'roliy'


class AbstractLink(scrapy.Item):
    @staticmethod
    def new_instance(keyword, text, code):
        abstract_search = AbstractLink()
        abstract_search["keyword"] = keyword.replace("\'", "")
        abstract_search["text"] = text.replace("\'", "")
        abstract_search["code"] = code.replace("\'", "")
        return abstract_search
    keyword = scrapy.Field()
    text = scrapy.Field()
    code = scrapy.Field()


class AuthorLink(AbstractLink):
    pass


class KeyWordLink(AbstractLink):
    pass


class TutorLink(AbstractLink):
    pass


class OrganizationLink(AbstractLink):
    pass


class PaperDetail(scrapy.Item):
    @staticmethod
    def new_instance(url, title, authors, organizations, abstract,  page_num, size,
                     catalog=None, tutors=None, doi=None, keywords=None, download_num=None):
        res = PaperDetail()
        res["url"] = url
        res["title"] = title
        res["authors"] = authors
        res["organizations"] = organizations
        res["abstract"] = abstract
        res["tutors"] = tutors
        res["catalog"] = catalog
        res["page_num"] = page_num
        res["size"] = size
        res["doi"] = doi
        res["keywords"] = keywords
        res["download_num"] = download_num
        return res
    url = scrapy.Field()
    tutors = scrapy.Field()
    title = scrapy.Field()
    authors = scrapy.Field()
    abstract = scrapy.Field()
    organizations = scrapy.Field()
    doi = scrapy.Field()
    catalog = scrapy.Field()
    page_num = scrapy.Field()
    keywords = scrapy.Field()
    size = scrapy.Field()
    download_num = scrapy.Field()
