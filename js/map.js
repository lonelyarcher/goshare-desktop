/* Pull local Farers market data from the USDA API and display on 
** Google Maps using GeoLocation or user input zip code. By Paul Dessert
** www.pauldessert.com | www.seedtip.com
*/

$(function() {
	
		var pList = [];
		var pos = { x: 40.69375, y: -73.987936};
		var poi;
		var allLatlng = [];
		var tempMarkerHolder = [];
		
		//Start geolocation
		 
		
	
		//map options
		var mapOptions = {
			zoom: 15,
			center: new google.maps.LatLng(pos.x,pos.y),
			panControl: false,
			panControlOptions: {
				position: google.maps.ControlPosition.BOTTOM_LEFT
			},
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			scaleControl: false

		};
	
	//Adding infowindow option
	infowindow = new google.maps.InfoWindow({
		content: "holding..."
	});
	
	//Fire up Google maps and place inside the map-canvas div
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	//search nearby
    $('#search').click(function() { // bind function to click search nearby by
		
		
		pos.x = $("#textLongitude").val();
		pos.y = $("#textLatitude").val();
		var filter = {p1:pos, distince:1};
		alert("begin to ajax call " + pos.x + " " + pos.y);
		//Use the zip code and return all market ids in area.
		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://mexu.cloudapp.net:8080/getNearbyPoints",
			dataType: 'json',
			success: function (data) {
				 alert("ajax success");
				 $.each(data.results, function (i, val) {
					 
					 var myLatlng = new google.maps.LatLng(val.position.x,val.position.y);
					 var marker = new google.maps.Marker({
							position: myLatlng,
							map: map,
							title: val.name,
							html: 
									'<div class="markerPop">' +
									'<h1>' + val.name + '</h1>' + 
									'<h3>' + val.desc + '</h3>' +
									'</div>'
						});

						//put all lat long in array
						allLatlng.push(myLatlng);
						
						//Put the marketrs in an array
						tempMarkerHolder.push(marker); 
						pList.push(val);
						
						google.maps.event.addListener(marker, 'click', function () {
							infowindow.setContent(this.html);
							infowindow.open(map, this);
						});
						
				 }); //end of each
				
				//console.log(allLatlng);
				//  Make an array of the LatLng's of the markers you want to show
				//  Create a new viewpoint bound
				var bounds = new google.maps.LatLngBounds ();
				//  Go through each...
				for (var i = 0, LtLgLen = allLatlng.length; i < LtLgLen; i++) {
				  //  And increase the bounds to take this point
				  bounds.extend (allLatlng[i]);
				}
				//  Fit these bounds to the map
				map.fitBounds (bounds);
			},// end of success
			data: filter
		}) //ajax call

        return false; // important: prevent the form from submitting
    });
			
	//add POI
	$('#add').click(function() {
		pos.x = $("#textLongitude").val();
		pos.y = $("#textLatitude").val();
		poi = {position: pos, name: $("#textName").val(), desc: $("#textDesc").val()};
		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://0.0.0.0:32787/savePoint",
			dataType: 'json',
			success: function (data) {},
			data: pos
		});
	});		
			
});

