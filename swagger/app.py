from flask import Flask, request, jsonify, send_file
import json
from selenium import webdriver
import time
from urllib.request import urlretrieve
from zipfile import ZipFile


app = Flask(__name__)


@app.route('/extract',methods = ['POST'])
def extract():
    data = json.loads(request.data)

    driver = webdriver.Chrome('chromedriver')
    driver.get(str(data['url']))#특정 클립 링크

    time.sleep(3)

    file_list = []
    zipObj = ZipFile(str(data['filename']) +'.zip', 'w')

    #img 태그 확인
    url_element = driver.find_elements_by_xpath('//img[@*]')
    for item in url_element:
        img_url = item.get_attribute('src')
        print(img_url)
        img_title = str(time.time())
        img_title = img_title.replace(".", "")
        urlretrieve(img_url, "./extract/"+str(img_title)+'.png')
        zipObj.write("./extract/"+str(img_title)+'.png')
        file_list.append(str(img_title)+'.png')

    #video 태그 확인
    url_element = driver.find_elements_by_xpath('//video[@*]')
    for item in url_element:
        vid_url = item.get_attribute('src')
        print(vid_url)
        vdo_title = str(time.time())
        vdo_title = vdo_title.replace(".", "")
        try:
            urlretrieve(vid_url, "./extract/"+str(vdo_title)+'.mp4')
            zipObj.write("./extract/"+str(vdo_title)+'.mp4')
        except:
            continue
        file_list.append(str(vdo_title)+'.mp4')

    zipObj.close()


    driver.close()

    try:
        return send_file(str(data['filename']) + '.zip', attachment_filename='download.zip')
    except Exception as e:
        return str(e)
if __name__ == '__main__':
   app.run(debug = True)