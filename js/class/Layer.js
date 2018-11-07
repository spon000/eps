define([
	"jquery",
	"Vector2",
	"easeljs"

], function($, Vector2, Easeljs) {
	
	return (
	// This class requires JQuery.
	
	class Layer {
		
		constructor(width, height, bitmap = null) {
			
			console.log("Layer class instantiated...");
			
			this._width = width;
			this._height = height;
			this._bitmap = bitmap;
			
			this._container = new createjs.Container()
			if (bitmap) {
				this._container.addChild(bitmap);
			}
		}
		
		// Getters...
		get container() {
			
			return this._container;
		}
		
		// Setters...
		set container(container) {
			
			let parentContainer = this._container.parent;
			
			if (parentContainer) {
				tempZIndex = parentContainer.getChildIndex(this._container);
				parentContainer.removeChild(this._container);
				parentContainer.addchild(container);
				parentContainer.setChildIndex(container, tempZIndex);
				this._container = container;
			}
			else {
				this._container = container;
			}
		}
	
		// Methods...
		addBitmap(bitmap, remove = true) {
			
			if (remove) {
				this._container.removeAllChildren();
			}
			
			this._container.addChild(bitmap);
		}
		
	});
});
