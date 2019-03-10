GLOBAL_ID = []

def filter_dups(path):
    with open(path) as fin:
        for line in fin:
            _id = parse_id(line)
            if _id not in GLOBAL_ID and 'https://123doc.org/document/' in line:
                GLOBAL_ID.append(_id)
                write_result(line)

def write_result(line, opmode='a'):
    try:
        with open('output.txt', opmode) as output:
            output.write(line)
    except IOError:
        write_result(line, 'w')

def parse_id(line):
    return line.split('/')[-1].split('-')[0]


filter_dups('result.txt')