var newGalleryWidget = {

	toggleButton: 	jQuery('#addGalleryButton'),
	newGallery:		jQuery('#addGallery'),
	sendButton: 	jQuery('#addGallery form [type=submit]'),

	init: function() {
		this.toggleButton.on('click', function() {
			newGalleryWidget.newGallery.toggle();
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
				name: 	this.newGallery.find('[name=name]').val(),
				text: 	this.newGallery.find('[name=text]').val()
			},

			success: function(data){
				console.dir(data);
			}
		}); 

	}
}

newGalleryWidget.init();