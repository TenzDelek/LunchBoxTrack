from flask import Flask,jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return  "Hello World!"

@app.route("/api/user",methods=['GET'])
def hello():
    return jsonify({
        "message":[ "Hello World!","hi there"],
        "pet":["cat","dog"]
    })

if __name__ == "__main__":
    app.run(debug=True,port=8000)