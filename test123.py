import requests, json

data = {"docId": "391541",
"pageMax": "4",
"pageShow": "4",
"folder": "loi-dan-van-nghe-mung-xuan--13708024138474",
"filePath": "13/ne/gr",
"fileHtml": "gri1369382571",
"pageNumber": "1",
"pageLength": "3",
"link": "https://123doc.org/document/391541-loi-dan-van-nghe-mung-xuan.htm",
"type": "insite"}

headers = {'Origin': 'https://123doc.org',
'Referer': 'https://123doc.org/document/391541-loi-dan-van-nghe-mung-xuan.htm',
'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36'}

endpoint = 'https://data1.store123doc.com/documents/ajax/ajax_readEB.php'

r = requests.post(endpoint, data=data, headers=headers)


print (r)
js_rp = r.json()
print(json.dumps(js_rp, indent=4))
# print (js_rp)