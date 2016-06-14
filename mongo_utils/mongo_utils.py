#! usr/bin/python
# coding=utf-8
import sys

__author__ = 'roliy'

import pymongo

client = pymongo.MongoClient("192.168.31.230", 27017)

db = client.cnki


def insert(data):
    return db.doctor.insert_one(data).inserted_id


def insert_many(data):
    return db.doctor.insert_many(data).inserted_ids
