import sys


def fab(max):
    n, a, b = 0, 0, 1
    while n < max:
        print "hello"
        yield b
        print b
        a, b = b, a + b
        n = n + 1


def main(argv):
    f = fab(5)
    f.next()
    f.next()
    f.next()
    f.next()
    f.next()

if __name__ == '__main__':
    main(sys.argv[1:])
