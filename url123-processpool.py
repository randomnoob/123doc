import requests
import traceback
from bs4 import BeautifulSoup
from queue import Queue, Empty
from urllib.parse import urljoin, urlparse
import time
import threading
import datetime
from multiprocessing import Pool, Manager


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


class DocWriter():
    def __init__(self):
        self.data = []
        self.start_time = datetime.datetime.now()
        self.current_time = datetime.datetime.now()
        self.scraped_count = 0

    def add_data_sequence(self, data_seq):
        self.scraped_count+=len(data_seq)
        # Filter chỉ lấy các url dạng 123doc/document
        filtered = [x for x in data_seq if 'https://123doc.org/document' in x]
        self.data.extend(filtered)
        

    def write(self, sequence, file_open_mode='a'):
        try:
            with open('result.txt', file_open_mode) as foo_filer:
                for item in sequence:
                    foo_filer.write("{}\n".format(item))
        except IOError:
            self.write('result.txt', file_open_mode='w')
        except:
            traceback.print_exc()

    def periodic_write(self):
        # Tạo 1 set từ data hiện có
        dataset = set(self.data)
        # Reset cho self.data về ban đầu sau đó ghi dataset vừa tạo
        self.data = []
        self.write(dataset)
        print("Written to file at ", time.ctime())
        # Tính toán xem đã scrape được bao nhiêu page
        self.current_time = datetime.datetime.now()
        delta_mins = (self.current_time - self.start_time).total_seconds()/60
        print("Scraped {} urls. Elapsed {} minutes.\nRunning at {} urls per minutes. ".format(
            self.scraped_count, delta_mins, self.scraped_count//delta_mins))
        # Run itself every 10 secs
        threading.Timer(10, self.periodic_write).start()


class DocScraper:
    def __init__(self, num_workers):
        self.num_workers = num_workers
        self.root_url = 'https://123doc.org'
        self.pool = Pool(self.num_workers)
        self.scraped_pages = set([])
        self.to_crawl = Manager().Queue()
        self.to_crawl.put(self.root_url)
        self.writer = DocWriter()
        self.writer.periodic_write()  # start the writing thread

    def parse_links(self, html):
        soup = BeautifulSoup(html, 'lxml')

        links = soup.find_all('a')
        abs_links = [urljoin(self.root_url, a['href'])
                     for a in links if 'document/' in str(a) and a.has_attr('href')]
        for url in abs_links:
            self.to_crawl.put(url)
        self.writer.add_data_sequence(abs_links)

    def scraper_callback(self, futurez):
        result = futurez.result()
        if result and result.status_code == 200:
            self.parse_links(result.text)

    def scrape_page(self, queue):
        try:
            target_url = queue.get(timeout=10)
            if target_url not in self.scraped_pages:
                self.scraped_pages.add(target_url)
                res = requests.get(url, timeout=(3, 30))
                return res
            else:
                return None
        except requests.RequestException:
            return None

    @timeit
    def run_scraper(self):
        while True:
            try:
                job = self.pool.submit(self.scrape_page, self.to_crawl)
                job.add_done_callback(self.scraper_callback)
            except Empty:
                return
            except Exception as e:
                traceback.print_exc()
                pass


s = DocScraper(num_workers=5)
s.run_scraper()
