#!/usr/bin/env bash

pip install virtualenv --upgrade
virtualenv cnki_spider
source cnki_spider/bin/activate
pip install scrapy