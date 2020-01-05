# Permalink Web Archiver
Permalink web archiver strips down the noise from a webpage and generates a readable version of an article and archives it to Arweave permaweb.

## Motivation
Webpages are filled with adware, noise and unnecessary parts. This app generates a short summary and detailed text, representation and stores it permanently to the Arweave 
permaweb. 


## How it works


## Technical stack


## Setup
The app contains 3 parts all of which needs to be setup individually.
Download the arweave wallet json and place it in project root in a file called wallet.json
Note: The wallet json contains your private keys so do not expose it to the world or put it in any of your repos.

Client runs a ReactJS stack, in order to run the client project.
> cd client
> sudo npm install
> npm start
The env file assumes that the local server is running on port 8000

The server is a NodeJS project
> cd server
> sudo npm install
> npm start

The parser contains libraries and methods for parsing and analyzing the webpage data
It is recommnded to run the parser in a virtualenv environment.
> pip install
> env FLASK_APP=main.py flask run



## Coming Soon
