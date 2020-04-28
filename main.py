from flask_cors import CORS
from flask import Flask, redirect, abort, make_response, jsonify, send_file, request

app = Flask(__name__)
CORS(app, supports_credentials=True)
CORS(app, resources=r'/*')

if __name__ == '__main__':
    # mian()
    app.run(
        host='0.0.0.0',
        port=6388,
        debug=True
    )
