var interval = 50;
var mySymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: '#393'
};
var line;

function makeRouteLatLng(Lat, Lng) {
    var position = {
        lat: Lat,
        lng: Lng
    };
    makeRoute(position);
}

function makeRoute(position) {
	clearRoute();
    removePlacesfromList();
    var request = {
        origin: myPos,
        destination: position,
        travelMode: google.maps.DirectionsTravelMode.WALKING
    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            // Display the distance:
            //document.getElementById('distance').innerHTML += 
            console.log(response.routes[0].legs[0].distance.value + " meters");

            // Display the duration:
            //document.getElementById('duration').innerHTML += 
            console.log(response.routes[0].legs[0].duration.value + " seconds");
            distance = response.routes[0].legs[0].duration.value + " meters";

            directionsDisplay.setDirections(response);
            createPolyline(response);
        }
    });
}

function createPolyline(directionResult) {
    line = new google.maps.Polyline({
        path: directionResult.routes[0].overview_path,
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 4,
        icons: [{
            icon: mySymbol,
            offset: '100%'
        }],
    });
    line.setMap(map);
    animate();
};

function animate() {
    var count = 0;
    var myAnimation = window.setInterval(function() {
        count = (count + 1) % 200;
        var icons = line.get('icons');
        icons[0].offset = (count / 2) + '%';
        line.set('icons', icons);
        if (count >= 199) {
            clearInterval(myAnimation);
        };
    }, interval);
};

function clearRoute(){
	if(line != null)
		line.setMap(null);
};
