# -*- coding: utf-8 -*-

# 论文详情页面的Model

import scrapy

__author__ = 'roliy'


class AbstractSearch(scrapy.Item):
    keyword = scrapy.Field
    text = scrapy.Field
    code = scrapy.Field

    @staticmethod
    def new_instance(keyword, text, code):
        abstract_search = AbstractSearch()
        abstract_search["keyword"] = keyword
        abstract_search["text"] = text
        abstract_search["code"] = code
        return abstract_search


class Author(AbstractSearch):
    pass


class Tutor(AbstractSearch):
    """
    导师
    """
    pass


class Organization(AbstractSearch):
    """
    论文发表机构
    """
    pass


class PaperDetail(scrapy.Item):
    @staticmethod
    def new_instance(title, authors, organizations, abstract, catalog, page_num, size, tutors=None):
        res = PaperDetail()
        res["title"] = title
        res["authors"] = authors
        res["organizations"] = organizations
        res["abstract"] = abstract
        res["tutors"] = tutors
        res["catalog"] = catalog
        res["page_num"] = page_num
        res["size"] = size
        return res
    tutors = scrapy.Field
    title = scrapy.Field
    authors = scrapy.Field
    abstract = scrapy.Field
    organizations = scrapy.Field
    catalog = scrapy.Field
    page_num = scrapy.Field
    size = scrapy.Field
