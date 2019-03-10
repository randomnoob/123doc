from urllib.parse import urlparse


def parse(pattern, output_file, fopen_mode='a'):
    """
    """
    with open('result.txt') as f: 
        for line in f:
            try:
                if pattern in line:
                    with open(output_file, fopen_mode) as outfile: 
                        outfile.write(line.strip())
                        outfile.write('\n')

            except IOError:
                parse(pattern, output_file, fopen_mode='w')

def anti_pattern(anti_pattern_list, output_file='naked_domain.txt', fopen_mode='a'):
    with open('result.txt') as f: 
        for line in f:
            check = [x for x in anti_pattern_list if x in line]
            if not check:
                with open(output_file, fopen_mode) as outfile: 
                    outfile.write(line.strip())
                    outfile.write('\n')


pattern = ['text.123doc.org', 'www.123doc.org', 'toc.123doc.org', 'f.123doc.org', 'm.123doc.org']
# for i in pattern:
#     parse(i, '{}.txt'.format(i))

anti_pattern(pattern)