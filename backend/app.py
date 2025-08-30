from flask import Flask, jsonify, redirect, request
from flask_cors import CORS
from flasgger import Swagger
import json
import os

app = Flask(__name__)
CORS(app)
Swagger(app)

DATA_PATH = '/Users/kishorependyala/git/live-event-schedule-data/data.json'

def load_performances():
    with open(DATA_PATH, 'r') as f:
        return json.load(f)

def save_performances(data):
    with open(DATA_PATH, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def docs_redirect():
    return redirect('/apidocs')

@app.route('/api/performances', methods=['GET'])
def get_performances():
    """
    Get all performances
    ---
    responses:
      200:
        description: A list of performances
        schema:
          type: array
          items:
            type: object
            properties:
              title:
                type: string
              duration:
                type: string
              coordinator:
                type: string
              performers:
                type: array
                items:
                  type: object
                  properties:
                    name:
                      type: string
                    img:
                      type: string
    """
    performances = load_performances()
    return jsonify(performances)

@app.route('/api/performances/<int:idx>', methods=['PUT'])
def update_performance(idx):
    """
    Update a performance by index
    ---
    parameters:
      - name: idx
        in: path
        type: integer
        required: true
        description: Index of the performance to update
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            duration:
              type: string
            coordinator:
              type: string
            performers:
              type: array
              items:
                type: object
                properties:
                  name:
                    type: string
                  img:
                    type: string
    responses:
      200:
        description: Success
        schema:
          type: object
          properties:
            success:
              type: boolean
    """
    data = load_performances()
    if idx < 0 or idx >= len(data):
        return jsonify({'error': 'Index out of range'}), 400
    payload = request.json
    data[idx] = payload
    save_performances(data)
    return jsonify({'success': True})

@app.route('/api/performances/<int:idx>', methods=['DELETE'])
def delete_performance(idx):
    """
    Delete a performance by index
    ---
    parameters:
      - name: idx
        in: path
        type: integer
        required: true
        description: Index of the performance to delete
    responses:
      200:
        description: Success
        schema:
          type: object
          properties:
            success:
              type: boolean
    """
    data = load_performances()
    if idx < 0 or idx >= len(data):
        return jsonify({'error': 'Index out of range'}), 400
    data.pop(idx)
    save_performances(data)
    return jsonify({'success': True})

@app.route('/api/performances', methods=['POST'])
def add_performance():
    """
    Add a new performance
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            duration:
              type: string
            coordinator:
              type: string
            performers:
              type: array
              items:
                type: object
                properties:
                  name:
                    type: string
                  img:
                    type: string
    responses:
      200:
        description: Success
        schema:
          type: object
          properties:
            success:
              type: boolean
    """
    data = load_performances()
    payload = request.json
    data.append(payload)
    save_performances(data)
    return jsonify({'success': True})

@app.route('/api/performances/reorder', methods=['POST'])
def reorder_performances():
    """
    Reorder performances
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            from:
              type: integer
            to:
              type: integer
    responses:
      200:
        description: Success
        schema:
          type: object
          properties:
            success:
              type: boolean
    """
    data = load_performances()
    payload = request.json  # expects {"from": int, "to": int}
    from_idx = payload.get('from')
    to_idx = payload.get('to')
    if from_idx is None or to_idx is None or from_idx < 0 or from_idx >= len(data) or to_idx < 0 or to_idx >= len(data):
        return jsonify({'error': 'Invalid indices'}), 400
    moved = data.pop(from_idx)
    data.insert(to_idx, moved)
    save_performances(data)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
