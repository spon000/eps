define([
	"jquery"
], function($) {
	
	return (
	// Class that controls the UI of the editor.
	// This class requires JQuery.

	class Interface {
		
		constructor(canvasID) {
			
			this._canvasElementID = canvasID;
			// .first() gets first element in selector and wraps it in a JQuery object.
			// .get(0) gets first element in select and returns the DOM object.
			this._canvasElement = $("#" + canvasID).first();
			this._canvasWidth = this._canvasElement.attr("width");
			this._canvasHeight = this._canvasElement.attr("height");
			
			// Array of sliders to modify the map.
			this._mapSlidersElements = $(".map-slider");
		}
		
		// Getters...
		get canvasElementID() {
			return this._canvasElementID;
		}
		get canvasElement() {
			
			// Returns DOM object...
			return this._canvasElement.get(0);
		}
		
		get canvasWidth() {
			
			return this._canvasWidth;
		}
		
		get canvasHeight() {
			
			return this._canvasHeight;
		}
		
		
		// Methods...
		initInterface() {
			console.log("func: Interface.initInterface starting...");
			
			// Initialize the map sliders.
			this._mapSlidersElements.each((index, element) => {
				// Surrounding a DOM element variable with $() will convert it
				// into a JQuery object.
				this._initSlider($(element));
			});
		}
		
		setButtonClickFunction(buttonID, clickFunction, data = null) {
			
			let boundClickFunction = clickFunction.bind(data);
			$(buttonID).click(boundClickFunction);
		}
		
		setElementText(elementID) {
		}
		
		_initSlider(slider){
			console.log("func: Interface.initSlider starting...");
			
			slider.slider({
				min: Number(slider.attr("min")),
				max: Number(slider.attr("max")),
				step: Number(slider.attr("step")),
				create: function() {
					slider.slider("option", "value", slider.attr("default"));
					$(slider.children()[0]).text(slider.slider("value"));
				},
				slide: function(event, ui) {
					$(slider.children()[0]).text(ui.value);
				}
			});
		}
	});

});

