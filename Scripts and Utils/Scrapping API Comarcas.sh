#!/bin/bash
akey="YOUR_API_KEY"
url="http://opendata.aragon.es/recurso/territorio/Comarca.json?_sort=label&_pageSize=50&_view=completa&api_key=$akey&_page=0"
echo "Script iniciado ..."
echo "Aragón Open Data - Comarcas"
echo "$i : $url$i"
content="$(curl -s "$url$i")"
echo "$content" >> comarcas.json