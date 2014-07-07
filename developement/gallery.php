<?php
wp_register_style('screenGalleryStyle', plugins_url('css/galleryStyles.css', __FILE__));
wp_enqueue_style('screenGalleryStyle');

wp_register_script('screenGalleryScript', plugins_url('js/screenGallery.js',  __FILE__));
wp_enqueue_script('screenGalleryScript');
wp_localize_script('screenGalleryScript', 'ajaxdata', array('ajaxurl' => admin_url('admin-ajax.php')));




?>

<div class="galleryWrapper">
	<div class="galleryBuffer">
		<span id='maxHeight' class='hidden'>
			<?php echo $screenOptions['max-height'] ?>
		</span>
		<?php include('getImages.php'); getImages(); ?>

	</div>
	<div class="gallery">
		
	</div>
	<div class="galleryEnd"></div>
</div>