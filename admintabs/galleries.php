<?php

tables_install();


function tables_install() {
	global $wpdb;
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

	$tables_galleries_name = $wpdb->prefix . 'screengallery_galleries';
	$tables_assigning_name = $wpdb->prefix . 'screengallery_relation';

	# Charset applies to all tables	
	$charset_collate = '';
	if ( ! empty( $wpdb->charset ) ) { $charset_collate = "DEFAULT CHARACTER SET {$wpdb->charset}"; }
	if ( ! empty( $wpdb->collate ) ) { $charset_collate .= " COLLATE {$wpdb->collate}"; }



	# Table containing gallery info
	$table_name = $tables_galleries_name;
	
	$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		name tinytext NOT NULL,
		slug tinytext,
		text text NOT NULL,
		UNIQUE KEY id (id)
	) $charset_collate;";

	dbDelta( $sql );



	# Table assigning images to galleries
	$table_name = $tables_assigning_name;

	$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		imageid mediumint(9) NOT NULL,
		galleryid mediumint(9) NOT NULL,
		UNIQUE KEY id (id)
	) $charset_collate;";

	dbDelta( $sql );
}


?>

<button id="addGalleryButton" class="button button-primary button-large">Add Gallery</button>


<div id="addGallery">
	<form action="" method="post">
		<input type="text" placeholder="Name" name="name">
		<textarea name="text" id="" cols="30" rows="5" placeholder="Description"></textarea>
		<span>
			<button type="submit" class="button button-primary button-large">Save</button>
			<button class="button button-secondary button-large">Cancel</button>
		</span>
	</form>
</div>