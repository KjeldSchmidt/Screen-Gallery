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

	?> Attempting to install_tables . . . <?php

	#Table containing gallery info
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

function jal_install_data() {
	global $wpdb;
	
	$welcome_name = 'Mr. WordPres';
	$welcome_text = 'Congratulations, you just completed the installation!';
	
	$table_name = $wpdb->prefix . 'liveshoutbox';
	
	$wpdb->insert( 
		$table_name, 
		array( 
			'time' => current_time( 'mysql' ), 
			'name' => $welcome_name, 
			'text' => $welcome_text, 
		) 
	);
}