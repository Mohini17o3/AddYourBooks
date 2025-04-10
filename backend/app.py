from flask import Flask , request , jsonify, Response
from flask_cors import CORS
import numpy as np
from dotenv import load_dotenv
import os
from data_processing import get_reading_stats
import pickle
import json
import requests
import difflib


load_dotenv()  # Ensure this is at the top of your file

url = os.getenv("EXPRESS_BACKEND_URL")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}});


books_read = []


def add_book(token):
  try :
      headers = {
            'Authorization': f'Bearer {token}'
        }
      
      response = requests.get(f"{url}/api/books/read" , headers=headers)

      print(f"API Response Status Code: {response.status_code}")


      if response.status_code == 200:
          data = response.json()

          for entry in data['books']:
             book = {
           'title' : entry['title'],
           'author' : entry['author'],
           'status' : entry['status'],
           'cover_url':entry['cover_url'],
           'start_date' : entry.get('start_date' , None),
           'end_date' : entry.get('end_date', None),
           'rating' : entry.get('rating' , None),
           'review' : entry.get('review', ''),
           'date_added' : entry.get('date_added' , None),
          }
          books_read.append(book)
      else : 
          print(f"Error fetching books : {response.status_code}")


  except Exception as e :
         print(f"error occurred : {e}")       

    
    

@app.route('/api/reading-stats' , methods=['GET'])
def reading_stats():
    token = request.headers.get('Authorization').split("Bearer ")[-1]

    add_book(token)


    stats = get_reading_stats(books_read)
    
    return jsonify(stats)



def get_stored_books(token):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(f"{url}/books" , headers=headers)
    print(f"api response : {response.status_code}")

    data = {}
    if response.status_code == 200 :
        data = response.json()

    return data 

def recommend(book_name):
        
        pt = pickle.load(open('model/pt.pkl' , 'rb'))
        books = pickle.load(open('model/books.pkl' , 'rb'))
        similarity_scores= pickle.load(open('model/similarity_scores.pkl' , 'rb'))

        closest_match = difflib.get_close_matches(book_name , pt.index , n=1 , cutoff = 0.5)

        if not closest_match :
            return {"error" : "No close match found"}

        best_match = closest_match[0]   


    # index fetch -> on which index a book lies
        index = np.where(pt.index == best_match)[0][0]       
        similar_items = sorted(list(enumerate(similarity_scores[index])), key=lambda x:x[1] , reverse = True)[1:4]
        data = []
        
        for i in similar_items:
        # gives book name of ith index
          item = []
          temp_df = books[books['Book-Title'] == pt.index[i[0]]]
          item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Title'].values))
          item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Author'].values))
          item.extend(list(temp_df.drop_duplicates('Book-Title')['Image-URL-M'].values))

          data.append(item)        
        return data 



@app.route('/api/recommendations' , methods=['GET'])
def get_recommendations():
    token = request.headers.get('Authorization').split("Bearer ")[-1]
    books = get_stored_books(token)
    
    print("Books fetched:", books)  # Debugging

    if not books or "books" not in books:
        return jsonify({"error": "No books found"}), 404   

    books = books["books"]    
    try:
        recommended_books = []
        for book in books :
             recommendations = recommend(book["title"])
             print("recommendations" ,recommendations )
             for rec in recommendations :                
               recommended_books.append({
                   "title" : rec[0] , 
                   "author":rec[1], 
                   "image_url":rec[2]
               })

        return jsonify({"recommended_books": recommended_books}), 200

    except Exception as  e :
        print(e)
        return jsonify({"error" : "failed to fetch the data"}), 500



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

    
            