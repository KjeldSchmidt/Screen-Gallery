<?php 
	$myterms = get_terms('gallery_tags', 'orderby=none&hide_empty');
?>

<?php foreach ($myterms as $key => $value) { ?>

	<div class="galleryPreview">
		<h3>
			<?php echo $value->name; ?>	
		</h3>
		
	</div>

<?php } ?>