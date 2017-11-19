var api_key = "AIzaSyAXADZtpBtC4Zdrhh40pYgAxIecba_0OLg";
var kmllayer = new google.maps.KmlLayer('http://maverick.eti.pg.gda.pl/KML/tt.kml');
var map;
var geocoder = new google.maps.Geocoder();
var infoWindow = new google.maps.InfoWindow();
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
var myPos;
var myPosMarker;
var infoWindow;
var tempIndex;


function initialize() {
    var myOptions = {
        zoom: 18,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        overviewMapControl: true,
        center: new google.maps.LatLng(54.3715612, 18.6121757),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    myOptions: panControl = true;

    map = new google.maps.Map(document.getElementById('map'),
        myOptions);
    directionsDisplay.setPanel(document.getElementById("places-list"));
    kmllayer.setMap(map);
    directionsDisplay.setMap(map);

    infoWindow.setMap(map);


    //	create the ContextMenuOptions object
    var contextMenuOptions = {};
    contextMenuOptions.classNames = {
        menu: 'context_menu',
        menuSeparator: 'context_menu_separator'
    };

    //	create an array of ContextMenuItem objects
    var menuItems = [];
    menuItems.push({
        className: 'context_menu_item',
        eventName: 'zoom_in_click',
        label: 'Zoom in'
    });
    menuItems.push({
        className: 'context_menu_item',
        eventName: 'zoom_out_click',
        label: 'Zoom out'
    });
    //	a menuItem with no properties will be rendered as a separator
    menuItems.push({});
    menuItems.push({
        className: 'context_menu_item',
        eventName: 'set_position',
        label: 'Set position'
    });
    contextMenuOptions.menuItems = menuItems;

    //	create the ContextMenu object
    var contextMenu = new ContextMenu(map, contextMenuOptions);

    //	display the ContextMenu on a Map right click
    google.maps.event.addListener(map, 'rightclick', function(mouseEvent) {
        contextMenu.show(mouseEvent.latLng);
    });

    //	listen for the ContextMenu 'menu_item_selected' event
    google.maps.event.addListener(contextMenu, 'menu_item_selected', function(latLng, eventName) {
        //	latLng is the position of the ContextMenu
        //	eventName is the eventName defined for the clicked ContextMenuItem in the ContextMenuOptions
        switch (eventName) {
            case 'zoom_in_click':
                map.setZoom(map.getZoom() + 1);
                break;
            case 'zoom_out_click':
                map.setZoom(map.getZoom() - 1);
                break;
            case 'set_position':
                setCurrentPosition(latLng);
                break;
        }
    });
}

function searchLocations() {
	var locationType = document.getElementById("idSelectPlace").value;
	var radius = document.getElementById("idSelectRadius").value;
	
	switch (locationType) {
		case 'Hotel':
			loadPlaces(radius, 'lodging');
			break;
		case 'Restaurant':
			loadPlaces(radius, 'restaurant');
			break;
    };
}

//Find my current Location
function findMyLocation() {
    clearMarkers();
    //var infoWindow = new google.maps.InfoWindow({map: map});
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            myPos = pos;
            infoWindow.setPosition(pos);
            infoWindow.setContent('Moja lokalizacja');
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function setCurrentPosition(latLng) {
	if(myPosMarker != null)
		myPosMarker.setMap(null);
    clearMarkers();
    myPos = latLng;
    map.setCenter(latLng);
	myPosMarker = new google.maps.Marker({
        map: map,
        position: myPos,
		icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'

    });
}


function loadPlaces(radius, type) {
    clearMarkers();
	clearRoute();

    var service = new google.maps.places.PlacesService(map);
	
	var searchPoint;
	if(myPos != null)
		searchPoint = myPos;
	else
		searchPoint = map.getCenter();
		

    service.radarSearch({
        location: searchPoint,
        radius: radius,
        rankBy: google.maps.places.RankBy.DISTANCE,
        type: [type]
    }, callback);

}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        var service = new google.maps.places.PlacesService(map);
		tempIndex = 1;
        for (var i = 0; i < results.length; i++) {
            try {
                service.getDetails({
                    placeId: results[i].place_id
                }, function(place, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        createMarker(place.geometry.location);
                        addPlaceToTable(place);
                    }
                });

            } catch (e) {}
        }
    }
}

function addPlaceToTable(place) {
    var lng = place.geometry.location;
    var list = document.getElementById("places-list");
    var row = document.createElement('tr');
	row.setAttribute("onClick", "makeRouteLatLng" + place.geometry.location + ";");
	
	var col1 = document.createElement('th');
	var col2 = document.createElement('td');
	var col3 = document.createElement('td');
	
	var textCol1 = document.createTextNode(tempIndex);
	var textCol2 = document.createTextNode(place.name);
	var textCol3 = document.createTextNode(place.formatted_address);
	
	col1.appendChild(textCol1);
	col2.appendChild(textCol2);
	col3.appendChild(textCol3);
	
	row.appendChild(col1);
	row.appendChild(col2);
	row.appendChild(col3);
	
    list.appendChild(row);
	tempIndex++;
}

function removePlacesfromList() {
    var myNode = document.getElementById("places-list");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

google.maps.event.addDomListener(window, 'load', initialize);