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
		//Fires when a tag to be filtered for is entered
		this.input.on('change', function() {
			ScreenGallery.filterTags();
		});
		
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

	filterTags: function() {

	},

	width: function() {
		return this.wrapper.width();
	}

};

function galleryImage(img) {
	var i = {

		image: img,
		targetWidth: 300 / img.find('img').attr("height") * img.find('img').attr("width"),
		visible: true,		

		show: function() {
			jQuery(this.image).show();
			this.visible = true;
		},

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
	var r = {
		height: ScreenGallery.maxHeight,
		sumWidth: fullWidth,
		maxWidth: ScreenGallery.width(),
		id: null,

		fit: function() {
			jQuery(this.id).height(jQuery(this.id).height() * this.maxWidth / this.sumWidth);
		},

		remove: function() {
			jQuery(this.id).remove();
		}
	};

	r.id = 'row-'+rows.length;
	jQuery('.gallery').append("<div id='"+r.id+"' class='gallery-row'></div>");
	r.id = '#'+r.id;


	images.forEach(function(img) {
		jQuery(r.id).append(jQuery(img.image)[0].outerHTML);
	});

	jQuery(r.id).height(r.height);

	r.fit();

	return r;
}


var galleryImages = [];
var rows = [];
var offset = 10;


(function startUp() {
	ScreenGallery.init();
	insertImageArray(jQuery('.gallery-buffer a'));
	hasGalleryEnded();
}) ();


function insertImageArray(array){
	array.each(function() {
		var img = new galleryImage(jQuery(this));
		galleryImages.push(img);
	});

	placeInRows();
}


function placeInRows () {
	rows.forEach(function(row) {
		row.remove();
	});
	rows.length = 0;

	var newRow = [];
	var rowWidth = 0;
	
	galleryImages.forEach(function(img){
		rowWidth += img.targetWidth;
		newRow.push(img);
		if (rowWidth >= ScreenGallery.width()) {
			rows.push(new row(newRow, rowWidth));
			newRow = [];
			rowWidth = 0;
		}
	});
	if (newRow.length) rows.push(new row(newRow, rowWidth));
	ScreenGallery.positionWrapper();
}

function hasGalleryEnded(){
	if (isOnScreen(jQuery('.gallery-end'))) {
		loadMoreImages();
	}
}

function isOnScreen(element) {
    var viewportHeight = jQuery(window).height(),
        scrollTop = jQuery(window).scrollTop(),
        y = jQuery(element).offset().top;

    return (y < (viewportHeight + scrollTop+300));
}

function loadMoreImages() {
	jQuery.ajax({
		type: 'POST',
		url: ajaxdata.ajaxurl,
		data: {
			action: 'get_images',
			offset: offset
		},
		success: function(data){
			var sliceOffset = jQuery('.gallery-buffer a').length;
			jQuery('.gallery-buffer').append(data);
			insertImageArray(jQuery('.gallery-buffer a').slice(sliceOffset));
			offset += 10;
			if (!(data == "empty")) hasGalleryEnded();
		}
	}); 
}


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