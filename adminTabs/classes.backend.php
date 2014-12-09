<?php

class GalleryBackendController {

	
	function __construct( ) {
		
	}


	public static function getImageAttachments( $showButtons=true, $offset=0, $limit=20 ) {
		global $wpdb;


		$images = $wpdb->get_results(
			"SELECT ID, post_content, post_title, guid AS url
			FROM $wpdb->posts
			WHERE post_mime_type LIKE 'image%'
			LIMIT $offset, $limit
			"
		);

		foreach ( $images as $image ) {
			$image = new GalleryImage($image);
			$image->buildBackend( $showButtons );
		}
	}


	public static function galleryById( $id ) {
		global $wpdb;


		if ( isset ( $id ) ) {

			$table_name = GALLERY_TABLE;
			$gallery = $wpdb->get_results(
				"SELECT id, name, slug, description
				FROM $table_name
				WHERE id = $id"
			); 

			foreach ($gallery as $gallery) {
				return new Gallery( $gallery );
			}

		} else {

			die ( "ID is required to get a gallery" );

		}
	}


	public static function imageById( $id ) {
		global $wpdb;


		if ( isset ( $id ) ) {

			$image = $wpdb->get_results(
				"SELECT ID, post_content, post_title, guid AS url
				FROM $wpdb->posts
				WHERE ID = $id"
			);

			foreach ($image as $image) {
				return new GalleryImage( $image );
			}

		} else {

			die ( "ID is required to get an image" );

		}
	}
}










class GalleryImage {

	private $id;
	private $url;
	private $title;
	private $description;





	function __construct($image_object) {
		$this->id = $image_object->ID;
		$this->url = $image_object->url;
		$this->title = $image_object->post_title;
		$this->description = $image_object->post_content;
	}


	function buildBackend( $showButtons ) { ?>
		<div class="imageEditor" data-id="<?php echo $this->id ?>">
			<h3><?php echo $this->title ?></h3>
			<p><?php echo $this->description ?></p>
			<img src="<?php echo $this->url ?>" alt="" width="200">
			<br>
			<?php if ($showButtons) { ?>
				<button class="button button-primary button-large" name="addToGallery">Add to Gallery</button>
				<button class="button button-secondary button-large">Edit</button>	
			<?php } ?>
		</div>
	<?php }
}










class Gallery {



	private $id;
	private $slug;
	private $title;
	private $description;
	private $title_image_url;
	private $hasImages = false;





	function __construct( $gallery_object ) {
		
		if ( is_object( $gallery_object ) ) {

			$this->id = $gallery_object->id;
			$this->slug = $gallery_object->slug;
			$this->title = $gallery_object->name;
			$this->description = $gallery_object->description;
			
		} 
		
		else if ( is_array( $gallery_object ) ) {

			$this->id = $gallery_object['id'];
			$this->slug = $gallery_object['slug'];
			$this->title = $gallery_object['name'];
			$this->description = $gallery_object['description'];

		}
		
	}


	function buildBackend() { ?>
		<div class="galleryEditor" data-id="<?php echo $this->id; ?>">
			<img src="<?php echo $this->title_image_url ?>" alt="" height="200">
			<h3>
				<?php echo $this->title ?>
			</h3>
			<p>
				<?php echo $this->description ?>
			</p>
			<button class="button button-primary button-large" name="shortcode">Get Shortocde</button>
			<button class="button button-secondary button-large" name="edit">Edit</button>
		</div> <?php
	}


	function getImages() {
		global $wpdb;


		$table_name = RELATION_TABLE;
		$galleryId = $this->id;

		$images = $wpdb->get_results(
			"SELECT posts.ID as id
			FROM $wpdb->posts posts INNER JOIN $table_name relation on posts.ID = relation.imageid
			WHERE galleryid = $galleryId
			ORDER BY sequence ASC"
		);

		foreach ($images as $key => $value) {
			$image = GalleryBackendController::imageById( $value->id );
			$image->buildBackend( false );
		}
	}



	function addImage( $imageId, $sequence = null ) {
		global $wpdb;

		$table_name = RELATION_TABLE;

		if ($sequence === null) {
			$sequence = $wpdb->get_var(
				"SELECT sequence
				FROM $table_name
				ORDER BY sequence DESC"
			);
		}

		$wpdb->insert(
			RELATION_TABLE,
			array(
				'imageid' => $imageId,
				'galleryid' => $this->id,
				'sequence' => $sequence
			),
			array( '%d', '%d', '%d' )
		);
	}


	function removeImage( $imageId ) {
		global $wpdb;

		$wpdb->delete( 
			RELATION_TABLE,
			array( 
				'galleryid' => $this->id,
				'imageid' => $imageId
			)
		);
	}

	function removeAllImages() {
		global $wpdb;

		$wpdb->delete(
			RELATION_TABLE,
			array(
				'galleryid' => $this->id
			),
			array( '%d' )
		);
	}
}

?>