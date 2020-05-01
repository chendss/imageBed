import json
import requests
from flask_cors import CORS
from flask import Flask, redirect, abort, make_response, jsonify, send_file, request

app = Flask(__name__)
CORS(app, supports_credentials=True)
CORS(app, resources=r'/*')


def api_param_parse(params):
    api_param = params if params != None else {}
    return api_param


@app.route('/img/', methods=['GET'])
def get_img():
    """
    获得图片
    """
    image = 'https://api.uomg.com/api/rand.img1?format=json'
    api_param = api_param_parse(request.args)
    count = api_param.get('count') if api_param.get('count') != None else '1'
    img_list = []
    for _ in range(int(count)):
        ir = requests.get(image,  allow_redirects=False)
        text = json.loads(ir.text)
        img_list.append(text['imgurl'])
    return json.dumps(img_list)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=6388,
        debug=True
    )
