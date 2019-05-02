# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

from pymongo import MongoClient
from DatosLog import *

"Tres lineas para que imprima correctamente los caracteres con tilde o enhe"
import sys
reload(sys)
sys.setdefaultencoding('utf8')


con = MongoClient('localhost', 27017)
db = con.procardiaLogs
cuentas= db.logs


res=cuentas.find()
logs=[]
for log in res:
    nuevoLog = DatosLog(log)
    logs.append(nuevoLog)
    
print(logs[17].log["timestamp"])    
    
"""for log in logs:
    print(log.log)"""
    
    
"""
elementType
elementQualifier
elementReference
timestamp
value
executionId
agent
owner
resource
_id
isCommitted
    """