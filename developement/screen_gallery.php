<?php 
/*
Plugin Name: Screen Gallery
Plugin URL: http://www.isabel-schmiedel.com/
Description: Gives you acces to a gallery that always fills the page and has tag-based dynamic search.
Author: Kjeld Schmidt
Version: 0.1
Author URL: http://www.superfluidmercury.com/
*/

define('AJAXURL', WP_PLUGIN_URL."/".dirname( plugin_basename( __FILE__ ) ) );


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



//Tags are used for dynamic filtering.
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



function getImageFeed() {
	include('getImages.php');
	$tag = (isset($_POST['tag'])) ? $_POST['tag'] : null;
	$offset = (isset($_POST['offset'])) ? $_POST['offset'] : 0;
	getImages($tag, $offset);
	die(); //Seems unneccessary, check later.
}



//~~~~~ Actions and Hooks ~~~~~//

add_shortcode('screengallery', 'gallery');  

add_action('wp_ajax_my_ajax', 'my_ajax');
function my_ajax() {die("Hello World");} //Required by Wordpress

add_action('wp_ajax_get_images', 'getImageFeed');
add_action('wp_ajax_nopriv_get_images', 'getImageFeed');

add_action('init', 'add_gallery_tags_taxonomy');
add_action('init', 'gallery_post_type_init');

add_action('admin_menu', 'screenGalleryAdminActions');



?>