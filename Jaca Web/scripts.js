var map = null, layer = null, statCloropeth = null, infoWindow = null, colorCloropeth = "#FFFFFF";
var estadisticasGuardadas = [], bordes = true, currentType, relleno = true;

// Create map
function initialize() {
	document.getElementById("map_canvas").style.height=""+window.innerHeight-100+"px";
	var mapOptions = {
		center: new google.maps.LatLng(41.6488226, -0.8890853),
		zoom: 8,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}
var heightH = 30;
// Create EventListener for Right Panel
document.addEventListener('DOMContentLoaded',function(){
	var listado = document.getElementsByTagName('li');
	var estadisticas={};
	for(var i=0; i<listado.length;i++){
		listado[i].addEventListener('click',function(e){
			if(this.children[0].className === 'fa fa-circle-o'){
				if(document.getElementsByClassName('fa fa-dot-circle-o').length>0 && this.parentNode.parentNode.id === 'seleccionado'){
					document.getElementsByClassName('fa fa-dot-circle-o')[0].className = 'fa fa-circle-o';
					this.children[0].className = 'fa fa-dot-circle-o';	
					showOnMap(this.innerHTML.slice(this.innerHTML.indexOf("</i>")+4, this.innerHTML.length));
				}
				this.children[0].className = 'fa fa-dot-circle-o';	
				showOnMap(this.innerHTML.slice(this.innerHTML.indexOf("</i>")+4, this.innerHTML.length));

			}
			else if(this.children[0].className === 'fa fa-dot-circle-o'){
				this.children[0].className = 'fa fa-circle-o';
				showOnMap(null);						
			}
			else if(this.children[0].className === 'fa fa-square-o'){
				this.children[0].className = 'fa fa-check-square-o';
				changeOptions(this.innerHTML.slice(this.innerHTML.indexOf("</i>")+4, this.innerHTML.length))
			}
			else {
				this.children[0].className = 'fa fa-square-o';
				changeOptions(this.innerHTML.slice(this.innerHTML.indexOf("</i>")+4, this.innerHTML.length))
			}
		});
	}
});

function changeOptions(options){
	if(options === 'Mostrar bordes') bordes = !bordes;
	else relleno = !relleno;
	showOnMap(currentType);
}

function showOnMap(type){
	currentType = type;
	if(infoWindow !== null){
		infoWindow.close();
		infoWindow = null;
	}
	if(layer !== null || type === null){
		layer.setMap(null);
		layer = null;
		if(type === null) return;
	}
	else{
		var url;

		if(type === 'Municipios'){
			url = "1pWaqq6NknFwfBC0NJqIuYSe0uLojDZe9wGQuLbBj";
		}
		else if(type === 'Provincias'){
			url = "1rkPyKzP_xMurbQOFUeFhAUSjtEhFlrTuBiy8yDZF";
		}
		else if(type === 'Comarcas'){
			url = "1JRtgRcYFY9dc-ytTGyuZKnsd3ZRHUjL0QWe-PtMN";
		}
	else { //CCAA
		url = "1dCNLrCpTXL4LiruVb5glq2Cplb5kNikT67P814i8";
	}	

	// Create layer
	var st, templ;
	if(type === 'Comarcas'){
		if(bordes === true && relleno === true) {
			st = 2;
			templ = 2;
		}
		else if(bordes === true) {
			st = 3;
			templ = 4;
		}
		else if(relleno === true) {
			st = 5;
			templ = 6;
		}
		else return;
	}
	else {
		if(bordes === true && relleno === true) {
			st = 2;
			templ = 3;
		}
		else if(bordes === true) {
			st = 3;
			templ = 4;
		}
		else if(relleno === true) {
			st = 4;
			templ = 5;
		}
		else return;
	}
	layer = new google.maps.FusionTablesLayer({
		map: map,
		query: {
			select: "geometry",
			from: url
		},
		options: {
			styleId: st,
			templateId: templ,
			suppressInfoWindows: true
		}
	});

	// Map addEventListener
	google.maps.event.addListener(map, 'click',function(e){
		if(infoWindow !== null){
			infoWindow.close();
			infoWindow = null;
		}
		
	});

	// Layer addEventListener
	google.maps.event.addListener(layer, 'click', function(e){
		if(infoWindow !== null){
			infoWindow.close();
			infoWindow = null;
		}
		infoWindow = new google.maps.InfoWindow();
		var link;
		var label;
		if(typeof e.row.CCAA_URI !== 'undefined'){
			link = e.row.CCAA_URI.value;
			label = e.row.CCAA_NOMBRE.value;
		}
		else if(typeof e.row.MUN_URI !== 'undefined'){
			link = e.row.MUN_URI.value;
			label = e.row.MUN_NOMBRE.value;
		}
		else if(typeof e.row.PROV_URI !== 'undefined'){
			link = e.row.PROV_URI.value;
			label = e.row.PROV_NOMBRE.value;
		}
		else {
			link = e.row.COM_URI.value;
			label = e.row.COM_NOMBRE.value;
		}
		var h = e.infoWindowHtml.slice(e.infoWindowHtml.indexOf("height")+7, e.infoWindowHtml.indexOf("height")+12);
		var contenido = e.infoWindowHtml.replace(h, parseInt(h.slice(0, h.length-2), 10)+10+"px");
		contenido = contenido.replace("</div>",'<a href="#" onclick="showStat(\''+link+'\',\''+label+'\')">Añadir geo-recurso a estadísticas</a></div>');
		contenido = contenido.replace(encodeURI(link), link+"?api_key=e103dc13eb276ad734e680f5855f20c6");
		infoWindow.setContent(contenido);
		infoWindow.setPosition(e.latLng);
		infoWindow.open(map);
	});
	}
}

google.maps.event.addDomListener(window, 'load', initialize);
	function showStat(uri, label){//h hash de estadisticas
		if(estadisticasGuardadas.indexOf(uri)>=0 || estadisticasGuardadas.length>=10){alert('Error.'); return;}
		var lish = document.getElementById('estadisticas').getElementsByTagName('ul');
		if(lish.length === 0){
			document.getElementById('estadisticas').getElementsByTagName('p')[0].insertAdjacentHTML("afterend","<ul></ul>");
		}
		//var uls = document.getElementById('estadisticas').getElementsByTagName('ul')[0].children;
		lish[0].insertAdjacentHTML("beforeend",'<li><p>'+uri+'</p>'+label+'</li>');
		lish[0].getElementsByTagName('p')[lish[0].getElementsByTagName('p').length-1].style.display="none";
		estadisticasGuardadas.push(uri);
		document.getElementById('estadisticas').getElementsByTagName('p')[0].innerHTML = '<i class="fa fa-area-chart"></i>'+estadisticasGuardadas.length+' Geo-recursos seleccionados';
		if (estadisticasGuardadas.length == 1){
			document.getElementById('estadisticas').insertAdjacentHTML("beforeend",'<div class="borrar" id ="botonEstaditica"><p>Borrar Estadísticas</p></div>');
			document.getElementsByClassName('borrar')[0].addEventListener('click',eliminar);
		}
	}
	function eliminar(){
		document.getElementById('estadisticas').getElementsByTagName('ul')[0].remove();
		document.getElementById('estadisticas').getElementsByTagName('p')[0].innerHTML = '<i class="fa fa-area-chart"></i> 0 Geo-recursos seleccionados';
		document.getElementById('estadisticas').getElementsByTagName('div')[1].remove();
		estadisticasGuardadas=[];
		if(document.getElementById('info') !== null){
			document.getElementById('info').remove();
		}
	}
	function destroy(e){
		document.getElementById('info').remove();
		document.getElementById('ds').style.display = "none";
		document.getElementById('ds').removeEventListener('click', destroy, false);
	}

	function enviarEstadisticas(a){
		var totalEs=[];
		var arrayUL=[];
		var papa = a.parentNode.getElementsByTagName('ul')[0];
		for(var h = 0; h < papa.children.length; h++){
			totalEs.push(papa.children[h].getElementsByTagName('p')[0].innerHTML);//introducir la URI
			arrayUL.push([papa.children[h].getElementsByTagName('p')[0].innerHTML,papa.children[h].lastChild.textContent]);
		}
		if(document.getElementById('superior') !== null){
			document.getElementById('superior').getElementsByTagName('svg')[0].remove();
			document.getElementById('superior').innerHTML='<svg></svg>';
			document.getElementById('inferior').remove();
			document.getElementById('info').insertAdjacentHTML("beforeend",'<div id="inferior"></div>');
		}
		else{
			document.getElementsByTagName('body')[0].insertAdjacentHTML("beforeend",'<div id="info"><div id="superior"><svg></svg></div><div id="inferior"></div></div>');
		}
		document.getElementById('ds').style.display = "inline";
		document.getElementById('ds').addEventListener('click', destroy, false);
		createAreaChart(arrayUL);
		createBubbleChart(arrayUL);
	}

	function createAreaChart(uris){
		var json = buscarPoblacion(uris);
		nv.addGraph(function() {
		    var chart = nv.models.stackedAreaChart()
		                .x(function(d) { return d[0] })
		                .y(function(d) { return d[1] })
		                .clipEdge(true)
		                .useInteractiveGuideline(true)
		                .showControls(false)
		                .showLegend(true);

		  chart.xAxis
		      .showMaxMin(false);
		      //.tickFormat(d3.format(''));

		  chart.yAxis
		      .tickFormat(d3.format(''));

		  d3.select('#superior svg')
		    .datum(json)
		    .transition().duration(500).call(chart);
		  nv.utils.windowResize(chart.update);
		  return chart;
		});
	}

	function createBubbleChart(uris){
		var data = buscarAccidentes(uris);
		console.log(data);
		function truncate(str, maxLength, suffix) {
			if(str.length > maxLength) {
				str = str.substring(0, maxLength + 1); 
				str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
				str = str + suffix;
			}
			return str;
		}

		var margin = {top: 20, right: 200, bottom: 0, left: 40},
			width = 300,
			height = 650;

		var start_year = 2006,
			end_year = 2013;

		var c = d3.scale.category10();

		var x = d3.scale.linear()
			.range([0, width]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("top");

		var formatYears = d3.format("0000");
		xAxis.tickFormat(formatYears);

		var svg = d3.select("#inferior").append("svg")
			.datum(data)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.style("margin-left", margin.left + "px")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			x.domain([start_year, end_year]);
			var xScale = d3.scale.linear()
				.domain([start_year, end_year])
				.range([0, width]);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + 0 + ")")
				.call(xAxis);

			for (var j = 0; j < data.length; j++) {
				var g = svg.append("g").attr("class","journal");

				var circles = g.selectAll("circle")
					.data(data[j]['articles'])
					.enter()
					.append("circle");

				var text = g.selectAll("text")
					.data(data[j]['articles'])
					.enter()
					.append("text");

				var rScale = d3.scale.linear()
					.domain([0, d3.max(data[j]['articles'], function(d) { return d[1]; })])
					.range([2, 9]);

				circles
					.attr("cx", function(d, i) { return xScale(d[0]); })
					.attr("cy", j*20+20)
					.attr("r", function(d) { return rScale(d[1]); })
					.style("fill", function(d) { return c(j); });

				text
					.attr("y", j*20+25)
					.attr("x",function(d, i) { return xScale(d[0])-5; })
					.attr("class","value")
					.text(function(d){ return d[1]; })
					.style("font-weight","bold")
					.style("fill", function(d) { return c(j); })
					.style("display","none");

				g.append("text")
					.attr("y", j*20+25)
					.attr("x",width+20)
					.attr("class","label")
					.text(truncate(data[j]['name'],30,"..."))
					.style("font-weight","bold")
					.style("fill", function(d) { return c(j); })
					.on("mouseover", mouseover)
					.on("mouseout", mouseout);
			};

			function mouseover(p) {
				var g = d3.select(this).node().parentNode;
				d3.select(g).selectAll("circle").style("display","none");
				d3.select(g).selectAll("text.value").style("display","block");
			}

			function mouseout(p) {
				var g = d3.select(this).node().parentNode;
				d3.select(g).selectAll("circle").style("display","block");
				d3.select(g).selectAll("text.value").style("display","none");
			}
	}

	function buscarPoblacion(urisB){
		var result = [];
		var urisaB = [];
		busq = ["Total", "Hombres", "Mujeres"];
	    if(urisB.length>1){
	    	busq = ["Total"];
	    }
		for(var k = 0; k < urisB.length;k++){
			var t = urisB[k][0].slice(0,urisB[k][0].lastIndexOf('/'));
			if(t === 'http://opendata.aragon.es/recurso/territorio/ComunidadAutonoma') urisaB = statPoblaComunidad;
			else if(t === 'http://opendata.aragon.es/recurso/territorio/Provincia') urisaB = statPoblaProvincias;
			else if(t === 'http://opendata.aragon.es/recurso/territorio/Comarca') urisaB = statPoblaComarcas;
			else urisaB = statPoblaMunicipios;
	    	for (var t = 0; t < busq.length; t++){
	    		 var keyValue = (urisB.length > 1) ? urisB[k][1] : busq[t];
			     var ret = {
			      "key": keyValue,
			      "values": []
			    };    
	    		for(j in urisaB[urisB[k][0]]){ // j = año
	      			var n = j.slice(j.length-6,j.length); // n = año string
	      			ret.values.push([n, parseInt(urisaB[urisB[k][0]][j][busq[t]],10)]);  
	    		}
	    		result.push(ret);
	 		}
	 	}
	 	return result;
	}

	function buscarAccidentes(urisB){
		var result = [];
		var urisaB = [];
		busq = ["Total Accidentes", "Total Víctimas Mortales", 
            "Total Heridos Graves", "Total Heridos Leves", 
            "Carretera Accidentes", "Carretera Víctimas Mortales",
            "Carretera Heridos Graves", "Carretera Heridos Leves",
            "Vía urbana Accidentes", "Vía urbana Víctimas Mortales",
            "Vía urbana Heridos Graves", "Vía urbana Heridos Leves"];
	    if(urisB.length>1){
	    	busq = ["Total Accidentes"];
	    }
		for(var k = 0; k<urisB.length;k++){
			var t = urisB[k][0].slice(0,urisB[k][0].lastIndexOf('/'));
			if(t === 'http://opendata.aragon.es/recurso/territorio/ComunidadAutonoma') urisaB = statAcciComunidad;
			else if(t === 'http://opendata.aragon.es/recurso/territorio/Provincia') urisaB = statAcciProvincias;
			else if(t === 'http://opendata.aragon.es/recurso/territorio/Comarca') urisaB = statAcciComarcas;
			else urisaB = statAcciMunicipios;
	    	for (var t = 0; t < busq.length; t++){
	    		 var nameValue = (urisB.length > 1) ? urisB[k][1] : busq[t];
			     var ret = {
			      "articles": {},
			      "total": 0,
			      "name": nameValue
			    };    
	    		for(j in urisaB[urisB[k][0]]){ // j = año
	      			var n = j.slice(j.length-5, j.length); // n = año string
	      			ret['articles'][n] = parseInt(urisaB[urisB[k][0]][j][busq[t]],10); 
	      			ret['total'] += ret['articles'][n]; 
	    		}
	    		var retAux = Object.keys(ret['articles']).sort(function(a,b){return a-b});
	    		var r = [];
	    		for(var i = 0; i< retAux.length; i++){
	      			r.push([parseInt(retAux[i],10), ret['articles'][retAux[i]]]);
	    		}
	    		ret['articles'] = r;
	    		result.push(ret);
	 		}
	 	}
	 	return result;
	}