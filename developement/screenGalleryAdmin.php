<div class="adminArea">
	<nav class="tabs">
		<div class="navTabs"><a href="">Overview</a></div>
		<div class="navTabs"><a href="">Galleries</a></div>
		<div class="navTabs"><a href="">Tags</a></div>
		<div class="navTabs"><a href="">Style</a></div>
	</nav>
	<div class="adminContent">
		<h2>What would you like to do?</h2>
	</div>

	

</div>


<?php

wp_register_style('screenGalleryAdminStyle', plugins_url('css/galleryAdminStyles.css', __FILE__));
wp_enqueue_style('screenGalleryAdminStyle');


?>