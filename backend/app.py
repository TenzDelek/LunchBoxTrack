from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
mongo_uri = os.environ.get('MONGODB_URI')
client = MongoClient(mongo_uri)
db = client.restaurant_orders  # Explicitly specify the database name
orders_collection = db.orders

@app.route('/submit-order', methods=['POST'])
def submit_order():
    data = request.json
    new_order = {
        'customerName': data['customerName'],
        'dishName': data['dishName'],
        'quantity': data['quantity']
    }
    result = orders_collection.insert_one(new_order)
    return jsonify({"message": "Order submitted successfully", "id": str(result.inserted_id)}), 201

@app.route("/",methods=[ 'GET'])
def homes():
    return "hello"

@app.route('/get-orders', methods=['GET'])
def get_orders():
    orders = list(orders_collection.find())
    return jsonify([
        {
            "id": str(order['_id']),
            "customerName": order['customerName'],
            "dishName": order['dishName'],
            "quantity": order['quantity']
        } for order in orders
    ])

@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        return "Connected to MongoDB successfully!", 200
    except Exception as e:
        return f"Failed to connect to MongoDB. Error: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True)