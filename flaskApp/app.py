from flask import Flask, json
from flask import Response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from pymongo import MongoClient
import sys
from bson.json_util import dumps
import datetime

app = Flask(__name__)
api = Api(app)
CORS(app)
con = MongoClient('localhost', 27017)
db = con.procardiaLogs
cuentas= db.logs

def date_to_epoch(ano, mes, dia, hora, min):
    return datetime.datetime(ano, mes, dia, hora, min).timestamp()

class User(Resource):

    @app.route('/logs/', methods = ['GET'])
    def log():
        date = date_to_epoch(2018, 11, 26, 0, 0)
        data = dumps(cuentas.find({"timestamp": 1543271005520}))
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

    @app.route('/test/<hash>', methods = ['POST'])
    def test(hash):
        print(hash)
        return "OK"



api.add_resource(User, "/logs/")

app.run(debug=True)