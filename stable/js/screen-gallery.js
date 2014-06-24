//The gallery-object. Only one is ever needed at a time, so we load it into a variable directly.
var ScreenGallery = {

	//loads settings that might be changed
	maxHeight: jQuery('#maxHeight').html(),
	input: jQuery('#gallery-tag-search'),

	//asigns the wrapper of the gallery for shorter use later
	wrapper: jQuery('.gallery-wrapper'),
	


	init: function() {
		this.positionWrapper();
		this.bindAction();
	},



	bindAction: function() {		
		//Fires on resize and, well, resizes everything.
		jQuery(window).resize(debouncer(function() {
			placeInRows();
		}));

		//Fires on scroll, checks to see if more images need loading
		jQuery(window).scroll(debouncer(function(){
			hasGalleryEnded();
		}));

	},
	//makes sure everything below the gallery gets pushed down enough, since the gallery has position: absolute
	positionWrapper: function() {
		this.wrapper.parent().height(this.wrapper.height()+50);
	},

	width: function() {
		return this.wrapper.width();
	}

};

function galleryImage(img) {
	var i = {

		image: img,
		//Tells us the width it would have, if scaled to maxHeight (standard: 300)
		targetWidth: ScreenGallery.maxHeight / img.find('img').attr("height") * img.find('img').attr("width"),

		//Scales the image by the height attribute rather than inline css. Good idea? I don't know.
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

	//Sets the ID without # to insert it nicely into the dom, later we only need it for jQuery, so we add the #.	
	r.id = 'row-'+rows.length;
	jQuery('.gallery').append("<div id='"+r.id+"' class='gallery-row'></div>");
	r.id = '#'+r.id;

	//Appends the pictures to the row
	images.forEach(function(img) {
		jQuery(r.id).append(jQuery(img.image)[0].outerHTML);
	});

	//Applies the standard height 
	jQuery(r.id).height(r.height);

	//And then recalculates it... above line should propably be removed.
	r.fit();

	return r;
}

//Offset explains how many images are already loaded and gets send via AJAX for more.
var galleryImages = [];
var rows = [];
var offset = 10;


(function startUp() {
	ScreenGallery.init();
	//Inserts the original 10 images
	insertImageArray(jQuery('.gallery-buffer a'));
	//Checks wether they fill the screen, loads more if not
	hasGalleryEnded();
}) ();


function insertImageArray(array){
	//Adds the images to the existing array of images
	array.each(function() {
		var img = new galleryImage(jQuery(this));
		galleryImages.push(img);
	});

	//And recalculates all rows.
	placeInRows();
}


//Recalculates all rows
//Maybe add a different function that only recalculates the very last row and newly added ones, to improve performance on AJAX-Calls.
function placeInRows () {
	//Resets the row-array
	rows.forEach(function(row) {
		row.remove();
	});
	rows.length = 0;

	var newRow = [];
	var rowWidth = 0;
	
	//A row is complete once the images at target height are wider than the screen, so usually a small downsizing occurs.
	galleryImages.forEach(function(img){
		rowWidth += img.targetWidth;
		newRow.push(img);
		if (rowWidth >= ScreenGallery.width()) {
			rows.push(new row(newRow, rowWidth));
			newRow = [];
			rowWidth = 0;
		}
	});
	//If, after going trough all images, a row isn't quite finished, it get's pushed now.
	if (newRow.length) rows.push(new row(newRow, rowWidth));
	//Makes sure everythin is spaced properly
	ScreenGallery.positionWrapper();
}

//Checks if more images need loading
function hasGalleryEnded(){
	if (isOnScreen(jQuery('.gallery-end'))) {
		loadMoreImages();
	}
}

//Checks if the element is on screen. Actually, it checks if the element is on or above the screen. Add constraints later.
function isOnScreen(element) {
    var viewportHeight = jQuery(window).height(),
        scrollTop = jQuery(window).scrollTop(),
        y = jQuery(element).offset().top;

    return (y < (viewportHeight + scrollTop+300));
}

//Just ajax-loads more images. No big deal.
function loadMoreImages() {
	jQuery.ajax({
		type: 'POST',
		url: ajaxdata.ajaxurl,
		data: {
			action: 'get_images',
			offset: offset
		},
		success: function(data){
			//Gets the current amount of images so the ImageArray doesn't have to be completely ewly created.
			var sliceOffset = jQuery('.gallery-buffer a').length;
			//Appends the new image, adds them to the output
			jQuery('.gallery-buffer').append(data);
			insertImageArray(jQuery('.gallery-buffer a').slice(sliceOffset));
			offset += 10;
			//Only if images have been loaded, check wether you can STILL see the end of the gallery, and if yes, try to load more.
			if (!(data == "empty")) hasGalleryEnded();
		}
	}); 
}


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