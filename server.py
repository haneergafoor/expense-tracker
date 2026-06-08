#!/usr/bin/env python3
"""
Expense Tracker Flask Server
Provides backend support for the expense tracking application
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
from datetime import datetime, timedelta
import json
import os
from pathlib import Path

app = Flask(__name__)
DATA_FILE = Path(__file__).parent / 'data.json'

# Initialize data storage
def load_data():
    if DATA_FILE.exists():
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {
        'expenses': [],
        'categories': [
            {'id': 1, 'name': 'Food', 'color': '#FF6B6B'},
            {'id': 2, 'name': 'Fuel', 'color': '#4ECDC4'},
            {'id': 3, 'name': 'Hospital', 'color': '#95E1D3'},
            {'id': 4, 'name': 'Bills', 'color': '#F38181'},
            {'id': 5, 'name': 'Home Maintenance', 'color': '#AA96DA'},
            {'id': 6, 'name': 'Others', 'color': '#FCBAD3'}
        ],
        'budget': 20000
    }

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# API Routes
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    data = load_data()
    return jsonify(data['expenses'])

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = load_data()
    expense = request.json
    expense['id'] = str(int(datetime.now().timestamp() * 1000))
    expense['createdAt'] = datetime.now().isoformat()
    data['expenses'].append(expense)
    save_data(data)
    return jsonify(expense), 201

@app.route('/api/expenses/<expense_id>', methods=['PUT'])
def update_expense(expense_id):
    data = load_data()
    for i, exp in enumerate(data['expenses']):
        if exp['id'] == expense_id:
            data['expenses'][i].update(request.json)
            save_data(data)
            return jsonify(data['expenses'][i])
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/expenses/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    data = load_data()
    data['expenses'] = [e for e in data['expenses'] if e['id'] != expense_id]
    save_data(data)
    return jsonify({'success': True})

@app.route('/api/categories', methods=['GET'])
def get_categories():
    data = load_data()
    return jsonify(data['categories'])

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    data = load_data()
    expenses = data['expenses']
    
    now = datetime.now()
    current_month_expenses = [
        e for e in expenses 
        if datetime.fromisoformat(e['date']).month == now.month
        and datetime.fromisoformat(e['date']).year == now.year
    ]
    
    total = sum(e['amount'] for e in current_month_expenses)
    count = len(current_month_expenses)
    
    analytics = {
        'totalSpending': total,
        'transactionCount': count,
        'dailyAverage': total / now.day if now.day > 0 else 0,
        'highest': max([e['amount'] for e in current_month_expenses], default=0),
        'lowest': min([e['amount'] for e in current_month_expenses], default=0),
        'byCategory': {}
    }
    
    for exp in current_month_expenses:
        cat_id = exp['categoryId']
        if cat_id not in analytics['byCategory']:
            analytics['byCategory'][cat_id] = {'total': 0, 'count': 0}
        analytics['byCategory'][cat_id]['total'] += exp['amount']
        analytics['byCategory'][cat_id]['count'] += 1
    
    return jsonify(analytics)

@app.route('/api/export', methods=['GET'])
def export_data():
    data = load_data()
    return jsonify(data)

@app.route('/api/budget', methods=['GET'])
def get_budget():
    data = load_data()
    return jsonify({'budget': data['budget']})

@app.route('/api/budget', methods=['POST'])
def set_budget():
    data = load_data()
    data['budget'] = request.json['budget']
    save_data(data)
    return jsonify({'budget': data['budget']})

if __name__ == '__main__':
    print("🚀 Expense Tracker Server starting...")
    print("📍 Visit: http://localhost:5000")
    print("Press Ctrl+C to stop")
    app.run(debug=True, port=5000, host='127.0.0.1')
