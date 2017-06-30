# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class Author(scrapy.Item):
    name = scrapy.Field()
    url = scrapy.Field()


class Source(scrapy.Item):
    text = scrapy.Field()
    url = scrapy.Field()


class Title(scrapy.Item):
    text = scrapy.Field()
    url = scrapy.Field()


class Reference(scrapy.Item):
    number = scrapy.Field()
    onclick = scrapy.Field()


class Download(scrapy.Item):
    number = scrapy.Field()
    url = scrapy.Field()


class PaperAbstract(scrapy.Item):
    """
    论文概要
    """
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
