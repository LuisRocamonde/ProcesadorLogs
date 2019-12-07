from flask import Flask, json
from flask import Response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from pymongo import MongoClient
import sys
import json
from bson.json_util import dumps
import datetime
from datetime import timedelta
import easyweb3
from easyweb3 import EasyWeb3
from eth_account.messages import defunct_hash_message
from time import time
from hexbytes import HexBytes
import binascii

app = Flask(__name__)
api = Api(app)
CORS(app)
con = MongoClient('localhost', 27017)
db = con.procardiaLogs
cuentas= db.logs
db2 = con.dbFirmas
firmas = db2.dbFirmas
EasyWeb3()

def date1_to_epoch(data):
    return datetime.datetime(data.year, data.month, data.day, 00, 00).timestamp()

def date2_to_epoch(data):
    data = data + timedelta(days=1)
    return datetime.datetime(data.year, data.month, data.day, 00, 00).timestamp()

class User(Resource):


#1543271005520
    @app.route('/logs/<doctor>', methods = ['GET'])
    def log(doctor):
        ahora = datetime.datetime.now()
        principioDia = 1543271003852#date1_to_epoch(ahora)

        finalDia = 1543271021191#date2_to_epoch(ahora)
        #data = dumps(cuentas.find({"timestamp": 1543271003852}))
        data = dumps(cuentas.find({"timestamp": {'$gt': principioDia, '$lt':finalDia}, "agent": doctor}))
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')

        return resp

    @app.route('/firma/<doctor>/<text>', methods = ['POST'])
    def firma(text, doctor):

        web3 = EasyWeb3('UTC--2019-06-20T19-00-53.318093046Z--339593e2096135d7eb5c6ee964908c295d5ae241', 'root')


        #data_example = 'procardia_message:Proof registered by Procardia::procardia_proof:a3799f91e5495128a918f6c7f5aef65564384240824d81244244a4ecde60765d'

        hasheado = EasyWeb3.hash(text)
        print('\n\n\n' + "hasheado " + str(hasheado) + '\n\n\n')
        data_example = 'procardia_message:Proof registered by Procardia::procardia_proof:' + str(hasheado)

        address = EasyWeb3.web3.toChecksumAddress('0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddea1')
        web3 = EasyWeb3('wallet.json', http_provider='http://65.52.226.126:22000', proof_of_authority=True)

        tx = web3.get_tx(to=address, data=bytes(data_example, 'utf-8'))
        print('\n\n\n' + "TRANSACCION " + str(tx) + '\n\n\n')
        receipt = web3.transact(tx)
        firmas.insert({"medico":doctor, "fecha": time(), "transactionHash":receipt["transactionHash"].hex(), "hashLog":hasheado, "log":text})
        trans = web3.eth.getTransaction(receipt["transactionHash"])
        input = trans["input"]
        hexa = hex(int(input, 16))
        final = bytes.fromhex(hexa[2:]).decode('utf-8')
        print('\n\n\n' + "RECEIPT " + str(final) + '\n\n\n')


        return "OK"

    @app.route('/ultimaFirma/<doctor>', methods = ['GET'])
    def ultimaFirma(doctor):
        dataF = dumps(firmas.find({"medico":doctor},{"_id":0, "fecha":1}).sort([( "_id", -1)]).limit(1))

        new = ""
        for x in dataF:
            new += x

        dataUltimaFirma = float(new[11:-2]);
        jsF = json.dumps(dataF)
        respF = Response(jsF, status=200, mimetype='application/json')
        print("FIRMA" + dataF);
        return new[11:-2]

    @app.route('/busqueda/<doctor>/<variable>/<dataInicio>/<dataFin>', methods = ['GET'])
    def busqueda(doctor,variable,dataInicio,dataFin):
        dataI = int(dataInicio)
        dataF = int(dataFin)
        doctor="carlos.peña"
        dataI=1575656460
        dataF=1575656467
        data = dumps(firmas.find({"fecha": {'$gt': dataI, '$lt':dataF}, "medico":doctor}))
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        print("SALIDA " + doctor + "--" + variable + "--" + str(dataI) + "--" + str(dataF))
        return resp

    @app.route('/busquedaLog/<doctor>/<variable>/<dataInicio>/<dataFin>', methods = ['GET'])
    def busquedaLog(doctor,variable,dataInicio,dataFin):
        dataI = int(dataInicio)
        dataF = int(dataFin)
        doctor="carlos.peña"
        dataI=1575656460
        dataF=1575656467
        data = dumps(firmas.find({"fecha": {'$gt': dataI, '$lt':dataF}, "medico":doctor},{"log":1, "hashLog":1}))
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        print("SALIDA " + data)
        return resp

api.add_resource(User, "/logs/")

app.run(debug=True)
