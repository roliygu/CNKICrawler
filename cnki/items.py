# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class Author(scrapy.Item):
    @staticmethod
    def new_instance(name, url):
        res = Author()
        res["name"] = name.encode("utf-8").strip()
        res["url"] = url
        return res
    name = scrapy.Field()
    url = scrapy.Field()


class Source(scrapy.Item):
    @staticmethod
    def new_instance(text, url):
        res = Source()
        res["text"] = text.encode("utf-8").strip()
        res["url"] = url
        return res
    text = scrapy.Field()
    url = scrapy.Field()


class Title(scrapy.Item):
    @staticmethod
    def new_instance(text, url):
        res = Title()
        res["text"] = text.encode("utf-8").strip()
        res["url"] = url
        return res
    text = scrapy.Field()
    url = scrapy.Field()


class Reference(scrapy.Item):
    @staticmethod
    def new_instance(number, onclick):
        res = Reference()
        res["number"] = int(number)
        res["onclick"] = onclick
        return res
    number = scrapy.Field()
    onclick = scrapy.Field()


class Download(scrapy.Item):
    @staticmethod
    def new_instance(number, url):
        res = Download()
        res["number"] = int(number)
        res["url"] = url
        return res
    number = scrapy.Field()
    url = scrapy.Field()


class PaperAbstract(scrapy.Item):
    """
    论文概要
    """
    @staticmethod
    def new_instance(title, authors, source, publish_time, database, reference, download):
        res = PaperAbstract()
        res["title"] = title
        res["authors"] = authors
        res["source"] = source
        res["publish_time"] = publish_time.encode("utf-8").strip()
        res["database"] = database.encode("utf-8").strip()
        res["reference"] = reference
        res["download"] = download
        return res
    title = scrapy.Field()
    authors = scrapy.Field()
    source = scrapy.Field()
    publish_time = scrapy.Field()
    database = scrapy.Field()
    reference = scrapy.Field()
    download = scrapy.Field()


class TutorialItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass
