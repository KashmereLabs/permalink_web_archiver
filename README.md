# Permalink Web Archiver
Permalink web archiver removes the noise from a webpage and strips down the webpage to its core generating an easily readable version of an article and archives it to Arweave permaweb.

It also bypasses any paywalls on a publisher website while generating the readable archive.

This project is meant to generate readable content artifacts and enable web content to be preserved over an extended period of time. 

Please use it judiciously and do not upload copyrighted content from the web.

You can visit the live deployment [here](https://arweave.net/RUgIEaUPJKPwscWRLG2GakOEB-GAG7ZmJSLFB9-Gw24)

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

### Archiving options
While archiving a webpage, the user may choose whether or not to archive the page summary along with the webpage content and whether or not they want to keep tht original article formatting.

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

## Screenshots
![Image to demonstrate the app home view](/resources/app_home_view.png)

![Image to demonstrate the page archive preview](/resources/archive_preview_view.png)

![Image to demonstrate the archived page](/resources/permaweb_page.png)

![Image to demonstrate the app mobile view](/resources/app_mobile_views.png)

## How it works
![Image to demonstrate the app workflow](/resources/workflow.png)

## Technical stack

The technical stack contains three parts-
### Client-

The client is a ReactJS project built using Create React app.
In the interest of preserving permanence of the app, all dependancies are included in the project as part of package json, and no external resources are being used via CDN calls.


### Middleware server-

The middleware server is an Express/NodeJS project which interacts with the Permaweb via the [Arweave JS SDK](https://github.com/ArweaveTeam/arweave-js).
It does not use any database layer and all of the persistence is done on Permaweb.

### Parser server-
The parser uses [Newspaper3k](https://github.com/codelucas/newspaper) for article parsing and summarization and [TextBlob](https://github.com/sloria/TextBlob/) for article sentiment analysis.
It exposes this data via a light http Flask server front-end. 


## Setup
The app contains 3 parts all of which needs to be setup individually.

Download the arweave wallet json and place it in project root in a file called *wallet.json*

Note: The wallet json contains your private keys so do not expose it to the world or put it in any of your repos.

Client runs a ReactJS stack, in order to run the client project. Default port is port 3000
- Create/Modify the env file with the host of your application server

- The env file assumes that the local application server is running on port 8000

```
 cd client
 sudo npm install
 npm start
```

The server is an Express NodeJS project

- Place the wallet.json file in the root of this project

- Create/Modify the env file with the URL of your parser server

```
cd server
sudo npm install
npm start
```

The parser contains libraries and methods for parsing and analyzing the webpage data.

Please install python3 on your system. Newspaper3k requires python3.

- It is recommnded to run the parser in a virtualenv environment.

- The default port for the flask server is port 5000

```
sudo pip3 install -r requirements.txt
env FLASK_APP=main.py flask run
```

