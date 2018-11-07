requirejs.config({
  //By default load any module IDs from js
  baseUrl: "js",
  //except, if the module ID starts with "app",
  //load it from the js/app directory. paths
  //config is relative to the baseUrl, and
  //never includes a ".js" extension since
  //the paths config could be for a directory.
  paths: {
    // Core libraries
    jquery: "lib/jquery/jquery.3.3.1.min",
    jqueryui: "lib/jquery-ui/jquery-ui.min",
    // "bootstrap.bundle.4.1.1.min" contains needed popper.js library.
    "jq.bootstrap": "lib/bootstrap/bootstrap.bundle.4.1.1.min",
    easeljs: "lib/easeljs/easeljs.1.0.0.min",
    Handlebars: "lib/handlebars/handlebars-v4.0.12",
    //"dojo": "//download.dojotoolkit.org/release-1.13.0/dojo",

    // Javascript classes
    Game: "class/Game",
    Player: "class/Player",

    CanvasMap: "class/CanvasMap",
    Viewport: "class/Viewport",
    Layer: "class/Layer",
    Vector2: "class/Vector2",
    Tile: "class/Tile",
    TileMap: "class/TileMap",
    TerrainMap: "class/TerrainMap",
    Biome: "class/Biome",
    Keys: "class/Keys",
    City: "class/City",
    Facility: "class/Facility",
    Generator: "class/Generator",
    FacilityController: "class/FacilityController",
    FacilityBuildDialog: "class/dialog/FacilityBuildDialog",
    FacilitySelectDialog: "class/dialog/FacilitySelectDialog",
    FacilityViewDialog: "class/dialog/FacilityViewDialog",

    DialogBoxInfo: "class/DialogBoxInfo",
    DialogBoxInfo2: "class/DialogBoxInfo2",
    DialogBoxSelect: "class/DialogBoxSelect",
    DialogBoxConfirm: "class/DialogBoxConfirm",

    TopMenu: "class/TopMenu",
    SideMenu: "class/SideMenu",

    // Template files
    FacilitySelectTmplt: "template/FacilitySelectTmplt",
    FacilityBuildTmplt: "template/FacilityBuildTmplt",
    FacilityViewTmplt: "template/FacilityViewTmplt",

    // Definition files
    GrassTileDefs: "misc/GrassTileDefs",
    TerrainLayer: "misc/TerrainLayer",
    CityLayer: "misc/CityLayer",
    OverlayLayer: "misc/OverlayLayer",
    Interface: "misc/Interface",
    CityDefs: "misc/CityDefs",
    FacilityDefs: "misc/FacilityDefs",
    TopMenuDefs: "misc/TopMenuDefs"
  },

  // Allows you to use non AMD (Asynchronus Module Definition)
  // supported libraries that have dependencies on other libraries.
  // "deps" lists dependencies required by the module.
  shim: {
    "jq.bootstrap": {
      deps: ["jquery"]
    },
    easeljs: {
      exports: "createjs"
    },
    Handlebars: {
      exports: "handlebars"
    }
  }
});

// Main.js starts here...
require([
  "jquery",
  "jqueryui",
  "jq.bootstrap",
  "easeljs",
  "CanvasMap",
  "Viewport",
  "Layer",
  "Tile",
  "TileMap",
  "TerrainMap",
  "Vector2",
  "GrassTileDefs",
  "TerrainLayer",
  "CityLayer",
  "OverlayLayer",
  "Interface",
  "CityDefs",
  "FacilityController",
  //"FacilityDefs",
  "TopMenu"

], function (
  $,
  JQUI,
  BootStrap,
  Easeljs,
  CanvasMap,
  Viewport,
  Layer,
  Tile,
  TileMap,
  TerrainMap,
  Vector2,
  GrassTileDefs,
  TerrainLayer,
  CityLayer,
  OverlayLayer,
  Interface,
  CityDefs,
  FacilityController,
  TopMenu
) {
    console.log("JS: main.js starting...");
    let canvasMapStage = new CanvasMap("map-viewport-window");

    // Allows us to load a set of images into an array.
    const checkImage = pathObject =>
      new Promise(resolve => {
        const img = new Image();
        img.onload = evt => resolve({ image: evt.target, name: pathObject.name });
        img.onerror = () => resolve({ path, status: "error" });
        img.src = pathObject.path;
      });

    let imagePathObjects = [
      //{ name: "world", path: "img/world-map-200x120.png" },
      { name: "world", path: "img/world-map-240x120b.png" },
      { name: "terrain", path: "img/tiles/terrain-tilesb.png" },
      { name: "city", path: "img/tiles/tech-tilesb.png" }
      // { name: "city", path: "img/tiles/city-tiles.png" }
    ];

    const loadImage = imagePaths => Promise.all(imagePathObjects.map(checkImage));
    loadImage(imagePathObjects).then(imageResultArray => {
      let imagesObject = {};
      imageResultArray.forEach(imageResult => {
        imagesObject[imageResult.name] = imageResult.image;
      });


      let terrainTileMap = TerrainLayer.init(
        imagesObject.world,
        imagesObject.terrain,
        120,
        240
      );

      //console.log("terrainTileMap = ", terrainTileMap);

      let cityTileMap = CityLayer.init(imagesObject.city);
      CityLayer.createCities(CityDefs);

      let facilityController = new FacilityController(
        50,
        50,
        25,
        25,
        canvasMapStage,
        imagesObject.city
      );

      canvasMapStage.addTileMap(terrainTileMap);
      canvasMapStage.addTileMap(cityTileMap);
      canvasMapStage.addTileMap(facilityController.tileMap);

      //let overlayTile = OverlayLayer.init(canvasMapStage);
      Interface.init(canvasMapStage, facilityController);

      // These need to be declared in ascending order!
      canvasMapStage.addZoomLevel(new Vector2(5, 5));
      canvasMapStage.addZoomLevel(new Vector2(10, 10));
      canvasMapStage.addZoomLevel(new Vector2(25, 25));
      canvasMapStage.addZoomLevel(new Vector2(50, 50));

      canvasMapStage.addScaleLevel(new Vector2(0.2, 0.2));
      canvasMapStage.addScaleLevel(new Vector2(0.4, 0.4));
      canvasMapStage.addScaleLevel(new Vector2(1, 1));
      canvasMapStage.addScaleLevel(new Vector2(2, 2));

      canvasMapStage.zoomLevel = 0;
      canvasMapStage.startCanvasTimer();

      // let yg = 5;
      // let xg = 5;
      // for (let y = 0; y < canvasMapStage.height; y += yg) {
      //   for (let x = 0; x < canvasMapStage.width; x += xg) {
      //     let square = new createjs.Shape();
      //     square.graphics.beginStroke("black").drawRect(x, y, x + xg, y + yg);
      //     canvasMapStage.stage.addChild(square);
      //   }
      // }
      // canvasMapStage.stage.update();

      //
      let topMenu = new TopMenu();
    });
  });
