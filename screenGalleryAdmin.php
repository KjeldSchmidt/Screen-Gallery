<?php

include 'class.adminTab.php';

$tabs = array(
	'Overview',
	'Galleries',
	'Tags',
	'Style'
);

$tabs = new AdminTabs($tabs);

?>

<div class="adminArea">
	<nav class="tabs">
		<?php $tabs->buildTabs(); ?>
	</nav>

	<div class="adminContent">
		<?php $tabs->assignContent(); ?>
	</div>
</div>

<?php

wp_register_style('screenGalleryAdminStyle', plugins_url('css/galleryAdminStyles.css', __FILE__));
wp_enqueue_style('screenGalleryAdminStyle');
	

wp_register_script('galleryAdminScript', plugins_url('js/galleryAdminScript.min.js',  __FILE__));
wp_enqueue_script('galleryAdminScript');
wp_localize_script('galleryAdminScript', 'ajaxdata', array('ajaxurl' => admin_url('admin-ajax.php')));


?>