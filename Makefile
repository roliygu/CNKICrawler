.PHONY: all

clean:
	rm log/*
	rm tmp/*

install-scrapy:
	sudo pip install scrapy

run:
	scrapy crawl cnki