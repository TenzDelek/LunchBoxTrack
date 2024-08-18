from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
load_dotenv()
import os

app = Flask(__name__)
CORS(app,origins=["https://lunch-box-track.vercel.app"])

mongo_uri = os.environ.get('MONGODB_URI')
client = MongoClient(mongo_uri)
db = client.restaurant_orders

users_collection = db.users
cart_collection = db.cart
orders_collection = db.orders

@app.route('/add-to-cart', methods=['POST'])
def add_to_cart():
    data = request.json
    user_id = data['userId']
    item = {
        'dishName': data['dishName'],
        'quantity': data['quantity']
    }
    
    # Check if the item already exists in the cart
    existing_cart = cart_collection.find_one({'userId': user_id})
    
    if existing_cart:
        # Check if the dish already exists in the cart
        item_index = next((index for (index, d) in enumerate(existing_cart['items']) if d["dishName"] == item['dishName']), None)
        
        if item_index is not None:
            # If the dish exists, update its quantity
            cart_collection.update_one(
                {'userId': user_id, 'items.dishName': item['dishName']},
                {'$inc': {f'items.$.quantity': item['quantity']}}
            )
        else:
            # If the dish doesn't exist, add it to the cart
            cart_collection.update_one(
                {'userId': user_id},
                {'$push': {'items': item}}
            )
    else:
        # If the cart doesn't exist, create a new one
        cart_collection.insert_one({'userId': user_id, 'items': [item]})
    
    return jsonify({"message": "Cart updated successfully"}), 200
@app.route('/get-cart', methods=['GET'])
def get_cart():
    user_id = request.args.get('userId')
    cart = cart_collection.find_one({'userId': user_id})
    if cart:
        return jsonify({
            "userId": cart['userId'],
            "items": cart['items']
        }), 200
    return jsonify({"message": "Cart not found"}), 404

@app.route('/remove-from-cart', methods=['POST'])
def remove_from_cart():
    data = request.json
    user_id = data['userId']
    item_index = data['itemIndex']
    cart_collection.update_one(
        {'userId': user_id},
        {'$unset': {f'items.{item_index}': 1}}
    )
    cart_collection.update_one(
        {'userId': user_id},
        {'$pull': {'items': None}}
    )
    return jsonify({"message": "Item removed from cart successfully"}), 200

@app.route('/checkout', methods=['POST'])
def checkout():
    user_id = request.json['userId']
    cart = cart_collection.find_one({'userId': user_id})
    if cart:
        order = {
            'userId': user_id,
            'items': cart['items'],
            'status': 'placed'
        }
        orders_collection.insert_one(order)
        cart_collection.delete_one({'userId': user_id})
        return jsonify({"message": "Order placed successfully"}), 200
    return jsonify({"message": "Cart is empty"}), 400

@app.route('/get-past-orders', methods=['GET'])
def get_past_orders():
    user_id = request.args.get('userId')
    past_orders = list(orders_collection.find({'userId': user_id}))
    
    # Convert ObjectId to string for JSON serialization
    for order in past_orders:
        order['_id'] = str(order['_id'])
    
    return jsonify(past_orders), 200
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))