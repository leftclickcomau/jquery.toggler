/**
 * jquery.toggler.js
 * 
 * Progressive enhancement to convert a set of checkboxes or radio buttons in
 * a list into a set of elements that are clicked to toggle.  The underlying
 * checkboxes are hidden but updated by the user interactions.
 * 
 * (c) 2010 Leftclick.com.au
 * Licensed under the GNU General Public License (GPL).
 * Commercial licenses also available.
 */

;(function($) {
	$.fn.toggler = function(options) {

		//------------ DEFAULT SETTINGS ------------

		var defaults = {
			mode: 'checkbox', // 'checkbox' or 'radio' TODO 'auto'
			parentElemName: 'li', // element containing checkbox and text
			showAllId: null, // ID of the element containing the 'show all' checkbox
			hideFormFields: true, // whether or not to hide form controls
			classNames: {
				toggler: 'toggler', // class added to all parent elements
				selected: 'selected' // class added to parent elements of selected items
			}
		};

		//------------ COMBINED SETTINGS ------------

		var settings = $.extend(true, {}, defaults, options);

		//------------ PLUGIN FUNCTIONALITY ------------

		return this.each(function() {
			// get jQuery objects
			var $parentElems = $(this).find(settings.parentElemName).addClass(settings.classNames.toggler);
			var $inputElems = $parentElems.find('input[type=' + settings.mode + ']');
			var $showAllParentElem = $('#' + settings.showAllId).addClass(settings.classNames.toggler);
			var $showAllInputElem = $showAllParentElem.find('input[type=' + settings.mode + ']');

			// flag used to prevent unnecessary recursion
			var resetting = false;

			// initialise visibility of form elements
			if (settings.hideFormFields) {
				$inputElems.hide();
				$showAllInputElem.hide();
			}

			// set up the element initial states and event handlers
			$parentElems.each(function() {
				var $parentElem = $(this);

				// checkbox elements - toggle the selected class on the parent
				// element, and possibly check or uncheck the "show all" 
				// checkbox, when this checkbox is changed
				var $inputElem = $parentElem.find('input[type=' + settings.mode + ']').change(function(evt) {
					var checked = $(this).attr('checked');
					$parentElem.toggleClass(settings.classNames.selected, checked);
					if (!resetting) {
						if ($inputElems.filter('[checked='+checked+']').length === $inputElems.length) {
							resetting = true;
							$showAllInputElem.attr('checked', true).change();
							resetting = false;
						} else if (checked || $showAllInputElem.attr('checked')) {
							$showAllInputElem.attr('checked', false).change();
						}
					}
				});

				// parent elements - add or remove the selected class based on
				// checkbox initial selected state; add listener to toggle
				// checkbox when parent element is clicked
				$parentElem.toggleClass(settings.classNames.selected, $inputElem.attr('checked')).click(function(evt) {
					$inputElem.attr('checked', !$inputElem.attr('checked'));
					$inputElems.change();
				});
			});

			// "show all" checkbox element - toggle the selected class on
			// the "show all" parent element, and when checking this checkbox,
			// uncheck all the other checkboxes; also initialise based on
			// initial state of other checkboxes
			$showAllInputElem.attr('checked', ($inputElems.filter('[checked=true]').length === 0)).change(function(evt) {
				var checked = $(this).attr('checked');
				$showAllParentElem.toggleClass(settings.classNames.selected, checked);
				if (checked && !resetting) {
					resetting = true;
					$inputElems.attr('checked', false).change();
					resetting = false;
				}
			}).change();

			// "show all" parent elemeent - when clicked, and the "show all" 
			// checkbox is unchecked, check the "show all" checkbox
			$showAllParentElem.click(function(evt) {
				if (!$showAllInputElem.attr('checked')) {
					$showAllInputElem.attr('checked', true).change();
				}
			});
		});
	};
})(jQuery);
