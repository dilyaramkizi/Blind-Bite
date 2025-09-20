import uuid
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from models.menu import Menu
from models.order import OrderItem, Order
from extensions import db


orders_bp = Blueprint('orders', __name__, url_prefix='/orders')

# Create an order
@orders_bp.route('', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['user_id', 'items', 'total_price']):
            return jsonify({"error": "Missing required fields"}), 400

        # Create order
        new_order = Order(
            user_id=uuid.UUID(data['user_id']),
            total_price=data['total_price'],
            total_calories=data.get('total_calories', 0),
            status='pending'
        )
        db.session.add(new_order)
        db.session.flush()

        # Create order items
        for item in data['items']:
            # Validate item structure
            if 'menu_id' not in item:
                continue

            order_item = OrderItem(
                order_id=new_order.id,
                menu_id=uuid.UUID(item['menu_id']),
                quantity=int(item.get('quantity', 1))
            )
            db.session.add(order_item)

        db.session.commit()
        
        return jsonify({
            "message": "Order created successfully",
            "order_id": str(new_order.id)
        }), 201

    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": f"Invalid UUID format: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

# Get orders by user_id
@orders_bp.route('/user/<uuid:user_id>', methods=['GET'])
def get_user_orders(user_id):
    try:
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
        
        orders_data = []
        for order in orders:
            order_data = {
                "id": str(order.id),
                "total_price": order.total_price,
                "total_calories": order.total_calories,
                "status": order.status,
                "created_at": order.created_at.isoformat(),
                "items": []
            }
            
            for item in order.items:
                menu_item = Menu.query.get(item.menu_id)
                order_data['items'].append({
                    "name": menu_item.name,
                    "description": menu_item.description,
                    "price": menu_item.price,
                    "quantity": item.quantity,
                    "image_path": f"/static/{menu_item.image_path}"
                })
                
            orders_data.append(order_data)
        
        return jsonify(orders_data), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@orders_bp.route('/<uuid:order_id>/status', methods=['PUT', 'OPTIONS'])
@cross_origin()  # Inherits app-level CORS config
def update_order_status(order_id):

    try:
        data = request.get_json()

        if 'status' not in data:
            return jsonify({"error": "Missing 'status' field"}), 400

        # Проверка допустимых статусов
        valid_statuses = ['pending', 'processing', 'completed', 'cancelled']
        if data['status'] not in valid_statuses:
            return jsonify({"error": f"Invalid status: {data['status']}"}), 400

        order = Order.query.get(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order.status = data['status']
        db.session.commit()
        return jsonify(order.to_dict()), 200

    except ValueError:
        return jsonify({"error": "Invalid UUID format"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500