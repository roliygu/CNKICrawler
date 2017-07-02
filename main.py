#! usr/bin/python
# coding=utf-8

import sys
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings


def main(argv):
    # 获取批量cookie
    process = CrawlerProcess(get_project_settings())
    process.crawl('cnki')
    process.start()

if __name__ == '__main__':
    main(sys.argv[1:])
