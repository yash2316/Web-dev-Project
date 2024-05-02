import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI
from pydantic import BaseModel
import re
import os


app = FastAPI()


print("hello world")

@app.get("/")
async def root():
    return {"status": "OK"}

class Item(BaseModel):
    url: str
    percentage: int
    


def extract_article_content(url):
    try:
        # Fetch the HTML content of the article URL
        response = requests.get(url)

        soup = BeautifulSoup(response.text, 'html.parser')
        results = soup.find_all(['h1', 'p'])
        text = [result.text for result in results]
        ARTICLE = ' '.join(text)
        
        return ARTICLE
    except Exception as e:
        return f"Error: {e}"


@app.post("/summarize-v1")
async def root(item: Item):
    
    try:

        article = extract_article_content(item.url)

        url = "https://text-analysis12.p.rapidapi.com/summarize-text/api/v1.1"

        payload = {
            "language": "english",
            "summary_percent": item.percentage,
            'text': article
                   }
        headers = {
            "content-type": "application/json",
            "X-RapidAPI-Key": os.environ.get("rapid_key"),
            "X-RapidAPI-Host": "text-analysis12.p.rapidapi.com"
        }

        response = requests.post(url, json=payload, headers=headers).json()


        #text processing
        text = response["summary"].replace('\"', " ");
        text = re.sub(r'\s+', ' ', text)
        

        #return {clean_response}
        return {
                "summary":text}
        
    except requests.RequestException as e:
        return {"error": str(e), "status_code": 500}
    
@app.post("/summarize-v2")
async def root(item: Item):
    
    try:

        article = extract_article_content(item.url)

        response = requests.post('https://fumes-api.onrender.com/llama3',
        json={'prompt': "{ 'User': 'Summarize the following news article: '" + article + "}",
        "temperature":0.6,
        "topP":0.9,
        "maxTokens": 200}, stream=True)

        response_content = response.content.decode('utf-8')

        response_content = response_content.replace("Here is a summary of the news article:", "")
        response_content = response_content.replace("YOU CAN BUY ME COFFE! https://buymeacoffee.com/mygx", "")

        #return {clean_response}
        return {
                "summary":response_content}
        
    except requests.RequestException as e:
        return {"error": str(e), "status_code": 500}
    



