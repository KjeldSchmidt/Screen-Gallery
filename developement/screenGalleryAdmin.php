<?php

$overwiew_link = add_query_arg(array('screenGalleryTab'=>'overview'));
$galleries_link = add_query_arg(array('screenGalleryTab'=>'galleries'));
$tags_link = add_query_arg(array('screenGalleryTab'=>'tags'));
$style_link = add_query_arg(array('screenGalleryTab'=>'style'));

$page = (isset($_GET['screenGalleryTab'])) ? $_GET['screenGalleryTab'] : "overview";

?>

<div class="adminArea">
	<nav class="tabs">
		<div class="navTabs <?php if($page === "overview") echo "active" ?>"><a href="<?php echo $overwiew_link; ?>">Overview</a></div>
		<div class="navTabs <?php if($page === "galleries") echo "active" ?>"><a href="<?php echo $galleries_link; ?>">Galleries</a></div>
		<div class="navTabs <?php if($page === "tags") echo "active" ?>"><a href="<?php echo $tags_link; ?>">Tags</a></div>
		<div class="navTabs <?php if($page === "style") echo "active" ?>"><a href="<?php echo $style_link; ?>">Style</a></div>
	</nav>

	<div class="adminContent">

		<?php include 'admintabs/' . $page . '.php'; ?>
		
	</div>

	

</div>


<?php

wp_register_style('screenGalleryAdminStyle', plugins_url('css/galleryAdminStyles.css', __FILE__));
wp_enqueue_style('screenGalleryAdminStyle');


?>