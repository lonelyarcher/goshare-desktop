

$(function() {
	
		var pList = [];
		var pos = { x: 40.692954, y: -73.9850253};
		var poi;
		var allLatlng = [];
		var tempMarkerHolder = [];
		
		//Start geolocation
		 
		
	
		//map options
		var mapOptions = {
			zoom: 18,
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
	
		//alert("begin to ajax call " + pos.x + " " + pos.y);
		//Use the zip code and return all market ids in area.
		$.ajax({
			type: "GET",
			contentType: "application/json; charset=utf-8",
			url: "http://mexu1.cloudapp.net:8080/getNearbyPoints2?x="+pos.x+"&y="+pos.y+"&d=10",
			dataType: 'json',
			success: function (data) {
				 //alert("ajax success");
				 $.each(data, function (i, val) {
					 
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
				
				
			},// end of success
		}) //ajax call

        return false; // important: prevent the form from submitting
    });
			
	//add POI
	$('#add').click(function() {
		pos.x = $("#textLongitude").val();
		pos.y = $("#textLatitude").val();
		poi = {"position": pos, "name": $("#textName").val(), "desc": $("#textDesc").val()};
		alert(poi.position.x);
		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://mexu2.cloudapp.net:8080/savePoint",
			dataType: 'json',
			success: function (data) {alert("POI saved");},
			data: JSON.stringify(poi)
		});
	});	
	
	//click get coordinate
	google.maps.event.addListener(map, "click", function(event) {
	    var lat = event.latLng.lat();
	    var lng = event.latLng.lng();
	    // populate yor box/field with lat, lng
	    alert("Lat=" + lat + "; Lng=" + lng);
	    $("#textLongitude").val(lat);
		$("#textLatitude").val(lng);
	    
	});
			
});

