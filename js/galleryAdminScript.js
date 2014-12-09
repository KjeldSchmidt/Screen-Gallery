var NewGalleryWidget = {

	widget: jQuery('#addGallery'),
	nameInput: jQuery('#addGallery [name=name]'),
	descriptionInput: jQuery('#addGallery [name=description]'),

	
	
	init: function() {
		jQuery('#addGalleryButton').on('click', function() {
			NewGalleryWidget.activate();
		});

		this.bindActions();
	},


	bindActions: function() {
		this.widget.find('[type=submit]').on('click', function(e) {
			NewGalleryWidget.save();
		});

		this.widget.find('[name=cancel]').on('click', function() {
			NewGalleryWidget.cancel();
		});
	},


	activate: function() {
		this.widget.slideToggle();
	},



	save: function() {
		jQuery.ajax({
			type: 'POST',
			url: ajaxdata.ajaxurl,
			data: {
				action: 'addGallery',
				name: this.nameInput.val(),
				description: this.descriptionInput.val()
			},
			
			success: function(data){
				jQuery('.galleryEditors').prepend(data);
				NewGalleryWidget.cancel();
			}
		}); 

	},


	cancel: function() {
		this.nameInput.val("");
		this.descriptionInput.val("");
		this.widget.slideToggle();
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
			ImageSelectionWidget.activate( EditGalleryWidget.galleryData.id );
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

	widget: jQuery('#imageSelectionWidget'),
	galleryImagesContainer: jQuery('#imageSelectionWidget .galleryImagesContainer'),
	allImagesContainer: jQuery('#imageSelectionWidget .allImagesContainer'),

	galleryData: {
		id: null,
		title: null,
		title_image_url: null
	},





	init: function() {
		ImageSelectionWidget.galleryImagesContainer.sortable();

		ImageSelectionWidget.allImagesContainer.droppable({
			drop: function(e, ui) {
				if ( jQuery( ui.draggable ).parent().hasClass( 'galleryImagesContainer' ) )  {
					jQuery( ui.draggable ).remove(); 
		    	}
			}
		});
	},


	activate: function( galleryID ) {
		this.widget.show(400);
		this.loadGalleryImages( galleryID );
		this.loadAllImages();

		console.dir(ImageSelectionWidget.allImagesContainer.find('.imageEditor'));
	},



	loadGalleryImages: function( galleryID ) {
		jQuery.ajax({
			type: "POST",
			url: ajaxdata.ajaxurl,

			data: {
				action: 'getGalleryImages',
				id: galleryID
			},


			success: function(data) {
				ImageSelectionWidget.galleryImagesContainer.append(data);
			}

		});
	},

	loadAllImages: function() {
		jQuery.ajax({
			type: "POST",
			url: ajaxdata.ajaxurl,

			data: {
				action: 'getAllImages',
			},


			success: function(data) {
				ImageSelectionWidget.allImagesContainer.append(data);

				ImageSelectionWidget.allImagesContainer.find('.imageEditor').draggable({
					connectToSortable: '.galleryImagesContainer',
					helper: 'clone'
				});

			}

		});
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
				action: 'saveAllToGallery',
				imageIds: imagesToAdd,
				galleryId: this.galleryData.id
			},

			success: function(data) {
				ImageSelectionWidget.cancel();
			}
		});
	},
};

NewGalleryWidget.init();
EditGalleryWidget.init();
ImageSelectionWidget.init();