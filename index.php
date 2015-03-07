
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>V-Sidoカート64〜吉田くんは人工知能に勝てるのか！？</title>
<script src="http://maps.googleapis.com/maps/api/js?sensor=false" type="text/javascript" charset="UTF-8"></script>
<!--script src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true"></script-->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script type ="text/javascript" src="scripts/v3_epoly.js"></script>
<script type ="text/javascript" src="scripts/algorithm.js"></script>
<style>
#game_window{position: relative; width: 900px; height:900px; float: left;}
#speed_meter{position: absolute; background-color: #fff; border: 1px solid black; width: 4.5em; text-align: right; left: 5px; top: 5px; color: #f90; font-weight: bold; z-index: 99;}
#car{position:absolute; left:436px; top:436px; width: 15px; height: 15px; z-index:99; overflow: hidden}
#car img{position: relative;}
#map{width:900px; height:900px; position:relative; left:0; top:0;}
.hidden { display: none; }

table{border-collapse: collapse; margin-left: 3em;}
td, th{border: 1px solid #999;}
th{background-color: yellow;}
#intro_img {position: relative; width: 900px; height:900px; float: left;}
</style>
<meta http-equiv="Cache-control" content="no-cache">
<meta http-equiv="Expires" content="-1">
</head>

<body>
<h1><span>V-Sidoカート64〜吉田くんは人工知能に勝てるのか！？</span></h1> 
<img id="intro_img" src="start_splash.jpg">
<div id="game_window">
<div id="speed_meter"></div>
<div id="car"><img src="car.gif"></div>
<div id="map"></div>
</div>

<div id="game_window">
  <input type="submit" value="Reset Race" onclick="reset();">
  <input type="submit" value="Start Race" onclick="start();">	
  <!--input type="submit" value="Calculate" onclick="calc();"-->  
  <div id="directions_panel" style="margin:20px;background-color:#FFEE77;"></div>
  <audio id="backgroundmusic" src="sounds/Formula_1_sound.mp3" preload="auto"></audio>
  <audio id="intro_music" src="sounds/start_spash.wav" preload="auto"></audio>
  <audio id="bomb" src="sounds/Bomb.mp3" preload="auto"></audio>
</div>

<br style="clear: left;" />

</body>
</html>
