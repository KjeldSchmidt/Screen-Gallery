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

		this.newGallery.find('[type=submit]').on('click', function(e) {
			NewGalleryWidget.send(e);
		});

		this.newGallery.find('[name=cancel]').on('click', function() {
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

		this.widget.find('[type=submit]').on('click', function() {
			EditGalleryWidget.save();
		});

		this.widget.find('[name=cancel]').on('click', function() {
			EditGalleryWidget.cancel();
		});

		this.widget.find('[name=delete]').on('click', function() {
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

	widget: jQuery('#imageSelection'),
	headline: jQuery('#imageSelection h3'),
	imageContainer: jQuery('#imageSelection .imageContainer'),

	galleryData: {
		id: null,
		title: null,
		title_image_url: null
	},





	init: function() {
		jQuery('.galleryEditors').on('click', '.galleryEditor [name=images]', function() {
						
			ImageSelectionWidget.cancel();
			var gallery = jQuery(this).parent();

			ImageSelectionWidget.galleryData.id = gallery.attr('data-id');
			ImageSelectionWidget.galleryData.title = gallery.find( 'h3' ).text().trim();
			ImageSelectionWidget.galleryData.description = gallery.find( 'p' ).text().trim();
			ImageSelectionWidget.galleryData.title_image_url = gallery.find('img').attr("src");

			ImageSelectionWidget.activate();
		});


		this.bindActions();

	},


	bindActions: function() {
		this.widget.find('[name=cancel]').on('click', function() {
			ImageSelectionWidget.cancel();
		});

		this.widget.find('[name=save]').on('click', function() {
			ImageSelectionWidget.save();
		});

		this.widget.find('[name=delete]').on('click', function() {
			ImageSelectionWidget.deleteSelected();
		});

		this.widget.on('click', '.imageEditor', function() {
			ImageSelectionWidget.toggleSave(this);
		});
	},


	activate: function() {
		this.headline.html(this.galleryData.title);
		this.loadImages();

		this.imageContainer.sortable({
			items: '.imageEditor'
		});
	},



	loadImages: function() {
		jQuery.ajax({
			type: "POST",
			url: ajaxdata.ajaxurl,

			data: {
				action: 'getGalleryImages',
				id: this.galleryData.id
			},


			success: function(data) {
				ImageSelectionWidget.imageContainer.append(data);
				ImageSelectionWidget.widget.show(400);
			}

		});
	},


	toggleSave: function(element) {
		jQuery(element).toggleClass('addToGallery');
	},


	save: function() {
		var imagesToAdd = [];

		this.imageContainer.find('.addToGallery').each(function() {
			imagesToAdd.push(jQuery(this).attr('data-id'));
		});


		jQuery.ajax({
			method: 'POST',
			url: ajaxdata.ajaxurl,

			data: {
				action: 'saveRelationship',
				imageIds: imagesToAdd,
				galleryId: this.galleryData.id
			},

			success: function(data) {
				ImageSelectionWidget.cancel();
			}
		});
	},


	deleteSelected: function() {
		if ( confirm( "All selected images will be deleted from this gallery. This can not be undone. Continue?" ) ) {
			var imagesToAdd = [];

			this.imageContainer.find('.addToGallery').each(function() {
				imagesToAdd.push(jQuery(this).attr('data-id'));
				jQuery(this).remove();
			});


			jQuery.ajax({
				method: 'POST',
				url: ajaxdata.ajaxurl,

				data: {
					action: 'deleteRelationship',
					imageIds: imagesToAdd,
					galleryId: this.galleryData.id
				}
			});
		}
	},


	cancel: function () {
		jQuery.each(this.galleryData, function(key, value) {
			value = null;
		});

		this.widget.hide(400);
		this.imageContainer.html("");
	}

};

NewGalleryWidget.init();
EditGalleryWidget.init();
ImageSelectionWidget.init();