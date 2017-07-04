# CNKICrawler

---

[WIP]

## 一. 简介

适应最新版的cnki界面。checkout一个新的分支,采用新的库实现cnki的爬虫。

## 二. 依赖

1. python27
2. scrapy

## 三. 使用方法

0. 第一次使用时,需要初始化`virtual env`,并安装相关依赖。运行`make setup`命令,能帮助你解决所有依赖及版本问题。
1. `source cnki_spider/bin/activate`命令,attach到`virtual env`中,之后便可以使用make的其他命令
2. `make test` 测试爬虫
3. `make run` 如果测试没有出现异常,就可以执行此命令运行爬虫
4. `make clean` 清理历史log和暂存文件
5. `deactivate`可以脱离`virtual env`,恢复到本机的python环境

## 四. 爬取流程及注意事项

### 1. 

## 五. 开发中内容

### 1. bug

#### 1.1 单搜索标签限制总条数为6000条

当请求到概要列表时,可以拿到当前标签下的总文献数和概要列表的总页数。但是CNKI做了限制,概要列表数*每页详情数不能超过6000。
具体表现就是,当点击了某个标签的第一页概要后,发现尽管总条数有上百万条,但是总页数最大是120页,如果申请120之后的概要列表,则会返回空。最终导致,点击某个具体标签最多能请求到6000条记录。
修复方式:利用多级标签,比如按选择学科最细粒度的标签,再选择按年度划分,这样可以确保尽可能得覆盖所有论文。

### 2. feature

#### 2.1 论文详情页还有信息没有收集

目前论文详情页还只收集了摘要,关键词等信息。实际上还有论文引用关系,作者人际关系等数据没有抓取。