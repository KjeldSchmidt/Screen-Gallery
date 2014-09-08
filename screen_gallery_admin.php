
<h2>Set up your Gallery</h2>

<?php

$myterms = get_terms('gallery_tags', 'orderby=none&hide_empty');
$tags = array();
foreach ($myterms as $key => $value) {
	$tags[] = $value->name;
}


$args = array( 
			'post_type' => 'attachment',
			'posts_per_page' => 30,
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

	
	echo 	"<form method='post'>
				<p class='submit'>
					<input id='submit' class='button button-primary' type='submit' value='Save Changes' name='submit'>
				</p>
				<table>";
		
				while ($attachments->have_posts()) {

					echo "<tr><td>";

						$attachments->the_post();
						the_attachment_link( $post->ID, false );

					echo "</td><td>
						<input name='tags-".get_the_ID()."' type='text'>";

						foreach (wp_get_post_terms(get_the_ID(), "gallery_tags") as $key => $value) {
						 	echo "<br>".$value->name;
						}

					echo "</td></tr>";
				}

	echo 		"</table>
				<p class='submit'>
					<input id='submit' class='button button-primary' type='submit' value='Save Changes' name='submit'>
				</p>
			</form>";


	wp_reset_postdata();
} else {
	echo "empty";
}
?>