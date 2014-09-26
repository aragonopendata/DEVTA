#!/bin/bash
akey="YOUR_API_KEY"
url="http://opendata.aragon.es/recurso/territorio/Municipio.json?_sort=label&_pageSize=50&_view=completa&api_key=$akey&_page="
echo "Script iniciado ..."
echo "Aragón Open Data - Municipios"
for i in {0..14}; do
    echo "$i : $url$i"
    content="$(curl -s "$url$i")"
    echo "$content" >> municipios.json
    echo "[FINALDEPETICION]" >> municipios.json
    sleep 15
done