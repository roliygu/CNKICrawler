#!/usr/bin/env bash

pip install virtualenv --upgrade
virtualenv cnki_spider
cd cnki_spider/
source bin/activate
pip install scrapy