var newGalleryWidget = {

	toggleButton: 	jQuery('#addGalleryButton'),
	newGallery:		jQuery('#addGallery'),
	sendButton: 	jQuery('#addGallery form [type=submit]'),

	init: function() {
		this.toggleButton.on('click', function() {
			newGalleryWidget.newGallery.slideToggle();
		});
		this.sendButton.on('click', function(e) {
			newGalleryWidget.send(e);
		});
	},

	send: function(e) {
		e.preventDefault();
		jQuery.ajax({
			type: 'POST',
			url: ajaxdata.ajaxurl,
			data: {
				action: 'add_gallery',
				name: this.newGallery.find('[name=name]').val(),
				description: this.newGallery.find('[name=description]').val()
			},

			success: function(data){
				jQuery('.galleryEditors').prepend(data);
			}
		}); 

	}
}

newGalleryWidget.init();