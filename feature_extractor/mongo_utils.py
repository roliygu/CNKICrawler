#! usr/bin/python
# coding=utf-8
import sys

__author__ = 'roliy'

import pymongo

client = pymongo.MongoClient("192.168.31.230", 27017)

db = client.cnki


def get_db():
    return db


def create_new_client_and_db():
    client = pymongo.MongoClient("192.168.31.230", 27017)
    return client.cnki


def insert(data, collection=db.doctor):
    return collection.insert_one(data).inserted_id


def insert_many(data, collection=db.doctor):
    return collection.insert_many(data).inserted_ids


def update(data, collection=db.doctor):
    return collection.update_many(data)


def get_all(collection=db.doctor):
    return collection.find()


def get_1000(collection=db.doctor):
    return collection.find(limit=1000)
