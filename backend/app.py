from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/user", methods=['GET'])
def return_home():
    return jsonify({
        'name': ['cairocoders', 'clydey', 'caitlyn'],
        'email': ['cairocoders@gmail.com', 'clydey@gmail.com', 'caitlyn@gmail.com']
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)