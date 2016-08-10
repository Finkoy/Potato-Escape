<html>
	<head>
		<title>Potato Escape</title>
		<link rel="stylesheet" href="stylesheet.css">
		<meta http-equiv="cache-control" content="max-age=0" />
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="expires" content="0" />
		<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
		<meta http-equiv="pragma" content="no-cache" />
	</head>
	<body>
		<div id="game_title">
			Potato Escape
		</div>
		<div id="level_count">
		</div>
		<div id="death_count">
		</div>
		<canvas width = "616" height = "556" id = "mazecanvas">Game failed to load. Your browswer does not support HTML5.
		</canvas>

		
		<noscript>
			Javascript is not enabled. Please enable it to play the game.
		</noscript>
		<script src = "node_modules/jquery/dist/jquery.min.js" type = "text/javascript"></script>
		<script src = "player.js" type = "text/javascript"></script>
		<script src = "game.js" type= "text/javascript"></script>
	</body>
</html>

<?php
	$maintenance = 1;
	if($maintenance==1)
	{
		echo "The website is currently under maintenance.";
	}
	else
	{
		echo "The site is functional.";
	}
?>