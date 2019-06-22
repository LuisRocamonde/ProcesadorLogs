from flask import Flask, json
from flask import Response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from pymongo import MongoClient
import sys
from bson.json_util import dumps
import datetime
import easyweb3
from easyweb3 import EasyWeb3
from eth_account.messages import defunct_hash_message

app = Flask(__name__)
api = Api(app)
CORS(app)
con = MongoClient('localhost', 27017)
db = con.procardiaLogs
cuentas= db.logs
EasyWeb3()

def date_to_epoch(ano, mes, dia, hora, min):
    return datetime.datetime(ano, mes, dia, hora, min).timestamp()

class User(Resource):



    @app.route('/logs/', methods = ['GET'])
    def log():
        date = date_to_epoch(2018, 11, 26, 0, 0)
        data = dumps(cuentas.find({"timestamp": 1543271003852}))
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

    @app.route('/test/<text>', methods = ['POST'])
    def test(text):

        prefixed_hash = defunct_hash_message(text=text)
        web3 = EasyWeb3('UTC--2019-06-20T19-00-53.318093046Z--339593e2096135d7eb5c6ee964908c295d5ae241', 'root')
        signature = web3.sign(text)
        print("SIGNATURE " + signature)
        return "OK"




api.add_resource(User, "/logs/")

app.run(debug=True)
