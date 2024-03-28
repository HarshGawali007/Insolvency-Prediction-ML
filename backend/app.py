import os
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})

# Specify the path to your serialized model file
model_filename = 'C:/Users/Harsh/Desktop/reduced_model.pkl'  # Update with your actual path

# Load the serialized model from the file
with open(model_filename, 'rb') as f:
    model = pickle.load(f)

@app.route('/')
def index():
    # Example endpoint to demonstrate model usage
    # Here, 'model' refers to your loaded machine learning model
    # Example input for prediction
    input_data = [[0.3, 0.2, 0.43, 0.34, 10.0, 0.25, 0.4, 0.3, 0.54, 0.46]]
    result = model.predict(input_data)
    return jsonify({'prediction': result.tolist()})  

@app.route('/predict', methods=['OPTIONS', 'POST'])
def predict():
    if request.method == 'OPTIONS':
        # Set CORS headers for the OPTIONS response
        headers = {
            'Access-Control-Allow-Origin': 'http://localhost:3000',  # Replace with your frontend origin
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',  # Cache preflight response for 1 hour
        }
        return '', 204, headers  # Return empty response with CORS headers and 204 status code

    elif request.method == 'POST':
        # Retrieve input data from the POST request
        input_data = request.json  # Assuming JSON data is sent from frontend
        
         # Perform prediction using your machine learning model
        # Convert input data from string to float
        input_data = [float(value) for value in input_data.values()]

        prediction = model.predict([input_data])


        # Return the prediction result as JSON response
        return jsonify({'prediction': prediction.tolist()})  # Convert prediction to JSON format

    else:
        return jsonify({'error': 'Method Not Allowed'}), 405  # Return error for other methods

if __name__ == '__main__':
    app.run(debug=True)
