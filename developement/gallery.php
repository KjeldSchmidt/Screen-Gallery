<?php

//extract(shortcode_atts( array('tag' => null, 'open_search' = true, 'search' = true;), $atts ) );

wp_register_style('screen-gallery-style', plugins_url('css/gallery-styles.css', __FILE__));
wp_enqueue_style('screen-gallery-style');

wp_register_script('screen-gallery-script', plugins_url('js/screen-gallery.js',  __FILE__));
wp_enqueue_script('screen-gallery-script');
wp_localize_script( 'screen-gallery-script', 'ajaxdata', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );

echo 	"<div class='hide'>
			<span id='maxHeight'>". $screenOptions['max-height'] ."</span>
		</div>";


?>

<div class="gallery-wrapper">
	<input type="text" id="gallery-tag-search">
	<div class="gallery-buffer">

	<?php include('getImages.php'); getImages(); ?>

	</div>
	<div class="gallery">
	
	</div>
	<div class="gallery-end"></div>
</div>