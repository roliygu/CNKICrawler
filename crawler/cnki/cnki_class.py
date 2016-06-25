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


class PaperDetail(object):
    def __init__(self, name, title, school, abstract,
                 uri, author_other, paper_info, keyword, teachers):
        self.name = name
        self.title = title
        self.school = school
        self.abstract = abstract
        self.uri = uri
        self.author_other = author_other
        self.paper_info = paper_info
        self.keyword = keyword
        self.teachers = teachers

    def to_dic(self):
        return {
            "name": self.name,
            "title": self.title,
            "school": self.school,
            "abstract": self.abstract,
            "uri": self.uri,
            "author_other": self.author_other,
            "paper_info": self.paper_info,
            "keyword": self.keyword,
            "teachers": self.teachers
        }


def main(argv):
    return


if __name__ == '__main__':
    main(sys.argv[1:])
