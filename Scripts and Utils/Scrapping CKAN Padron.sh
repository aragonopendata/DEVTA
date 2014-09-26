#!/bin/bash
akey="YOUR_API_KEY"
url="http://opendata.aragon.es/catalogo/render/resource/Cifras%20de%20Poblaci%C3%B3n.%20Revisi%C3%B3n%20del%20Padr%C3%B3n%20municipal.%20"
echo "Script iniciado ..."
echo "Aragón Open Data - Estadísticas de población"
for i in {1998..2013}; do
    echo "$i : $url$i.%20Municipios.json?api_key=$akey"
    content="$(curl -s "$url$i.%20Municipios.json?api_key=$akey")"
    echo "$content" >> statMunicipios.json
    echo "[FINALDEPETICION]" >> statMunicipios.json
    sleep 15
done