<?php

global $wpdb;

$images = $wpdb->get_results(
	"
	SELECT ID, post_content, post_title, guid AS url
	FROM $wpdb->posts
	WHERE post_mime_type LIKE 'image%'
	"
);

foreach ( $images as $image ) {
	$image = new Image($image);
	$image->build_backend();
}

?>