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
#db = con.procardiaLogs
#cuentas= db.logs
db = con.logsVictor
cuentas = db.logsDeVictor
db2 = con.dbFirmas
firmas = db2.dbFirmas
marcaAgua = 'procardia_message:Proof_registered_by_Procardia::procardia_proof: '
print ("Content-Type: text/turtle")
print ("Content-Location: mydata.ttl")
print ("Access-Control-Allow-Origin: *")
print()
EasyWeb3()

#Reinicia la fecha guardada en DATA para que sean las 00:00 del día
def date1_to_epoch(data):
    return datetime.datetime(data.year, data.month, data.day, 00, 00).timestamp()

#Reinicia la fecha guardada en DATA para que sean las 00:00 del día siguiente
def date2_to_epoch(data):
    data = data + timedelta(days=1)
    return datetime.datetime(data.year, data.month, data.day, 00, 00).timestamp()

#Transforma la fecha en formato epoch en FECHAEPOCH y la reinicia para que sean las 00:00 del dia
def inicioDia(fechaEpoch):
    fechaData = datetime.datetime.fromtimestamp(int(fechaEpoch)/1000)
    return datetime.datetime(fechaData.year, fechaData.month, fechaData.day, 00,00).timestamp()

#Transforma la fecha en formato epoch en FECHAEPOCH y la reinicia para que sean las 00:00 del dia siguiente
def finDia(fechaEpoch):
    fechaData = datetime.datetime.fromtimestamp(int(fechaEpoch)/1000)
    return datetime.datetime(fechaData.year, fechaData.month, fechaData.day, 23,59).timestamp()

#Recupera del JSON el hash de los datos añadidos en la transacción
def recuperarTransHash(trans):
    web3 = EasyWeb3('wallet.json', http_provider='http://65.52.226.126:22000', proof_of_authority=True)

    trHash = str(json.loads(trans)[0]["transactionHash"])
    trans = web3.eth.getTransaction(trHash)
    input = trans["input"]
    hexa = hex(int(input, 16))
    final = bytes.fromhex(hexa[2:]).decode('utf-8')
    splt = str(final).split()
    return splt[1]

#Recupera del JSON el hash del log
def recuperarHashLog(hashLog):
    return str(json.loads(hashLog)[0]["hashLog"])

class User(Resource):

    #Recupera los logs del ultimo dia para firmar, de momento el dia está fijo para recibir los datos disponibles en la BD
    #Si estuviera conectado a la BD de PROCARDIA se podría
    @app.route('/logs/<doctor>', methods = ['GET'])
    def log(doctor):
        ahora = datetime.datetime.now()
        principioDia = 1543271005520#date1_to_epoch(ahora)

        finalDia = 1543271027645#date2_to_epoch(ahora)ELSE
        #data = dumps(cuentas.find({"timestamp": {'$gt': principioDia, '$lt':finalDia}, "agent": doctor}))

        #Recupera la fecha de la última firma. Las firmas están ordenadas por fecha en orden descendente.
        dataF = dumps(firmas.find({"medico":doctor},{"_id":0, "fecha":1}).sort([( "_id", -1)]).limit(1))
        #Check por si no existen datos en la BD de firmas
        if dataF == '[]':
            ultimaFirma = 0
        else:
            ultimaFirma = float(dataF[11:-2])
        #Recuperamos los datos de logs desde la fecha de ultima firma
        data = dumps(cuentas.find({"timestamp": {'$gt': ultimaFirma}, "agent": doctor}).limit(50))
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')

        return resp

    #Firma los logs. Actualiza la BD de firmas. Envia los logs firmados a la red blockchain
    @app.route('/firma/<doctor>/<text>', methods = ['POST'])
    def firma(text, doctor):

        web3 = EasyWeb3('UTC--2019-06-20T19-00-53.318093046Z--339593e2096135d7eb5c6ee964908c295d5ae241', 'root')

        hasheado = EasyWeb3.hash(text)
        print('\n\n\n' + "hasheado " + str(hasheado) + '\n\n\n')
        data_example = marcaAgua + str(hasheado)

        address = EasyWeb3.web3.toChecksumAddress('0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddea1')
        web3 = EasyWeb3('wallet.json', http_provider='http://65.52.226.126:22000', proof_of_authority=True)

        tx = web3.get_tx(to=address, data=bytes(data_example, 'utf-8'))

        receipt = web3.transact(tx)
        firmas.insert({"medico":doctor, "fecha": time()*1000, "transactionHash":receipt["transactionHash"].hex(), "hashLog":hasheado, "log":text})

        return "OK"

    #Recupera la ultima fecha en la que el doctor ha firmado
    @app.route('/ultimaFirma/<doctor>', methods = ['GET'])
    def ultimaFirma(doctor):
        dataF = dumps(firmas.find({"medico":doctor},{"_id":0, "fecha":1}).sort([( "_id", -1)]).limit(1))

        return dataF[11:-2]

    #Obtiene los logs firmados entre la data de inicio y la data de fin de los parámetros
    @app.route('/busquedaLog/<doctor>/<dataInicio>/<dataFin>', methods = ['GET'])
    def busquedaLog(doctor,dataInicio,dataFin):
        dataI = inicioDia(dataInicio)*1000  #La funcion lo devuelve en segundos y en la BD esta guardado en milisegundos
        dataF = finDia(dataFin)*1000
        #dataI=1586565646
        #dataF=1588656467

        #Obtiene el log firmado en la transacción y su hash
        data = dumps(firmas.find({"fecha": {'$gt': dataI, '$lt':dataF}, "medico":doctor},{"log":1, "hashLog":1}))
        #Obtiene el hash de la transaccion para recuperar los datos de la red blockchain
        transaccion = dumps(firmas.find({"fecha": {'$gt': dataI, '$lt':dataF}, "medico":doctor},{"transactionHash":1}))

        #Comprobacion para evitar errores si la BD no tiene entradas aun
        if transaccion != '[]':
            #Comprueba si el hash inicial es igual al guardado actualmente en la red blockchain
            if(recuperarTransHash(transaccion) != recuperarHashLog(data)):
                data = "[{data:falseData}]";

        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        print("SALIDA " + str(data))
        return resp

api.add_resource(User, "/logs/")

app.run(debug=True)
