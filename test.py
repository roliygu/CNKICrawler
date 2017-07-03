#! usr/bin/python
# coding=utf-8

import sys
import unittest
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
import cnki.spiders.global_constant as global_constant

reload(sys)
sys.setdefaultencoding('utf-8')

__author__ = 'roliy'


class CNKISpiderTest(unittest.TestCase):
    def setUp(self):
        global_constant.is_test = True

    def tearDown(self):
        pass

    def test_cnki(self):
        process = CrawlerProcess(get_project_settings())
        process.crawl('cnki')
        process.start()


def main(argv):
    unittest.main()
    return


if __name__ == '__main__':
    main(sys.argv[1:])
