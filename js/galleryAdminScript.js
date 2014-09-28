var newGalleryWidget = {

	newGallery: jQuery('#addGallery'),
	newGalleryName: jQuery('#addGallery [name=name]'),
	newGalleryDescription: jQuery('#addGallery [name=description]'),

	toggleButton: jQuery('#addGalleryButton'),
	sendButton: jQuery('#addGallery [type=submit]'),
	cancelButton: jQuery('#addGallery [name=cancel]'),

	
	

	init: function() {
		this.toggleButton.on('click', function() {
			newGalleryWidget.newGallery.slideToggle();
		});

		this.sendButton.on('click', function(e) {
			newGalleryWidget.send(e);
		});

		this.cancelButton.on('click', function() {
			newGalleryWidget.newGalleryName.val("");
			newGalleryWidget.newGalleryDescription.val("");
			newGalleryWidget.newGallery.slideToggle();
		});
	},

	send: function(e) {
		e.preventDefault();
		jQuery.ajax({
			type: 'POST',
			url: ajaxdata.ajaxurl,
			data: {
				action: 'addGallery',
				name: this.newGalleryName.val(),
				description: this.newGalleryDescription.val()
			},
			
			success: function(data){
				jQuery('.galleryEditors').prepend(data);
			}
		}); 

	}
};






var editGalleryWidget = {


	widget: jQuery('#editGallery'),
	nameInput: jQuery('#editGallery [name=name]'),
	descriptionInput: jQuery('#editGallery [name=description]'),


	saveButton: jQuery('#editGallery [type=submit]'),
	cancelButton: jQuery('#editGallery [name=cancel]'),
	deleteButton: jQuery('#editGallery [name=delete]'),

	
	galleryData: {
		id: null,
		title: null,
		description: null,
		title_image_url: null
	},



	init: function() {
		jQuery('.galleryEditor [name=edit]').on('click', function() {
			var gallery = jQuery(this).parent();
			editGalleryWidget.galleryData.id = gallery.attr('data-id');
			editGalleryWidget.galleryData.title = gallery.find( 'h3' ).text().trim();
			editGalleryWidget.galleryData.description = gallery.find( 'p' ).text().trim();
			editGalleryWidget.galleryData.title_image_url = gallery.find('img').attr("src");

			editGalleryWidget.activate();
		});

		this.saveButton.on('click', function() {
			editGalleryWidget.save();
		});

		this.cancelButton.on('click', function() {
			editGalleryWidget.cancel();
		});

		this.deleteButton.on('click', function() {
			editGalleryWidget.deleteGallery();
		});
	},



	activate: function() {
		this.widget.show(400);
		this.nameInput.val( this.galleryData.title);
		this.descriptionInput.val ( this.galleryData.description );
		window.scrollTo(0, 0);
	},



	save: function() {
		jQuery.ajax({
			type: 'POST',
			url: ajaxdata.ajaxurl,
			data: {
				action: 'updateGallery',
				id: this.galleryData.id,
				name: this.nameInput.val(),
				description: this.descriptionInput.val()
			},
			
			success: function(data){
				var changedGallery = jQuery('.galleryEditor[data-id=' + editGalleryWidget.galleryData.id + ']');
				changedGallery.find('h3').html(editGalleryWidget.nameInput.val());
				changedGallery.find('p').html(editGalleryWidget.descriptionInput.val());

				editGalleryWidget.cancel();
			}
		}); 
	},



	cancel: function() {
		jQuery.each(this.galleryData, function(key, value) {
			value = null;
		});

		this.widget.hide(400);
		this.nameInput.val("");
		this.descriptionInput.val("");
	},



	deleteGallery: function() {
	
		if ( confirm( "Are you sure you want to delete the gallery? You will not be able to restore it." ) ) {

			jQuery.ajax({

				type: 'POST',
				url: ajaxdata.ajaxurl,

				data: {
					action: 'deleteGallery',
					id: this.galleryData.id
				},
				

				success: function(data) {
					jQuery( '[data-id=' + editGalleryWidget.galleryData.id + ']').hide(400);
					editGalleryWidget.cancel();
				}

			});

		}
	}
};

newGalleryWidget.init();
editGalleryWidget.init();