import requests
import traceback
from bs4 import BeautifulSoup
from multiprocessing import Pool
import time
import json
import re
from queue import Queue, Empty
import os
from urllib.parse import urljoin


def timeit(method):
    def timed(*args, **kw):
        ts = time.time()
        result = method(*args, **kw)
        te = time.time()
        if 'log_time' in kw:
            name = kw.get('log_name', method.__name__.upper())
            kw['log_time'][name] = int((te - ts) * 1000)
        else:
            print('%r  %2.2f ms' %
                  (method.__name__, (te - ts) * 1000))
        return result
    return timed


class JavascriptDataScraper:
    def __init__(self, input_file, num_workers):
        self.num_workers = num_workers
        self.input_file = input_file


    @staticmethod
    def text2soup(html):
        return BeautifulSoup(html, 'lxml')

    @staticmethod
    def get_js(soup):
        pattern = ['linkThumb', 'linkEmbed', 'timeCurrent']
        script = soup.find(lambda tag: tag.name == 'script' and any(
            [x in str(tag) for x in pattern]))
        return script

    @staticmethod
    def get_puretext(soup):
        content = soup.find('div', class_='des_content')
        if content:
            return content.text
        else:
            return ''

    @staticmethod
    def get_tags(soup):
        """
        Expected input : bs4.BeautifulSoup
        Return list of tuple (name_of_tag, url) or empty list
        """
        result = []
        try:
            list_tags = soup.find('div', class_='listTag')
            tags_elem = list_tags.find_all('a')
            for tag in tags_elem:
                href = tag.get('href')
                title = tag.get('title')
                if title and href:
                    abs_url = urljoin('https://123doc.org', href)
                    result.append({'name':title, 'url':abs_url})
        except:
            traceback.print_exc()
        return result

    @staticmethod
    def get_docname(javascript):
        return re.search(r"docName= \"(.+?)\"\r,", javascript).group(1)
    @staticmethod
    def get_docid(javascript):
        return re.search(r"docId= ([0-9]*), pageMax=", javascript).group(1)

    def scrape_page(self, url):
        try:
            headers={'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'}
            res = requests.get(url, timeout=(3, 30))
            return res
        except requests.RequestException:
            return None

    def multiprocess_scrape(self, url):
        try:
            result = self.scrape_page(url)
            if result and result.status_code==200:
                print("Scraped ", result.url)
                # Parse trang đã GET thành bs4.BeautifulSoup
                soup = self.text2soup(result.text)
                # Lấy các thành phần cho vào data
                tags = self.get_tags(soup)
                js_string = self.get_js(soup).text
                docname = self.get_docname(js_string)
                docid = self.get_docid(js_string)
                # Dựng data để xuất
                scraped = {}
                scraped['url'] = result.url
                scraped['name'] = docname
                scraped['docID'] = docid
                scraped['javascript'] = js_string
                scraped['pure_text'] = self.get_puretext(soup)
                with open('scraped/{}.json'.format(docid), 'w') as output:
                    json.dump(scraped, output)
        except IOError:
            if not os.path.exists('scraped/'):
                os.makedirs('scraped/')
        except:
            traceback.print_exc()

    def run_scraper(self):
        with Pool(self.num_workers) as pool:
            with open(self.input_file) as reader:
                try:
                    target_urls = [line.strip() for line in reader if "https://123doc.org/document" in line]
                    pool.map(self.multiprocess_scrape, target_urls)
                    pool.close()
                    pool.join()
                    print('pool join')

                    print('End Program')

                except Exception as e:
                    traceback.print_exc()
                    pass


def process_file(filename, num_processes):
    s = JavascriptDataScraper(filename, num_processes)
    s.run_scraper()

def split_file(big_filename, chunk_size=50000000):
    """
    chunk_size must be in bytes
    pipenv install filesplit
    """
    from fsplit.filesplit import FileSplit
    fs = FileSplit(file=big_filename, splitsize=50000000, output_dir='splitted')
    fs.split()

def process_directory(path, num_processes):
    for (dirpath, dirnames, filenames) in os.walk(path):
        for filename in filenames:
            if filename.endswith('.txt'): 
                current_file = os.path.join([dirpath, filename])
                process_file(current_file, num_processes)

split_file('result.txt')
process_directory('splitted', 20)


