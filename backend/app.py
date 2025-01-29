from flask import Flask , request , jsonify, Response
from flask_cors import CORS
import pandas as pd
import numpy as np
from data_processing import get_reading_stats
import pickle
import json



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
      'cover_url':data['cover_url'],
      'start_date' : data.get('start_date' , None),
      'end_date' : data.get('end_date', None),
      'rating' : data.get('rating' , None),
      'review' : data.get('review', ''),
      'date_added' : data.get('date_added' , None),
  }
  if data['status'] == 'read':
        books_read.append(book)
  else:
        books_to_read.append(book)

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



@app.route('/api/topBooks' , methods = ['GET'])
def get_top_books():
      try :
        popular_df = pickle.load(open('model/popular_df', 'rb'))
        data =  popular_df.to_dict(orient = 'records')
        for entry in data :
            entry['Book-Title'] = str(entry['Book-Title'])
            entry['Book-Author'] = str(entry['Book-Author'])
            entry['Image-URL-M'] = str(entry['Image-URL-M'])
            entry['num_rating'] = int(entry['num_rating'])
            entry['avg_rating'] = round(float(entry['avg_rating']), 1)

        json_data = json.dumps(data)


        return Response(json_data, status=200, mimetype='application/json')
      except Exception as e :
          print(e)
          return jsonify({"error":"failed to fetch the data "}), 500
    


if __name__ == '__main__':
    app.run(debug=True)

    
            