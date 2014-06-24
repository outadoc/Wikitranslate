<?php
	
	$title 	= urlencode($_GET['title']);
	$srcln 	= urlencode($_GET['srcln']);
	$destln = urlencode($_GET['destln']);

	ini_set('user_agent', "Wikitranslate/1.0 (http://wikitranslate.outadoc.fr/; contact@dev.outadoc.fr)");
	echo file_get_contents("https://" . $srcln . ".wikipedia.org/w/api.php?action=query&format=json&prop=langlinks&titles=" . $title . "&llprop=langname&llinlanguagecode=en&lllang=" . $destln);

?>