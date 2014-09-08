//The gallery-object. Only one is ever needed at a time, so we load it into a variable directly.
var ScreenGallery = {

	maxHeight: parseInt(jQuery('#maxHeight').html(), 10),
	input: jQuery('#gallery-tag-search'),
	wrapper: jQuery('.galleryWrapper'),
	galleryImages: [],
	galleryRows: [],
	offset: 10,
	


	init: function() {
		this.positionWrapper();
		this.bindAction();
		this.insertImageArray(jQuery('.galleryBuffer .galleryImageContainer'));
		this.hasGalleryEnded();
	},

	bindAction: function() {
		//Fires when a tag to be filtered for is entered
		this.input.on('change', function() {
			this.filterTags();
		});
		
		//Fires on resize and, well, resizes everything.
		jQuery(window).resize(debouncer(function() {
			ScreenGallery.placeInRows();
		}));

		//Fires on scroll, checks to see if more images need loading
		jQuery(window).on('scroll.loadImages', debouncer(function() {
			ScreenGallery.hasGalleryEnded();
		}));
	},

	//Makes sure everything below the gallery gets pushed down enough, since the gallery has position: absolute
	positionWrapper: function() {
		this.wrapper.parent().height(this.wrapper.height()+50);
	},	

	width: function() {
		return this.wrapper.width();
	},

	insertImageArray: function(array){
		array.each(function() {
			var img = new galleryImage(jQuery(this));
			ScreenGallery.galleryImages.push(img);
		});

		this.placeInRows();
	},

	//Checks if more images need loading
	hasGalleryEnded: function() {
		console.log("I'm called, you know?");
		if (isOnScreen(jQuery('.galleryEnd'))) {
			ScreenGallery.loadMoreImages();
		}
	},
		

	//Recalculates all rows. Maybe add a different function that only recalculates the very last row and newly added ones, to improve performance on AJAX-Calls.
	placeInRows: function() {
		this.galleryRows.forEach(function(row) {
			row.remove();
		});
		this.galleryRows.length = 0;

		var newRow = [];
		var rowWidth = 0;
		
		//A row is complete once the images at target height are wider than the screen, so usually a small downsizing occurs.
		this.galleryImages.forEach(function(img){
			rowWidth += img.targetWidth;
			newRow.push(img);
			if (rowWidth >= ScreenGallery.width()) {
				ScreenGallery.galleryRows.push(new row(newRow, rowWidth));
				newRow = [];
				rowWidth = 0;
			}
		});
		//If, after going trough all images, a row isn't quite finished, it get's pushed now.
		if (newRow.length) this.galleryRows.push(new row(newRow, rowWidth));
		//Makes sure everythin is spaced properly
		this.positionWrapper();
	},

	//Just ajax-loads more images. No big deal.
	loadMoreImages: function () {
		jQuery.ajax({
			type: 'POST',
			url: ajaxdata.ajaxurl,
			data: {
				action: 'get_images',
				offset: this.offset
			},

			success: function(data){
				if ((data == "empty")) {
					jQuery(window).off('.loadImages');

					return;	
				} 

				//Gets the current amount of images so the ImageArray doesn't have to be completely newly created.
				var sliceOffset = jQuery('.galleryBuffer .galleryImageContainer').length;
				
				jQuery('.galleryBuffer').append(data);
				ScreenGallery.insertImageArray(jQuery('.galleryBuffer .galleryImageContainer').slice(sliceOffset));

				ScreenGallery.offset += 10;	
				//If no images are returned, it assumes no more images are available and will stop calling for more until the page is reloaded.
				
			}
		}); 
	}
};

function galleryImage(img) {
	var i = {

		image: img,
		//Tells us the width it would have, if scaled to maxHeight (standard: 300)
		targetWidth: (ScreenGallery.maxHeight / img.find('img').attr("height") * img.find('img').attr("width")) + 20,

		//Scales the image by the height attribute rather than css. Good idea? I don't know.
		height: function(height) {
			jQuery(this).attr("height", height);
		},

		remove: function() {
			jQuery(this.image).remove();
		}


	};

	return i;
}

function row(images, fullWidth) {
	//Sets the row-class
	var r = {
		//Targeted height of a row
		height: ScreenGallery.maxHeight,
		//Width of all the images, assuming height = 300
		sumWidth: fullWidth,
		//Width of the window
		maxWidth: ScreenGallery.width(),
		//Gets set later
		id: null,

		//Scales the height such that the width of the row is equal to the with of the window
		//Thus, slightly unequal height, but consistent, window-wide widths happen
		fit: function() {
			jQuery(this.id).height(jQuery(this.id).height() * this.maxWidth / this.sumWidth);
		},

		//Rows are removed and recalculated when window is resized
		remove: function() {
			jQuery(this.id).remove();
		}
	};

	//Sets the ID without # to insert it nicely into the DOM, later we only need it for jQuery, so we add the #.	
	r.id = 'row-'+ScreenGallery.galleryRows.length;
	jQuery('.gallery').append("<div id='"+r.id+"' class='galleryRow'></div>");
	r.id = '#'+r.id;

	
	images.forEach(function(img) {
		jQuery(r.id).append(jQuery(img.image)[0].outerHTML);
	});

	//Applies the standard height and then recalculates it.
	jQuery(r.id).height(r.height);
	r.fit();

	return r;
}


(function startUp() {
	ScreenGallery.init();
}) ();




//							//
//     Generic Functions	//
//							//

//Debouncer functions add a delay between an event and a reaction, so scaling and scrolling don't evoke a function dozens of times.
function debouncer(func, timeout) {
	var timeoutID , timeout = timeout || 200;
	return function () {
		var scope = this , args = arguments;
		clearTimeout( timeoutID );
		timeoutID = setTimeout( function () {
			func.apply( scope , Array.prototype.slice.call( args ) );
		} , timeout );
	};
}

//Checks if the element is on screen. Actually, it checks if the element is on or above the screen.
function isOnScreen(element) {
	var viewportHeight = jQuery(window).height(),
		scrollTop = jQuery(window).scrollTop(),
		y = jQuery(element).offset().top;

	return (y < (viewportHeight + scrollTop+300));
}