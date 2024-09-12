from flask import Flask , request , jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from data_processing import get_reading_stats

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

books_read = []
books_to_read = [] 

@app.route('/api/add-book' , methods = ['POST'])
def add_book():
  data = request.json
  book = {
      'title' : data['title'],
      'author' : data['author'],
      'status' : data['status'],
      'start_date' : data.get('start_date' , None),
      'end_date' : data.get('end_date', None),
      'rating' : data.get('rating' , None),
      'review' : data.get('review', ''),
      'date_added' : data.get('date_added' , None),
  }
  if data['status'] == 'read':
        books_read.append(data)
  else:
        books_to_read.append(data)

  return jsonify({'message': 'Book added successfully'}), 200






@app.route('/api/remove-books' , methods = ['DELETE'])
def remove_book():
  data = request.json
  title = data['title']
  author = data['author']


  for book in books_read:
      if book['title'] == title and book['author'] == author:
          books_read.remove(book)
          return jsonify({"message" : "book removed successfully" , "status" : "read"}) , 200
      
  for book in books_to_read:
      if book['title'] == title and book['author'] == author  : 
          books_to_read.remove(book)
          return jsonify({"message" : "book removed successfully ", "status" : "to_read"}) , 200
          
 
  return jsonify({"message" : "book not found"}) , 404



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

    
            