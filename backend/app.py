from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), 'phishing_model.joblib')
pipeline = load(model_path)

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Phishing Detector API is running.'})

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    message = data.get('message', '')
    link = data.get('link', '')
    text_to_analyze = f"{message} {link}"
    prediction = pipeline.predict([text_to_analyze])
    result = prediction[0]
    return jsonify({'result': result})

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found. Please use /analyze for POST requests.'}), 404

if __name__ == '__main__':
    if not os.path.exists(model_path):
        print("Model not found. Training a new one...")
        from train_model import *
    app.run(debug=True) 