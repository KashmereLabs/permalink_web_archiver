from flask import Flask
from flask import request
import nltk
nltk.download('punkt')

from nltk import word_tokenize,sent_tokenize

from newspaper import Article

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"
    
@app.route("/fetch")
def fetch_data():
  url = request.args.get('url')
  
  article = Article(url)
  article.download()

  article.parse()
  
  article.nlp()
  
  return {"summary": article.summary, "title": article.title, "image": article.top_image, "keywords": article.keywords, "full_text": article.text}