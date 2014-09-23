<?php

class Image {

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

	function build_backend() { ?>
		<div class="imageEditor">
			<img src="<?php echo $this->url ?>" alt="" height="200">
			<h3><?php echo $this->title ?></h3>
			<p><?php echo $this->description ?></p>
			<button class="button button-primary button-large">Add to galleries</button>
			<button class="button button-secondary button-large">Edit</button>
		</div>
	<?php }
}

class Gallery {

	private $id;
	private $slug;
	private $title;
	private $description;
	private $title_image_url;

	function __construct($gallery_object) {
		if (is_object($gallery_object)) {
			$this->id = $gallery_object->id;
			$this->slug = $gallery_object->slug;
			$this->title = $gallery_object->name;
			$this->description = $gallery_object->description;
		} else if(is_array($gallery_object)) {
			$this->id = $gallery_object['id'];
			$this->slug = $gallery_object['slug'];
			$this->title = $gallery_object['name'];
			$this->description = $gallery_object['description'];
		}
		
	}

	function build_backend() { ?>
		<div id="galleryEditor<?php echo $this->id; ?>" class="galleryEditor">
			<img src="<?php echo $this->title_image_url ?>" alt="" height="200">
			<h3>
				<?php echo $this->title ?>
			</h3>
			<p>
				<?php echo $this->description ?>
			</p>
			<button class="button button-primary button-large">Get Shortocde</button>
			<button class="button button-secondary button-large">View all images</button>
			<button class="button button-secondary button-large">Edit</button>
		</div>
	<?php }
}

?>