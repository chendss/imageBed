import json
import requests
from flask_cors import CORS
from db import DB
import random
import urllib3
from tools import is_phone, get, img_remote_size
from flask import Flask, redirect, abort, make_response, jsonify, send_file, request

app = Flask(__name__)
CORS(app, supports_credentials=True)
CORS(app, resources=r'/*')

dataset = DB('./data.json')


def api_param_parse(params):
    api_param = params if params != None else {}
    return api_param


def image_remote(ua):
    """
    获得图片接口地址
    """
    if is_phone(ua):
        image = 'https://api.uomg.com/api/rand.img2?format=json'
    else:
        image = 'https://api.uomg.com/api/rand.img1?format=json'
    return image


def img_list(is_phone_, image, count=1):
    """
    根据数量获得随机图组
    """
    result = []
    while len(result) < int(count):
        ir = requests.get(image,  allow_redirects=False)
        text = json.loads(ir.text)
        img_url = get(text, 'imgurl', '')
        min_size = 100 if is_phone_ else 200
        if img_remote_size(img_url) > min_size:
            result.append(img_url)
    return result


@app.route('/img', methods=['GET'])
def get_img():
    """
    获得图片
    """
    ua = request.headers.get('User-Agent')
    image = image_remote(ua)
    api_param = api_param_parse(request.args)
    count = get(api_param, 'count', '1')
    is_phone_ = is_phone(ua)
    key = 'image.phone' if is_phone_ == True else 'image.pc'
    local_image = get(dataset.data, key, [])
    result = []
    if len(local_image) <= int(count):
        result = img_list(is_phone_, image, count)
        dataset.insert_list(key, result)
    else:
        result = random.sample(dataset.get(key), int(count))
    return json.dumps(result)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=6388,
        debug=True
    )
