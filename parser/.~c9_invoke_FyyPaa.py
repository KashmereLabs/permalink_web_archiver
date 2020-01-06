from flask import Flask
from flask import request
import nltk
from textblob import TextBlob
nltk.download('punkt')
from nltk import word_tokenize,sent_tokenize

from newspaper import Article

app = Flask(__name__)

@app.route("/")
def index():
    return "Welcome to permalink web archiver parser"
    
@app.route("/fetch")
def fetch_data():
  url = request.args.get('url')
  article = Article(url)
  article.download()
  article.parse()
  article.nlp()


  # Get sentiment from article title and summary
  sentiment_blob = TextBlob(article.title +". "+article.text)

  return {"summary": article.summary, "title": article.title, "image": article.top_image,
          "keywords": article.keywords, "full_text": article.text, "publish_date": article.publish_date,
          "sentiment": sentiment_blob.sentiment[0], "authors": article.authors}
  