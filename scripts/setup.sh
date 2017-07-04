#!/usr/bin/env bash

pip install virtualenv --upgrade
virtualenv cnki_virtual_env
source cnki_virtual_env/bin/activate
pip install scrapy==1.4.0
pip install requests==2.18.1
pip install beautifulsoup4==4.6.0
pip install lxml==3.8.0