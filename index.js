const API_KEY = "AIzaSyBX67Dvyft_rpGa3HoXeeGfGnZL4ATNrEA";
const NHOOD_NAMES = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const ELINCOME = "https://data.cityofnewyork.us/resource/q3m4-ttp3.json?$where= building_completion_date IS NOT NULL AND extremely_low_income_units!=0";
const CRIMES = "https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2015-12-31T00:00:00.000";
const geoShapes = "http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";

var dataNHood;
var dataHousing;

var districts = new Array(71);
var boroCD = new Array(71);
var disCenter = new Array(71);
var disDistance = new Array(71);
var disNear = new Array(71);
var disHousing = new Array(71);
var disCrimes = new Array(71);
var housingNum = new Array(71);
var crimesNum = new Array(71);

var map;
var ny_coodinates = { lat: 40.7291, lng: -73.9965};
var ny_marker;
var bro_coodinates = {lat: 40.650002, lng: -73.949997};
var bro_marker;
var directionsService;
var directionsRenderer;

function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
        
      zoom: 11,
      center: ny_coodinates
      
    });
    
        ny_marker = new google.maps.Marker({
        position: ny_coodinates,
        map: map,
        title: "NYUS"
        
    });
    
        bro_marker = new google.maps.Marker({
        position: bro_coodinates,
        map: map
        
    });
    
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    markerEvents(bro_marker);
    map.data.loadGeoJson('http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');
    dataGeo = $.getJSON(geoShapes, function(){
        console.log(dataGeo);
        for (var i = 0; i < 71; i++) {
            
            disNear[i] = i;
            disHousing[i] = i;
            disCrimes[i] = i;
            housingNum[i] = 0;
            crimesNum[i] = 0;
            boroCD[i] = dataGeo.responseJSON.features[i].properties.BoroCD;
            if(dataGeo.responseJSON.features[i].geometry.coordinates.length > 1){
                
                var size = 0;
                for(var j = 0; j < dataGeo.responseJSON.features[i].geometry.coordinates.length; j++){
                    
                    size = size + dataGeo.responseJSON.features[i].geometry.coordinates[j][0].length;
                    
                }
                
                var polygon = new Array(size);
                var count = 0;
                for(var k = 0; k < dataGeo.responseJSON.features[i].geometry.coordinates.length; k++){
                    
                    for(var l = 0; l < dataGeo.responseJSON.features[i].geometry.coordinates[k][0].length; l++){
                        
                        var lati = dataGeo.responseJSON.features[i].geometry.coordinates[k][0][l][1];
                        var long = dataGeo.responseJSON.features[i].geometry.coordinates[k][0][l][0];
                        var polyCoordinates = new google.maps.LatLng(lati,long);
                        polygon[count] = polyCoordinates;
                        count = count + 1;
                        
                    }
                    
                }
                
                districts[i] = polygon;
                
            }else{
                
                var polygon1 = new Array(dataGeo.responseJSON.features[i].geometry.coordinates[0].length);
                for(var m = 0; m < dataGeo.responseJSON.features[i].geometry.coordinates[0].length; m++){
                    
                    var lati1 = dataGeo.responseJSON.features[i].geometry.coordinates[0][m][1];
                    var long1 = dataGeo.responseJSON.features[i].geometry.coordinates[0][m][0];
                    var polyCoordinates1 = new google.maps.LatLng(lati1,long1);
                    polygon1[m] = polyCoordinates1;
                    
                }
                
                districts[i] = polygon1;
                
            }
            
            var polydis = new google.maps.Polygon({
                
                paths: districts[i],
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#EFFFF6',
                fillOpacity: 0.0003
                
            });
            
            var bounds = new google.maps.LatLngBounds();
            
            for (var n = 0; n < districts[i].length; n++) {
                
              bounds.extend(districts[i][n]);
              
            }
            
            disCenter[i] = bounds.getCenter();
          
        }
        
    });
    
    /*Its used to load the shapes of boroughs and print those shapes*/
    /*map.data.loadGeoJson('http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');*/
    
}

function markerEvents(marker){
    
    if(marker != "undefined"){
        
        marker.addListener("click", function(){
        getRoute();
            
        });
        
    }
    
}

function getRoute(){
    
    /*To know if the piont is inside of the polygon
    google.maps.geometry.poly.containsLocation(e.latLng, bermudaTriangle)*/
    
    var request = {
        
        origin: ny_marker.position,
        destination: bro_marker.position,
        travelMode: 'DRIVING'
        
    }

    directionsRenderer.setMap(map);
    directionsService.route(request, function(result, status){
        
        
        
    });
    
}

/*Function to get the dataset of neighborhood names, its necessary to click on the buttom Get NHood Names to execute this*/
function getNHoodNames(){
    
    dataNHood = $.getJSON(NHOOD_NAMES, function(){})
    .done(function(){
        
        console.log(dataNHood);
        tableReference = $("#districtsTable")[0];
        var newRow, name, point, borough;
        for(var i = 0; i < 299; i++){
            
            newRow = tableReference.insertRow(tableReference.rows.length);
            name = newRow.insertCell(0);
            point = newRow.insertCell(1);
            borough = newRow.insertCell(2);
            name.innerHTML = dataNHood.responseJSON.data[i][10];
            point.innerHTML = dataNHood.responseJSON.data[i][9];
            borough.innerHTML = dataNHood.responseJSON.data[i][16];
            
        }
        
    })
    
}

/*Function to get the data of the extremely low income, its necessary to click in the buttom Extremely Low Income, to execute this*/
function getHousingExtremelyLowIncome(){
    
    dataHousing = $.getJSON(ELINCOME, function(){})
    .done(function(){
        
        console.log(dataHousing);
        tableReference = $("#housingTable")[0];
        var newRow, name, street, bethrooms_1;
        var lati, long;
        
        for(var i = 0; i < 251; i++){
            
            newRow = tableReference.insertRow(tableReference.rows.length);
            name = newRow.insertCell(0);
            street = newRow.insertCell(1);
            bethrooms_1 = newRow.insertCell(2);
            name.innerHTML = dataHousing.responseJSON[i].borough;
            street.innerHTML = dataHousing.responseJSON[i].street_name;
            bethrooms_1.innerHTML = dataHousing.responseJSON[i]._1_br_units;
            lati = dataHousing.responseJSON[i].latitude;
            long = dataHousing.responseJSON[i].longitude;
            var coordinates = new google.maps.LatLng(lati,long);
            
            for(var j = 0; j < 71; j++){
                
                var polydis = new google.maps.Polygon({
                
                    paths: districts[j],
                    strokeColor: '#57DDC0',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#008367',
                    fillOpacity: 0.35
                    
                });
                
                if(google.maps.geometry.poly.containsLocation(coordinates, polydis)){
                    
                    housingNum[j] = housingNum[j] + 1;
                    
                }
                
            }
            
        }
        
        var k;
        var l;
        
    	for(i = 1; i < 71; i++){
    	    
    		for(j = 0; j < (71 - i); j++){
    		    
    			if(housingNum[j] < housingNum[j+1]){
    			    
    				k = disHousing[j + 1];
    				l = housingNum[j + 1];
    				disHousing[j + 1] = disHousing[j];
    				housingNum[j + 1] = housingNum[j];
    				disHousing[j] = k;
    				housingNum[j] = l;
    				
    			}
    			
    		}
    		
    	}
    	
        for(i = 0; i < 10; i++){
            
            var polydisH = new google.maps.Polygon({
                
                paths: districts[disHousing[i]],
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#004F6C',
                fillOpacity: 0.8
                
            });
            
            polydisH.setMap(map);
            
        }
        
    })
    
}

/*Function to calculate the top 10 districts in safety, click on safety to execute it*/
function getSafety(){
    
    var lati, long;
    var crimes = $.ajax({
        url: "https://data.cityofnewyork.us/resource/9s4h-37hy.json",
        data: {
          "cmplnt_fr_dt" : '2015-12-31T00:00:00.000',
          $limit : 5000
        }
    })
    .done(function(){
      
        console.log(crimes);
        for(var i = 0; i < 1090; i++){
            
            if(crimes.responseJSON[i].latitude != undefined){
                
                lati = crimes.responseJSON[i].latitude;
                long = crimes.responseJSON[i].longitude;
                var coordinates = new google.maps.LatLng(lati,long);
                
                for(var j = 0; j < 71; j++){
                
                    var polydis = new google.maps.Polygon({
                    
                        paths: districts[j],
                        strokeColor: '#57DDC0',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#008367',
                        fillOpacity: 0.35
                        
                    });
                    
                    if(google.maps.geometry.poly.containsLocation(coordinates, polydis)){
                        
                        crimesNum[j] = crimesNum[j] + 1;
                        
                    }
                    
                }
                
                var marker = new google.maps.Marker({
                    
                    position: coordinates,
                    map: map
                    
                });
                
                marker.setMap(map);
                
            }
            
        }
        
        var k;
        var l;
        
    	for(i = 1; i < 71; i++){
    	    
    		for(j = 0; j < (71 - i); j++){
    		    
    			if(crimesNum[j] > crimesNum[j+1]){
    			    
    				k = disCrimes[j + 1];
    				l = crimesNum[j + 1];
    				disCrimes[j + 1] = disCrimes[j];
    				crimesNum[j + 1] = crimesNum[j];
    				disCrimes[j] = k;
    				crimesNum[j] = l;
    				
    			}
    			
    		}
    		
    	}
    	
    	for(i = 12; i < 22; i++){
            
            var polydisC = new google.maps.Polygon({
                
                paths: districts[disCrimes[i]],
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#004F6C',
                fillOpacity: 0.8
                
            });
            
            polydisC.setMap(map);
            
        }
        
    });
    
}

/*Function to calculate the top 10 districts near of the university*/
function getNearest10(){
    
    for(var i = 0; i < 71; i++){
    
        var distance = google.maps.geometry.spherical.computeDistanceBetween(disCenter[i], ny_coodinates);
        disDistance[i] = distance;
        
        
    }
    
    var k;
    var l;
    
	for(i = 1; i < 71; i++){
	    
		for(j = 0; j < (71 - i); j++){
		    
			if(disDistance[j] > disDistance[j+1]){
			    
				k = disNear[j + 1];
				l = disDistance[j + 1];
				disNear[j + 1] = disNear[j];
				disDistance[j + 1] = disDistance[j];
				disNear[j] = k;
				disDistance[j] = l;
				
			}
			
		}
		
	}
    
    for(i = 0; i < 10; i++){
            
        var polydisH = new google.maps.Polygon({
            
            paths: districts[disNear[i]],
            strokeColor: '#000000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#004F6C',
            fillOpacity: 0.8
            
        });
        
        polydisH.setMap(map);
        
    }
    
}

$(document).ready(function(){
    
    $("#NHood").on("click",getNHoodNames);
    $("#Housing").on("click",getHousingExtremelyLowIncome);
    $("#Nearest").on("click",getNearest10);
    $("#Safety").on("click",getSafety);
    //getDistrictsPolygons();
    
})