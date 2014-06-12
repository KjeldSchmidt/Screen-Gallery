<?php 
/*
Plugin Name: Screen Gallery
Plugin URL: http://www.isabel-schmiedel.com/
Description: Gives you acces to a gallery that always fills the page and has tag-based dynamic search.
Author: Kjeld Schmidt
Version: 0.1
Author URL: http://www.isabel-schmiedel.com/
*/

//Define ajax-path
define('AJAXURL', WP_PLUGIN_URL."/".dirname( plugin_basename( __FILE__ ) ) );

//Sets or gets options
$options = array(
	'max-height' => 300,
	'ininite' => 'true',
	'min-size' => 100
	);
add_option('screen_gallery', $options);

$screenOptions = get_option('screen_gallery');



//Adds a gallery when the shortcode is applied.
add_shortcode( 'screengallery', 'gallery');
function gallery(){
	global $screenOptions;
	include('gallery.php');
}



// Adds the admin menu
add_action('admin_menu', 'screen_admin_actions');
function screen_admin_actions() {
	add_options_page('Screen Gallery', 'Screen Gallery', 'manage_options', __FILE__, 'screen_admin');
}

function screen_admin(){
	include('screen_gallery_admin.php');
}



//Adds the galllery-tag-taxonomy for filtering
add_action( 'init', 'add_gallery_tags_taxonomy');
function add_gallery_tags_taxonomy() {
    $labels = array(
        'name'              => 'Gallery Tags',
        'singular_name'     => 'Gallery Tag',
        'search_items'      => 'Search Gallery Tags',
        'all_items'         => 'All Gallery Tags',
        'parent_item'       => 'Parent Gallery Tag',
        'parent_item_colon' => 'Parent Gallery Tag:',
        'edit_item'         => 'Edit Gallery Tag',
        'update_item'       => 'Update Gallery Tag',
        'add_new_item'      => 'Add New Gallery Tag',
        'new_item_name'     => 'New Gallery Tag Name',
        'menu_name'         => 'Gallery Tag',
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



//Ajax




add_action( 'wp_ajax_my_ajax', 'my_ajax' );
add_action('wp_ajax_get_images', 'get_image_feed');
add_action('wp_ajax_nopriv_get_images', 'get_image_feed');

function my_ajax() {
	die( "Hello World" );
}

function get_image_feed() {
	include('getImages.php');
	$tag = (isset($_POST['tag'])) ? $_POST['tag'] : null;
	$offset = (isset($_POST['offset'])) ? $_POST['offset'] : 0;
	getImages($tag, $offset);
	die();
}

?>