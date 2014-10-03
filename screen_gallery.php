<?php 
/*
Plugin Name: Screen Gallery
Plugin URL: http://www.superfluidwebdesign.com/
Description: Gives you acces to a gallery that always fills the page and has tag-based dynamic search.
Author: Kjeld Schmidt
Version: 0.1
Author URL: http://www.superfluidwebdesign.com/
*/

define('AJAXURL', WP_PLUGIN_URL."/".dirname( plugin_basename( __FILE__ ) ) );
define('GALLERY_TABLE', $wpdb->prefix . 'screengallery_galleries');
define('RELATION_TABLE', $wpdb->prefix . 'screengallery_relation');


$options = array(
	'max-height' => 300,
	'ininite' => 'true',
	'min-size' => 100
	);
add_option('screenGallery', $options);
$screenOptions = get_option('screenGallery');


//Adds a gallery when the shortcode is applied.
function gallery(){
	global $screenOptions;
	include('gallery.php');
}


function screenGalleryAdminActions() {
	add_options_page('Screen Gallery', 'Screen Gallery', 'manage_options', __FILE__, 'screenGalleryAdmin');
}
function screenGalleryAdmin(){
	include('screenGalleryAdmin.php');
}










//´´´´´´´´´´´´´´´´´´´´´´´´´´´´´// 
//~~~~ Custom post and tag ~~~~//
//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,//


function add_gallery_tags_taxonomy() {
	$labels = array(
		'name'				=> 'Gallery Tags',
		'singular_name'		=> 'Gallery Tag',
		'search_items'		=> 'Search Gallery Tags',
		'all_items'			=> 'All Gallery Tags',
		'parent_item'		=> 'Parent Gallery Tag',
		'parent_item_colon'	=> 'Parent Gallery Tag:',
		'edit_item'			=> 'Edit Gallery Tag',
		'update_item'		=> 'Update Gallery Tag',
		'add_new_item'		=> 'Add New Gallery Tag',
		'new_item_name'		=> 'New Gallery Tag Name',
		'menu_name'			=> 'Gallery Tag',
	);
 
	$args = array(
		'labels' => $labels,
		'hierarchical' => false,
		'query_var' => 'true',
		'rewrite' => 'true',
		'show_admin_column' => 'true',
	);
 
	register_taxonomy( 'gallery_tags', 'attachment', $args );
}

function gallery_post_type_init() {
	$labels = array(
		'add_new_item'		=> 'Add New Gallery',
		'edit_item'			=> 'Edit Gallery',
		'new_item'			=> 'New Gallery',
		'view_item'			=> 'View Gallery',
		'search_items'		=> 'Search Galleries',
		'not_found'			=> 'No galleries found',
		'not_found_in_trash'=> 'No galleries found in the trash',
		'parent_item_colon'	=> 'Parent Gallery'
	);

	$args = array(
		'public' 		=> true,
		'label'  		=> 'Gallery',
		'labels' 		=> $labels,
		'description' 	=> 'The gallery type for the Screen Gallery Pluging. Not required, but might be handy.',

	);

	register_post_type('gallery', $args);
}










//´´´´´´´´´´´´´´´´´´´´´´´´´´´´´// 
//~~~~~~~~~ AJAX calls ~~~~~~~~//
//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,//



#
#		Frontend
#

function getImageFeed() {
	include('getImages.php');
	$tag = (isset($_POST['tag'])) ? $_POST['tag'] : null;
	$offset = (isset($_POST['offset'])) ? $_POST['offset'] : 0;
	getImages($tag, $offset);
	die();
}





#
#		Backend
#

function addGallery() {
	global $wpdb;
	include_once( 'adminTabs/classes.backend.php' );
	

	$newGallery['name'] = $_POST['name'];
	$newGallery['slug'] = sanitize_title($_POST['name']);
	$newGallery['description'] = $_POST['description'];
	
	$table_name = GALLERY_TABLE;
	
	$wpdb->insert( 
		$table_name, 
		array( 
			'name' => $newGallery['name'],
			'slug' => $newGallery['slug'],
			'description' => $newGallery['description'],
		) 
	);

	$newGallery['id'] = $wpdb->insert_id;
	$newGallery = new Gallery( $newGallery );
	echo $newGallery->buildBackend();


	die();
}



function deleteGallery() {
	global $wpdb;



	$wpdb->delete( GALLERY_TABLE, array( 'id' => $_POST['id'] ) );
	$wpdb->delete( RELATION_TABLE, array( 'galleryid' => $_POST['id'] ) );


	die();
}



function updateGallery() {
	global $wpdb;



	$wpdb->update( 
		GALLERY_TABLE,
		array( 
			'name' => $_POST['name'],
			'description' => $_POST['description']
		),
		array( 'id' => $_POST['id'] )
	);


	die();
}



function getGalleryImages() {
	include_once( 'adminTabs/classes.backend.php' );


	$gallery = GalleryBackendController::galleryById( $_POST['id'] );
	$gallery->getImages();


	die();
}

function saveRelationship() {
	include_once( 'adminTabs/classes.backend.php' );
	global $wpdb;


	$gallery = GalleryBackendController::galleryById( $_POST['galleryId'] );
	$images = $_POST['imageIds'];

	foreach ($images as $key => $value) {
		$gallery->addImage( $value );
	}


	die();
}









//´´´´´´´´´´´´´´´´´´´´´´´´´´´´´// 
//~~~~~ Actions and Hooks ~~~~~//
//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,//

#Basic setup

add_action('admin_menu', 'screenGalleryAdminActions');

add_action('wp_ajax_my_ajax', 'my_ajax');
function my_ajax() {die("Hello World");} 

add_shortcode('screengallery', 'gallery');  
add_action('init', 'add_gallery_tags_taxonomy');
add_action('init', 'gallery_post_type_init');



# Frontend AJAX

add_action('wp_ajax_get_images', 'getImageFeed');
add_action('wp_ajax_nopriv_get_images', 'getImageFeed');



# Backend AJAX

add_action('wp_ajax_addGallery', 'addGallery');
add_action('wp_ajax_deleteGallery', 'deleteGallery');
add_action('wp_ajax_updateGallery', 'updateGallery');
add_action('wp_ajax_getGalleryImages', 'getGalleryImages');
add_action('wp_ajax_saveRelationship', 'saveRelationship');




?>