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
			<button>Add to galleries</button>
			<button>Edit</button>
		</div>
	<?php }
}




?>