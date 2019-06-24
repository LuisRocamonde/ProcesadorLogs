from flask import Flask, json
from flask import Response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from pymongo import MongoClient
import sys
from bson.json_util import dumps
import datetime
from datetime import timedelta
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

def date1_to_epoch(data):
    return datetime.datetime(data.year, data.month, data.day, 00, 00).timestamp()

def date2_to_epoch(data):
    data = data + timedelta(days=1)
    return datetime.datetime(data.year, data.month, data.day, 00, 00).timestamp()

class User(Resource):


#1543271005520
    @app.route('/logs/', methods = ['GET'])
    def log():
        ahora = datetime.datetime.now()
        principioDia = 1543271003852#date1_to_epoch(ahora)

        finalDia = 1543271021191#date2_to_epoch(ahora)
        #data = dumps(cuentas.find({"timestamp": 1543271003852}))
        data = dumps(cuentas.find({"timestamp": {'$gt': principioDia, '$lt':finalDia}}))
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
