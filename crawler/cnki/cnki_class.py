#! usr/bin/python
# coding=utf-8
import sys

__author__ = 'roliy'


class PaperURL(object):

    def __init__(self, urls, tag, parent_tag):
        self.urls = urls
        self.tag = tag
        self.parent_tag = parent_tag

    def to_dic(self):
        return {
            "urls": self.urls,
            "tag": self.tag,
            "parentTag": self.parent_tag
        }


def main(argv):

    return


if __name__ == '__main__':
    main(sys.argv[1:])
