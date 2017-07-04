.PHONY: all

clean:
	rm log/*
	rm tmp/*

setup:
	bash scripts/setup.sh

run: init
	# scrapy crawl cnki
	python main.py

init:
	if [ ! -d "./log" ]; then mkdir ./log; fi
	if [ ! -d "./tmp" ]; then mkdir ./tmp; fi

test:
	python test.py
