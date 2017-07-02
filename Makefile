.PHONY: all

clean:
	rm log/*
	rm tmp/*

install-scrapy:
	sudo pip install scrapy

run: init clean
	scrapy crawl cnki

init:
	if [ ! -d "./log" ]; then mkdir ./log; fi
	if [ ! -d "./tmp" ]; then mkdir ./tmp; fi

test:
	python test.py
