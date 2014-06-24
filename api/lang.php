<?php
	
	define('CACHE_DIRECTORY', 'cache/');
	define('CACHE_DURATION', 24 * 60 * 60);

	$response;

	if(getCache("lang", $response)) {
		echo $response;
	} else {
		ini_set('user_agent', "Wikitranslate/1.0 (http://wikitranslate.outadoc.fr/; contact@dev.outadoc.fr)");
		$response = file_get_contents("https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=languages&siinlanguagecode=en&format=json");
		saveCache("lang", $response);
		echo $response;
	}
	
	/**
	 * Saves a JSON response to a file.
	 * 
	 * @param string $category The name of the cache file.
	 */
	function saveCache($category, $content) {
		file_put_contents(CACHE_DIRECTORY . $category, $content);
	}

	/**
	 * Returns the content of a cache file if available and relevant.
	 * 
	 * @param string $category The name of the cache file.
	 * @param string &$content The variable in which the cache will be saved if available.
	 * @return boolean True if and only if the cache is retrievable.
	 */
	function getCache($category, &$content) {
		$category = str_replace("/", "", $category);

		if(!file_exists(CACHE_DIRECTORY . $category) 
			|| (filemtime(CACHE_DIRECTORY . $category) + CACHE_DURATION) < date_timestamp_get(date_create())) {
			return false;
		} else {
			$content = stripslashes(file_get_contents(CACHE_DIRECTORY . $category));
			return true;
		}
	}

?>