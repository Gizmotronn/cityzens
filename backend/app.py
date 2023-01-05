from flask import Flask, jsonify, request, make_response
import lightkurve as lk
#from thirdweb import ThirdwebSDK

app = Flask(__name__)
#proposalsSDK = ThirdwebSDK('goerli')

@app.route('/')
def index():
    return "Hello World"

@app.route('/createPlanet', methods=["GET", "POST"])
def createPlanet():
    return "Hi"

#@app.route('/proposals')
#def getProposals():
    #contract = proposalsSDK.get_contract('0xCcaA1ABA77Bae6296D386C2F130c46FEc3E5A004')
    #proposals = contract.call("getProposals")
    
    #return proposals"""