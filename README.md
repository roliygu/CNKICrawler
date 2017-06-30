# CNKICrawler

---

[WIP]

## 一. 简介

适应最新版的cnki界面。checkout一个新的分支,采用新的库实现cnki的爬虫。

## 二. 依赖

1. python27
2. scrapy

## 三. 使用方法

1. 安装依赖,并确保依赖lib能正常使用
2. `make install-scrapy` 安装scrapy,不过要求已经有pip,如果已经安装过,可忽略此步
3. `make test` 运行测试,看是本项目是否能正常运行
4. `make run` 测试成功后,执行此命令运行
5. `make clean` 清理历史log和暂存文件
