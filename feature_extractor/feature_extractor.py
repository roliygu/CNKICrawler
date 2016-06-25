#! usr/bin/python
# coding=utf-8
import sys

import time
import jieba
import jieba.analyse
import jieba.posseg as pseg
import multiprocessing
import logging

import mongo_utils.mongo_utils as mongo_utils
import collection_utils.collection_utils as collection_utils

reload(sys)
sys.setdefaultencoding('utf-8')

__author__ = 'roliy'


logger = logging.getLogger("CNKI")

# jieba example
def jieba_example():
    raw = "我爱北京S5天安门（,123,三,四"
    raw_seq = jieba.cut(raw)
    raw_seq_list = jieba.lcut(raw)
    raw_keyword = jieba.analyse.extract_tags(raw, topK=3, withWeight=False, allowPOS=())
    raw_with_ictclas = pseg.cut(raw)
    for word, flag in raw_with_ictclas:
        print word, flag


def get_stop_words():
    with open("./resource/stop_word", 'r') as file:
        line = file.readline()
        return line.split(" ,")


def cut_with_flag(raw_str, filter_invalid_word_flag=True):
    """

    :param raw_str: str
    :return: list[(str, str)]
    """
    res = [(a, b) for a, b in pseg.lcut(raw_str)]

    if filter_invalid_word_flag:
        return filter_invalid_word(res)
    else:
        return res


def build_tf(raw_str):
    """

    :param raw_str: str
    :return: list[(str, int)], list[str]
    """
    raw_seq_with_flag = cut_with_flag(raw_str)
    total_word_num = len(raw_seq_with_flag)
    word_frequency_map = collection_utils.count_by(raw_seq_with_flag, lambda x: x[0])
    res = []
    for key in word_frequency_map.keys():
        res.append((key, word_frequency_map[key], word_frequency_map[key]*1.0/total_word_num))
    return res, word_frequency_map.keys()


def parse_item(item):
    """

    :param item: dictionary
    :return: void
    """

    def add_school_seq(t):
        t['school_seq'] = jieba.lcut_for_search(t['school'])

    def add_title_seq(t):
        t['title_seq'] = build_tf(t['title'])[1]

    def add_abstract_seq_and_tf(t):
        t['abstract_seq_tf'], t['abstract_seq'] = build_tf(t['abstract'])

    add_abstract_seq_and_tf(item)
    add_school_seq(item)
    add_title_seq(item)

    item['_id'] = str(item['_id'])

    return item


def filter_invalid_word(items):
    """

    :param items: list[(str, str)]
    :return:
    """
    stop_words = get_stop_words()

    def filter_char(t):
        return collection_utils.select(t, lambda x: u'x' not in x[1])

    def filter_stop_word(t):
        return collection_utils.select(t, lambda x: (u'u' not in x[1]) and (x[0] not in stop_words))

    def filter_number(t):
        return collection_utils.select(t, lambda x: u'm' != x[1])

    return filter_number(filter_stop_word(filter_char(items)))


def cursor_to_list(cursor):
    return [i for i in cursor]


def multiprocessing_groups(items, process_num, do_func, step):
    def start_process():
        print("starting %s\n" % multiprocessing.current_process().name)

    groups = [items[i:i + step] for i in range(0, len(items), step)]
    pool = multiprocessing.Pool(processes=process_num, initializer=start_process)
    res = pool.map(do_func, groups)
    pool.close()
    pool.join()
    return res


def parse_items_and_insert(array):
    data = [parse_item(i) for i in array]
    mongo_utils.insert_seq_paper_detail(data)


def parse_all():
    start = time.time()
    cursor = mongo_utils.get_all_paper_detail()
    result = cursor_to_list(cursor)
    multiprocessing_groups(result, 4, parse_items_and_insert, 250)
    end = time.time()
    print("time: " + str((end - start)*1.0/60))


def cal_IDF(all_seq_data):
    """
    :param all_seq_data:
    :return:
    """
    logger.info("Start calculating IDF")
    all_words = []
    for item in all_seq_data:
        all_words.extend(item)
    all_words = collection_utils.unique(all_words, lambda x, y: cmp(x, y))
    count = collection_utils.list(len(all_words), 0)
    for row in all_seq_data:
        for word in row:
            index = collection_utils.binary_search(all_words, word)
            if index != -1:
                count[index] += 1
    logger.info("End calculating IDF. words number is [%s]" % len(all_words))
    return all_words, count


def feature_extractor_tf_idf(paper_details):
    """

    :param paper_details:
    :return: paper_details
    """
    logger.info("Start calculating TF-IDF")
    all_words, count = cal_IDF([item['abstract_seq'] for item in paper_details])
    for row in paper_details:
        row_feature = []
        abstract_seq_tf = row['abstract_seq_tf']
        for col in abstract_seq_tf:
            tf = col[2]
            all_words_index = collection_utils.binary_search(all_words, col[0])
            idf = count[all_words_index]
            row_feature.append((all_words_index, tf*idf))
        row['tf_idf'] = row_feature
    logger.info("End calculating TF-IDF")
    return paper_details


def main(argv):
    return


if __name__ == '__main__':
    main(sys.argv[1:])
