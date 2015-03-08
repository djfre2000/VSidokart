window.onload = onloadHandler;
document.onkeydown = onkeydownHandler;
document.onkeyup = onkeyupHandler;
window.setTimeout("$('#game_window').addClass('hidden');",400);


setInterval(function(){
    $.ajax({ url: "http://210.140.160.255/", success: function(data){
		//update player status
//		alert('ok');
//		timer();
		console.log('test: '+data.value);

        //salesGauge.setValue(data.value);
    }, dataType: "json"});
}, 1000);


// ROBOT
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var checkpoints = 0;
var status;
var robot_wins = 0;
var yoshida_wins = 0;

var map = null;
//map_x [-90~90] map_y [-180~180]
// PLAYER
var map_x = 139.729774, map_y = 35.665246;
//var map_x = 136.54028131980896, map_y = 34.84339127807875;
var myLatlng = new google.maps.LatLng(map_y,map_x);

var flagLatlng = new google.maps.LatLng(35.664297, 139.731150);

var accelerating = false;
var key_left = false;
var key_right = false;
var velocity = 0;
var max_velocity = 0.000020;
var angle = 308;
var geocoder = null;
var flagMarker = undefined;

// ROBOT
var map2_x = 139.729823, map2_y = 35.665371;
var robotLatlng = new google.maps.LatLng(map2_y,map2_x);
var robotMarker = undefined;
var accelerating2 = false;
var key_left2 = false;
var key_right2 = false;
var velocity2 = 0;
var max_velocity2 = 0.000020;
var angle2 = 308;
var geocoder2 = null;

function onloadHandler()
{
	// PLAYER MAP
	map = new google.maps.Map(document.getElementById("map"), {
		draggable: false,
		disableDoubleClickZoom: true,
		keyboardShortcuts: false,
		streetViewControl: false,
		panControl: false,
		zoomControl: false,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 17
	});

	//ROBOT
    robotMarker = new google.maps.Marker({
		position: robotLatlng, 
		icon: 'robot1.png',
		map: map
	});

    //robotMarker.setMap( map );	
	
	// FLAG
    flagMarker = new google.maps.Marker({
        position: flagLatlng,
        map: map,
        icon: 'checkeredflag.gif'
	});
  
    //ROUTE
    //directionsDisplay = new google.maps.DirectionsRenderer();
    //directionsDisplay.setMap(map);
  
    // refresh map
	timer();
	
	//ROBOT 
	initialize();
	//window.setTimeout("$('#game_window').addClass('hidden');",180);
	//calcRoute();

	// MUSIC
	//play_backgroundsound();
	play_introsound();
}

  
  
// PLAYER HANDLER
function onkeydownHandler(e){return keyHandler(e, true);}
function onkeyupHandler(e){return keyHandler(e, false);}

function keyHandler(e, flag)
{
	var evt = e ? e : window.event;
	var elm = evt.target || evt.srcElement;
	var keyCode = evt.keyCode ? evt.keyCode : evt.which;

	switch(keyCode)
	{
		// 32: space, 37:left, 39:right
		case 32: accelerating = flag; break;
		case 37: key_left = flag; break;
		case 39: key_right = flag; break;
		default: return true;
	}
	return false;
}


// PLAYER REFRESH
function timer()
{
	if(!map) return;
	// refresh map every 20 milliseconds
	window.setTimeout("timer();", 20);

	var prev_v = velocity;
	velocity += (accelerating ? 2 : -2) * 0.0000001;
	velocity = velocity < 0 ? 0 : velocity > max_velocity ? max_velocity : velocity;
	if(prev_v == max_velocity && velocity == max_velocity) velocity = max_velocity - 0.0000001; // Topspeed fluctuation

	if(velocity != 0)
	{
		angle += (key_right ? 1 : key_left ? -1 : 0) * (accelerating + 1) * (max_velocity * 4 - velocity * 3) / max_velocity;
		angle = (angle >= 360 ? angle - 360 : angle <= 0 ? angle + 360 : angle);
        // Move the Map
		map_x += velocity * Math.sin(angle * 3.14 / 180);
		map_y += velocity * Math.cos(angle * 3.14 / 180);
		map.setCenter(new google.maps.LatLng(map_y, map_x));
	}

	var icon = Math.round(angle / 15) * -15;
	icon = (icon <= -360 ? 0 : icon);
	//document.getElementById("car").childNodes[0].style.top = icon + "px";

	var km = Math.round(velocity * 8200000) + "km/h";
	var elm = document.getElementById("speed_meter");
	if(elm.innerHTML != km)
		elm.innerHTML = km;	

    // first checkpoint AOYAMA station
	if (((map_y - 35.668978) > 0.0036 ) && ((map_x - 139.716112) < 0.0082) && (checkpoints == 0))
	 {  
	//alert('Checkpoint 1! -> '+checkpoints);
	checkpoints += checkpoints + 1;
	}	
	
    // second checkpoint
	if (((map_y - 35.672839) > -0.004 ) &&  ((map_x - 139.716112) <  0.0003) && (checkpoints == 1))
	 {  

	//alert('Checkpoint 2! -> '+(map_x - 139.716112));
	checkpoints = 2;
	}	
	
    // third checkpoint
	if (((map_y - 35.659904) < 0.0001 ) &&  ((map_x - 139.723479) <  0.0002) && (checkpoints == 2))
	 {  
	//alert('Checkpoint 3! -> '+(map_y - 35.659904));
	checkpoints = 3;
	}	
	
    // fourth checkpoint    // -0.00018
	if (((map_y - 35.662754) < -0.00010 ) &&  ((map_x - 139.731054) >  -0.00028) && (checkpoints == 3))
	 {  
	//alert('Checkpoint 4! -> '+(map_x - 139.731054));
	checkpoints = 4;
	}	
	
	//finish   < 0.00001
	if (((map_y - 35.664297) > -0.0001 ) && ((map_x - 139.731150) >  0.000028) && (checkpoints == 4))
	 {  
	 checkpoints = 5;
	//alert('Finish! -> '+(map_x - 139.731150));
	if (robot_wins == 0) {yoshida_wins = 1;}
	goal();
	}	
	
	// reset 
	//reset();	
}

function calc(){
  alert('Position! -> '+(map_y - 35.662754));
  //alert('checkpoints: '+checkpoints);  
}



///////////////////////////////////////////////////////////////////////////////////////////////////// ROBOT
  
 // var map;
  var directionDisplay;
  //var directionsService;
  var stepDisplay;
  var markerArray = [];
  var position;
  var marker = null;
  var polyline = null;
  var poly2 = null;
  var speed = 0.000005, wait = 1;
  var infowindow = null;
  
    var myPano;   
    var panoClient;
    var nextPanoId;
  var timerHandle = null;

function createMarker(latlng, label, html) {
    var contentString = '<b>'+label+'</b><br>'+html;
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: label,
		icon: 'robot2.png',
        zIndex: Math.round(latlng.lat()*-100000)<<5
        });
        marker.myname = label;

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString); 
        infowindow.open(map,marker);
        });
    return marker;
}


function initialize() {
  infowindow = new google.maps.InfoWindow(
    { 
      size: new google.maps.Size(150,50)
    });
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService();
    
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map
    }
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    
    // Instantiate an info window to hold step text.
    stepDisplay = new google.maps.InfoWindow();

    polyline = new google.maps.Polyline({
	path: [],
	strokeColor: '#FF0000',
	strokeWeight: 3
    });
    poly2 = new google.maps.Polyline({
	path: [],
	strokeColor: '#FF0000',
	strokeWeight: 3
    });
	
	status = 'New';
  }
  
	var steps = []

function calcRoute(){

	if (timerHandle) { clearTimeout(timerHandle); }
	if (marker) { marker.setMap(null);}
	polyline.setMap(null);
	poly2.setMap(null);
	directionsDisplay.setMap(null);
    polyline = new google.maps.Polyline({
		path: [],
		strokeColor: '#FF0000',
		strokeWeight: 3
    });
    poly2 = new google.maps.Polyline({
		path: [],
		strokeColor: '#FF0000',
		strokeWeight: 3
    });
    // Create a renderer for directions and bind it to the map.
    var rendererOptions = {
      map: map
    }
directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        
		//var flagLatlng = new google.maps.LatLng(35.665493, 139.729855)
		var travelMode = google.maps.DirectionsTravelMode.DRIVING

		var waypts = [{location:"Aoyama Itchome Station, Tokio",stopover:true}, 
		              {location:"35.668978, 139.716112",stopover:true},
					  {location:"35.659904, 139.723479",stopover:true},   
					  {location:"35.662754, 139.731054",stopover:true},  //roppongi
					  ]			  

	    var request = {
	        origin: robotLatlng,
	        destination: flagLatlng,
			waypoints: waypts,
			optimizeWaypoints: true,
	        travelMode: google.maps.TravelMode.DRIVING
	    };

		// Route the directions and pass the response to a
		// function to create markers for each step.
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK){
	directionsDisplay.setDirections(response);

        var bounds = new google.maps.LatLngBounds();
        var route = response.routes[0];
        startLocation = new Object();
        endLocation = new Object();

        // For each route, display summary information.
	var path = response.routes[0].overview_path;
	var legs = response.routes[0].legs;
        for (i=0;i<legs.length;i++) {
          if (i == 0) { 
            startLocation.latlng = legs[i].start_location;
            startLocation.address = legs[i].start_address;
            // marker = google.maps.Marker({map:map,position: startLocation.latlng});
            marker = createMarker(legs[i].start_location,"start",legs[i].start_address,"green");
          }
          endLocation.latlng = legs[i].end_location;
          endLocation.address = legs[i].end_address;
          var steps = legs[i].steps;
          for (j=0;j<steps.length;j++) {
            var nextSegment = steps[j].path;
            for (k=0;k<nextSegment.length;k++) {
              polyline.getPath().push(nextSegment[k]);
              bounds.extend(nextSegment[k]);

            }
          }
        }

        polyline.setMap(map);
		
        map.fitBounds(bounds);

        // Zoomfix after fitBounds
		var listener = google.maps.event.addListener(map, "idle", function() { 
		  if (map.getZoom() != 17) map.setCenter(myLatlng); map.setZoom(17); 
		  google.maps.event.removeListener(listener); 
		});
		
		// Start moving the Robot!
		startAnimation();
		status = 'Active';
		
		//remove Robot marker
		robotMarker.setMap(null);
    }                                                    
 });
}
  

      // ROBOT SETTINGS
      var step = 1; // 5; // metres
      var tick = 10; // milliseconds
      var eol;
      var k=0;
      var stepnum=0;
      var speed = "";
      var lastVertex = 1;
	  var p;


//=============== animation functions ======================
      function updatePoly(d) {
        // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
        if (poly2.getPath().getLength() > 20) {
          poly2=new google.maps.Polyline([polyline.getPath().getAt(lastVertex-1)]);
          // map.addOverlay(poly2)
        }

        if (polyline.GetIndexAtDistance(d) < lastVertex+2) {
           if (poly2.getPath().getLength()>1) {
             poly2.getPath().removeAt(poly2.getPath().getLength()-1)
           }
           poly2.getPath().insertAt(poly2.getPath().getLength(),polyline.GetPointAtDistance(d));
        } else {
          poly2.getPath().insertAt(poly2.getPath().getLength(),endLocation.latlng);
        }
      }


      function animate(d) {
// alert("animate("+d+")");
        if (d>eol) {
          //map.panTo(endLocation.latlng);
          marker.setPosition(endLocation.latlng);
		  if (yoshida_wins == 0){robot_wins = 1; goal();}
			
          return;
        }
        p = polyline.GetPointAtDistance(d);
        //map.panTo(p);
        marker.setPosition(p);
        updatePoly(d);
        timerHandle = setTimeout("animate("+(d+step)+")", tick);
      }


function startAnimation() {
        eol=polyline.Distance();
        //map.setCenter(polyline.getPath().getAt(0));

        poly2 = new google.maps.Polyline({path: [polyline.getPath().getAt(0)], strokeColor:"#0000FF", strokeWeight:10});
        // map.addOverlay(poly2);
        setTimeout("animate(10)",2000);  // Allow time for the initial map display
}

///////////////// WEBSERVICES API

function reset(){
location.reload();
}

function start(){
calcRoute();
}

function updateyoshida(lat,lon,dir,flags){
timer()
}

//I call when Yoshida was goal
function goal(){
  var winner_name;
  if (yoshida_wins == 1){
    winner_name = 'Yoshida';
  } else {
    winner_name = 'Robot';}
  
  status = 'Finished';
  //alert('Goal! '+winner_name+' wins!');
  play_bomb();

}
/*
function HondaGetRoute(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "..", true);
	xhr.onload = function (e) {
	  if (xhr.readyState === 4) {
		if (xhr.status === 200) {
		  console.log(xhr.responseText);
		} else {
		  console.error(xhr.statusText);
		}
	  }
	};
	xhr.onerror = function (e) {
	  console.error(xhr.statusText);
	};
	xhr.send(null);
}*/

/* Return JSON
-Yoshida current position, orientation 
-flag remains 
-the current position of the robot, the orientation 
-game state (???????????) 
*/
function getposition(){
//return new google.maps.LatLng(map_y, map_x);
//return (4 - checkpoints);
//return p
//return status
  var obj = new Object();
   obj.YoshidaLatLng = new google.maps.LatLng(map_y, map_x);
   obj.flagsRemaining  = (4 - checkpoints);
   obj.RobotLantLng = p;
   obj.Status = status;
   var jsonString= JSON.stringify(obj);
   //alert('Result: '+jsonString);
   
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "210.140.160.255:22", true);
	xhr.onload = function (e) {
	  if (xhr.readyState === 4) {
		if (xhr.status === 200) {
		  console.log(xhr.responseText);
		} else {
		  console.error(xhr.statusText);
		}
	  }
	};
	xhr.onerror = function (e) {
	  console.error(xhr.statusText);
	};
	xhr.send(jsonString);  
 }


function play_backgroundsound() {
	document.getElementById('backgroundmusic').play();
}

function play_introsound(){
  	window.setTimeout("document.getElementById('intro_music').play();", 3000); 
	window.setTimeout("$('#game_window').removeClass('hidden');",6000);
	window.setTimeout("$('#intro_img').addClass('hidden');",6000);
}

function play_bomb(){
  document.getElementById('bomb').play();
}