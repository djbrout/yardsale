if(!window.App) window.App = {};
(function($) {
	var $productsContainer = $('#productsContainer');

	/**
	 * Creates and adds products boxes to DOM
	 */
	function addProductToDOM(spreadSheetProduct) {
		// Declare the product box template
		var $productTemplate = $('<div class="col-sm-4 box-product"> \
			<div class="image"> \
				<img src="" alt=""> \
			</div> \
			\
			<h2>iPod nano 2nd gen</h2> \
			\
			<div class="price"> \
				<div class="from">From <span>$100</span></div> \
				<div class="saleprice">$90</div> \
				<div class="discount label label-success">10% off</div> \
			</div> \
			\
			<a href="#" type="button" class="btn btn-info">I want this!</a> \
		</div>');


		// Get the data from JSON
		var status = spreadSheetProduct.gsx$status.$t;
		var title = spreadSheetProduct.gsx$product.$t;
		var discount = spreadSheetProduct.gsx$discount.$t;
		var fullprice = spreadSheetProduct.gsx$price.$t;
		var saleprice = spreadSheetProduct.gsx$saleprice.$t;
		var picture = spreadSheetProduct.gsx$picture.$t;


		// Add the product status
		$productTemplate.addClass(status);

		// The name of the product
		$productTemplate.find('h2').html(title);

		// If it hasn't any discount, removes the discount tags
		// otherwise add values and put a 'sale' class on the template
		discount = parseInt(discount);
		if(!discount) {
			$productTemplate.find('.price .from, .price .discount').remove();
		} else {
			$productTemplate.find('.price .from span').html(fullprice);
			$productTemplate.find('.price .discount').html(discount + '% off');
			$productTemplate.addClass('sale');
		}

		// Sets the final price
		$productTemplate.find('.price .saleprice').html(saleprice);

		// Set the image URL (if exists). Otherwise, deletes the image
		if(picture) {
			$productTemplate.find('img').attr('src', 'https://googledrive.com/host/' + App.Config.driveFolderID + '/' + picture)
		} else {
			$productTemplate.find('img').remove();
		}

		// If sold, removes the call to action, otherwise add the mailto URL
		if(status=='sold' || status=='reserved') {
			$productTemplate.find('a').remove();
		} else {
			$productTemplate.find('a').attr('href', 'mailto:yardsale@somedomain.com?subject=' + encodeURIComponent('[Yard sale] ' + title));
		}


		// Determines if it's necessary to create another row of products
		if($productsContainer.children(".box-product").length>=3) {
			var $newRow = $('<div />').addClass('row');
			$newRow.insertAfter($productsContainer);
			$productsContainer = $newRow;
		}


		// Add the product to the site
		$productsContainer.append($productTemplate);
	}



	/**
	 * The callback function of spreadsheets json-in-script
	 */
	window.loadData = function(data) {
		var products = data.feed.entry;
		for(var x=0; x<products.length; x++) {
			addProductToDOM(products[x]);
		}
	}


	// Calls the JSON
	$.get('https://spreadsheets.google.com/feeds/list/' + App.Config.spreadSheetID + '/od6/public/values?alt=json-in-script&callback=loadData')
})(jQuery)
