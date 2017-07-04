#!/usr/bin/env bash

pip install virtualenv --upgrade
virtualenv cnki_spider
source cnki_spider/bin/activate
pip install scrapy==1.4.0
pip install requests==2.18.1
pip install beautifulsoup4==4.6.0