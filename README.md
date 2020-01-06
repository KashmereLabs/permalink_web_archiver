# Permalink Web Archiver
Permalink web archiver removes the noise from a webpage and strips down the webpage to its core generating an easily readable version of an article and archives it to Arweave permaweb.

It also bypasses any paywalls on a publisher website while generating the readable archive.

This project is meant to generate readable content artifacts and enable web content to be preserved over an extended period of time. 

Please use it judiciously and do not upload copyrighted content from the web.

## Motivation
Webpages are filled with adware, noise and unnecessary parts.
It is often hard not to get distracted by all the unnecessary content and get pulled into the rabbit hole of clickbait adware.

Furthermore webpages are often transient and do not last a very long time.
A publisher might delete old content to free up disk space or the company hosting might go out of business. 
This means that all of the content that was stored in the company servers are then lost forever.


## Features
This app generates a short summary and detailed text, representation and stores it permanently to the Arweave permaweb.

Salient features include-

### Article Archiving
Companies come and go, web-servers shut down, content gets deleted all the time.
Once an article is archived with this app, it will be preserved in the permaweb forever.

### Article cleaning
Removes extra fkuff from a webpage and strips it down to its main content and image.

### Article tagging
Automatic tag extraction for better organization, management and querying

### Article summarization
Automatically generated article summary for the webpage content so that you can get the gist without spending too much time reading the entire article.

### Article Sentiment
Article sentiment polarity scoring.

### Rich Social Media cards
Use of open graph tags for creating rich social media previews for all archived content. 

### Permaweb tags 
Tags added to permaweb include date published, author, keywords, original link for easy retrieval and organization of the collection of articles in permaweb.

### Bypass paywalls
Most articles which are paywalled when viewed online can be accessed in full text form when parsed server-side. Thus text previews and archives can be generated even for paywalled content.

## How it works



## Technical stack


## Setup
The app contains 3 parts all of which needs to be setup individually.

Download the arweave wallet json and place it in project root in a file called *wallet.json*

Note: The wallet json contains your private keys so do not expose it to the world or put it in any of your repos.

Client runs a ReactJS stack, in order to run the client project.

```
 cd client
 sudo npm install
 npm start
```

The env file assumes that the local server is running on port 8000

The server is a NodeJS project

```
cd server
sudo npm install
npm start
```

The parser contains libraries and methods for parsing and analyzing the webpage data
It is recommnded to run the parser in a virtualenv environment.

```
pip install
env FLASK_APP=main.py flask run
```

