#! usr/bin/python
# coding=utf-8

import sys
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
reload(sys)
sys.setdefaultencoding('utf-8')


def main(argv):
    # 获取批量cookie
    process = CrawlerProcess(get_project_settings())
    process.crawl('cnki')
    process.start()


def check_duplicate():
    with open("./tmp/output", "r") as read_file:
        lines = read_file.readlines()
        set_lines = set(lines)
        print len(lines), len(set_lines)


if __name__ == '__main__':
    main(sys.argv[1:])
    check_duplicate()
