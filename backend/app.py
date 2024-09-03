from flask import Flask , request , jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from data_processing import get_reading_stats

app = Flask(__name__)
CORS(app)

books_read = []
books_to_read = []  

@app.route('/api/add-book' , methods = ['POST'])
def add_book():
  data = request.json
  if data['status'] == 'read':
        books_read.append(data)
  else:
        books_to_read.append(data)

  return jsonify({'message': 'Book added successfully'}), 200



@app.route('/api/reading-stats' , methods=['GET'])
def reading_stats():
    stats = get_reading_stats(books_read)
    return jsonify(stats)

@app.route('/api/books' , methods=['GET'])
def get_books():
    return jsonify({
        'read': books_read,
        'to_read': books_to_read
    })

if __name__ == '__main__':
    app.run(debug=True)

    
            