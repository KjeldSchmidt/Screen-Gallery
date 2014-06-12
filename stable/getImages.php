<?php


function getImages($tag=null, $offset=0) {
	//Reads out all existing gallery tags. Neccesarry because WP doesn't have a direct function to get only posts where a taxonomy is set.
	$myterms = get_terms('gallery_tags', 'orderby=none&hide_empty');
	$tags = array();

	if (is_null($tag)){
		foreach ($myterms as $key => $value) {
			$tags[] = $value->name;
		}
	} else {
		foreach ($tag as $key => $value) {
			$tags[] = $value->name;
		}
	}

	//Requests any images containing the terms
	$args = array( 
				'post_type' => 'attachment',
				'posts_per_page' => 10,
				'offset' => $offset,
				'post_status' => 'any',
				'tax_query' => array(
					array(
						'taxonomy' => 'gallery_tags',
						'field' => 'slug',
						'terms' => $tags
					)
				)
			);



	$attachments = new WP_Query( $args );
	if ($attachments->have_posts()) {

		while ($attachments->have_posts()) {

				$attachments->the_post();
				the_attachment_link($post->ID, true, false);

		}

		wp_reset_postdata();

	}
}

?>
