<button id="addGalleryButton" class="button button-primary button-large">Add Gallery</button>




<!--
Is shown when #addGalleryButton is pressed.
-->
<div id="addGallery" class="hiddenWidget editingWidget">
	<input type="text" placeholder="Name" name="name">
	<textarea name="description" cols="30" rows="5" placeholder="Description"></textarea>
	<span>
		<button type="submit" class="button button-primary button-large">Save</button>
		<button class="button button-secondary button-large" name="cancel">Cancel</button>
	</span>
</div>




<!--
Is shown when a galleries edit-button is pressed.
Name and description are automatically filled, all images assigned to the gallery are shown in .imageContainer
-->
<div id="editGallery" class="hiddenWidget editingWidget">
	<span>
		<button type="submit" class="button button-primary button-large">Save</button>
		<button class="button button-secondary button-large" name="cancel">Cancel</button>
		<button class="button button-secondary button-large" name="delete">Delete</button>
	</span>


	<img src="" alt="">
	<input type="text" placeholder="Name" name="name">
	<textarea name="description" cols="30" rows="5" placeholder="Description"></textarea>
</div>





<!--
Gets inserted into both addGallery and editGallery
-->
<div id="imageSelectionWidget" class="hiddenWidget">
	<h3>
		Drang and drop images to create your gallery!
	</h3>
	<div class="galleryImagesContainer">
		<h3>
			This is your gallery.
		</h3>
	</div>

	<div class="allImagesContainer">
		<h3>
			All images.
		</h3>
	</div>
</div>










<?php

tables_install();


function tables_install() {
	global $wpdb;
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

	# Charset applies to all tables	
	$charset_collate = '';
	if ( ! empty( $wpdb->charset ) ) { $charset_collate = "DEFAULT CHARACTER SET {$wpdb->charset}"; }
	if ( ! empty( $wpdb->collate ) ) { $charset_collate .= " COLLATE {$wpdb->collate}"; }



	# Table containing gallery info
	$table_name = GALLERY_TABLE;
	
	$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		name tinytext NOT NULL,
		slug tinytext NOT NULL,
		description text,
		UNIQUE KEY id (id)
	) $charset_collate;";

	dbDelta( $sql );



	# Table relating images to galleries
	$table_name = RELATION_TABLE;

	$sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		imageid mediumint(9) NOT NULL,
		galleryid mediumint(9) NOT NULL,
		sequence mediumint(9) NOT NULL,
		UNIQUE KEY id (id)
	) $charset_collate;";

	dbDelta( $sql );
}

function getGalleries( $offset=0 ) {
	global $wpdb;

	$table_name = GALLERY_TABLE;

	$galleries = $wpdb->get_results(
		"SELECT id, name, slug, description
		FROM $table_name
		ORDER BY name ASC"
	); 

	?> 

	<div class="galleryEditors"> 
		<?php
			foreach ( $galleries as $gallery ) {
				$gallery = new Gallery($gallery);
				$gallery->buildBackend();
			}
		?> 
	</div> 

	<?php
}

getGalleries();

?>