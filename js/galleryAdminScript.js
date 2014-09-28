var NewGalleryWidget = {

	newGallery: jQuery('#addGallery'),
	newGalleryName: jQuery('#addGallery [name=name]'),
	newGalleryDescription: jQuery('#addGallery [name=description]'),

	
	


	init: function() {
		this.bindActions();
	},



	bindActions: function() {
		jQuery('#addGalleryButton').on('click', function() {
			NewGalleryWidget.newGallery.slideToggle();
		});

		jQuery('#addGallery [type=submit]').on('click', function(e) {
			NewGalleryWidget.send(e);
		});

		jQuery('#addGallery [name=cancel]').on('click', function() {
			NewGalleryWidget.cancel();
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
				NewGalleryWidget.cancel();
			}
		}); 

	},



	cancel: function() {
		this.newGalleryName.val("");
		this.newGalleryDescription.val("");
		this.newGallery.slideToggle();
	}
};





var EditGalleryWidget = {


	widget: jQuery('#editGallery'),
	nameInput: jQuery('#editGallery [name=name]'),
	descriptionInput: jQuery('#editGallery [name=description]'),

	
	galleryData: {
		id: null,
		title: null,
		description: null,
		title_image_url: null
	},



	init: function() {
		jQuery('.galleryEditors').on('click', '.galleryEditor [name=edit]', function() {
			var gallery = jQuery(this).parent();
			EditGalleryWidget.galleryData.id = gallery.attr('data-id');
			EditGalleryWidget.galleryData.title = gallery.find( 'h3' ).text().trim();
			EditGalleryWidget.galleryData.description = gallery.find( 'p' ).text().trim();
			EditGalleryWidget.galleryData.title_image_url = gallery.find('img').attr("src");

			EditGalleryWidget.activate();
		});

		this.bindActions();

	},



	bindActions: function() {

		jQuery('#editGallery [type=submit]').on('click', function() {
			EditGalleryWidget.save();
		});

		jQuery('#editGallery [name=cancel]').on('click', function() {
			EditGalleryWidget.cancel();
		});

		jQuery('#editGallery [name=delete]').on('click', function() {
			EditGalleryWidget.deleteGallery();
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
				var changedGallery = jQuery('.galleryEditor[data-id=' + EditGalleryWidget.galleryData.id + ']');
				changedGallery.find('h3').html(EditGalleryWidget.nameInput.val());
				changedGallery.find('p').html(EditGalleryWidget.descriptionInput.val());

				EditGalleryWidget.cancel();
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
					jQuery( '[data-id=' + EditGalleryWidget.galleryData.id + ']').hide(400);
					EditGalleryWidget.cancel();
				}

			});

		}
	}
};





var ImageSelectionWidget = {


	init: function() {

	},
}

NewGalleryWidget.init();
EditGalleryWidget.init();
ImageSelectionWidget.init();