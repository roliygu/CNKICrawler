#! usr/bin/python
# coding=utf-8
import sys
import bisect

__author__ = 'roliy'


def unique(array, compare_func, is_order=False):
    """
    Produce a duplicate-free version of the array. If the array has already been sorted,
    you have the option of using a faster algorithm.
    :param array: list[T]
    :param is_order: boolean
    :param iteratee: -1/0/1 => T, T
    :return:
    """
    if (not array) or (len(array) == 0):
        return []

    def uni(t_array):
        res = [t_array[0]]
        for i in t_array:
            if compare_func(res[-1], i) != 0:
                res.append(i)
        return res

    if len(array) == 1:
        return array
    if is_order:
        return uni(array)
    else:
        array.sort(cmp=compare_func)
        return uni(array)


def count_by(array, key_func):
    """
    Sorts a list into groups and returns a count for the number of objects
    in each group. Similar to groupBy, but instead of returning a list of
    values, returns a count for the number of values in that group.
    :param array: list[T]
    :param key_func: str => T
    :return:
    """
    if not array:
        return {}
    if len(array) == 1:
        return {key_func(array[0]): 1}
    key_list = [key_func(i) for i in array]
    key_list.sort()
    res = {}
    index = 0
    last_key = key_list[index]
    last_index = 0
    is_retain = True
    while index != len(key_list):
        if key_list[index] == key_list[last_index]:
            is_retain = True
        else:
            res[last_key] = index - last_index
            last_index = index
            last_key = key_list[index]
            is_retain = False
        index += 1
    if is_retain:
        res[last_key] = index - last_index
    return res


def select(array, predicate):
    """
    Looks through each value in the list, returning an array of all the values that pass a truth test.
    :param array: list[T]
    :param predicate: boolean => T
    :return: list[T]
    """
    res = []
    for i in array:
        if predicate(i):
            res.append(i)
    return res


def binary_search(a, x):
    """
    find the index of x in a with binary search. if not found, return -1.
    :param a: list[T]
    :param x: T
    :return: int
    """
    i = bisect.bisect_left(a, x)
    if i != len(a) and a[i] == x:
        return i
    return -1


def list(size, elem):
    """
    product a list contains [size] elements
    :param size:
    :param elem: elem should be simple type
    :return:
    """
    res = [elem]
    return res * size


def main(argv):
    return


if __name__ == '__main__':
    main(sys.argv[1:])
