var allMarkers = [];

function createMarker(pos) {
    var marker = new google.maps.Marker({
        map: map,
        position: pos,
        clickable: true
    });

    //marker.info = new google.maps.InfoWindow({
    //	content: '<div><strong>' + place.name + '</strong><br>' +
    //		place.vicinity
    //});
    //google.maps.event.addListener(marker, 'click', function() {
    //	marker.info.open(map, marker);
    //});
    allMarkers.push(marker);
}

function clearMarkers() {
	infoWindow.close();
	for (var i = 0; i < allMarkers.length; i++) {
		allMarkers[i].setMap(null);
	}
	allMarkers = [];
	removePlacesfromList();
}

function find_closest_marker(lat1, lon1) {
    var pi = Math.PI;
    var R = 6371;
    var distances = [];
    var closest = -1;
    for (i = 0; i < allMarkers.length; i++) {
        var lat2 = allMarkers[i].position.lat();
        var lon2 = allMarkers[i].position.lng();

        var chLat = lat2 - lat1;
        var chLon = lon2 - lon1;
        var dLat = chLat * (pi / 180);
        var dLon = chLon * (pi / 180);

        var rLat1 = lat1 * (pi / 180);
        var rLat2 = lat2 * (pi / 180);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        distances[i] = d;
        if (closest == -1 || d < distances[closest]) {
            closest = i;
        }
    }
    return closest;
}