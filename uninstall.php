<?

if (!defined( 'WP_UNINSTALL_PLUGIN'))
	exit();

delete_option('screen_gallery');

global $wpdb;
$table_name = $tables_galleries_name;
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}screengallery_galleries" );
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}screengallery_relation"  );

?>