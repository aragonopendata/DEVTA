# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup
import json


def get_info(uri, linkWikipedia):
    print uri + ', ' + linkWikipedia

session = requests.Session()

graph = 'http://es.dbpedia.org'
query = 'DESCRIBE <http://es.dbpedia.org/resource/'
output = 'application/json'

ins = open("uris.txt", "r")

for line in ins:
    response = session.get('http://es.dbpedia.org/sparql', params={'default-graph-uri':graph, 'query':query + line + '>', 'output':output}
    get_info(line, response[line]['http://xmlns.com/foaf/0.1/isPrimaryTopicOf'][0]['value'])
