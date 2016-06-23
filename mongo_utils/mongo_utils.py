#! usr/bin/python
# coding=utf-8
import sys

import crawler.cnki.cnki_class as cnki_class
import collection_utils.collection_utils as collection_utils
import pymongo

__author__ = 'roliy'

# if used for multiprocessing, connect should be False
client = pymongo.MongoClient("127.0.0.1", 27017, connect=False)

db = client.cnki


def insert_url(data):
    return db.paper_url.insert_one(data).inserted_id


def insert_paper_detail(data):
    return db.doctor.insert_one(data).inserted_id


def insert_reduce_paper_detail(data):
    return db.reduce_doctor.insert_many(data)


def insert_seq_paper_detail(data):
    return db.seq_doctor.insert_many(data)


def get_example_seq_doctor():
    return db.seq_doctor.find_one({"_id": "576a5bfe7bd5270b53693c8f"})


def get_url_by_tag(tag):
    return db.paper_url.find_one({"tag": tag})


def get_url_by_parent_tag(parent_tag):
    first_request = get_url_by_tag(parent_tag)
    if not first_request:
        second_request = db.paper_url.find({"parentTag": parent_tag})
        parent_tag_url_object = cnki_class.PaperURL([], parent_tag, "all")
        for item in second_request:
            parent_tag_url_object.urls += item['urls']
        result = parent_tag_url_object.to_dic()
        collection_utils.unique(result['urls'], lambda x, y: cmp(x, y))
        insert_url(result)
        return result
    else:
        return first_request


def get_all_url():
    """
    too large to insert to db...so, can't use insert after query to cache it...
    :return:
    """
    second_request = db.paper_url.find({"parentTag": "all"})
    parent_tag_url_object = cnki_class.PaperURL([], "null", "all")
    for item in second_request:
        parent_tag_url_object.urls += item['urls']
    result = parent_tag_url_object.to_dic()
    collection_utils.unique(result['urls'], lambda x, y: cmp(x, y))
    return result


def get_all_paper_detail():
    return db.doctor.find(limit=5000)


def get_all_seq_doctor():
    return db.seq_doctor.find()
