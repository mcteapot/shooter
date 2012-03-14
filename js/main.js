// Shooter by Arjun Prakash
// 01.29.12
// schooter.js

// checks for webGL support
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// Variables
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var SHADOW_MAP_WIDTH = 2048;
var SHADOW_MAP_HEIGHT = 1024;

var container, stats;

var camera, scene, renderer, objects;
var particleLight, pointLight;
		
var cameraTarget;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;


var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var robotBody, robotHead, robotEyes;

var mouseX = 0;
var mouseY = 0;



//callbackShip   = function( geometry ) { creategGeometry( geometry,  0, 0, 0, 0.05 ) };
// Load 3d objects
var loader = new THREE.JSONLoader();


	init();
	animate()
// ## Initialize everything
function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.set( 120.0,83.0,0.0 );

	camera.rotation.set( 0.0, 1.5, 0.0 );
	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

	cameraTarget = new THREE.Vector3( 0.0, 30.0, 0.0  );
	camera.lookAt( cameraTarget );

	// Renderer
	renderer = new THREE.WebGLRenderer( { antialias: true, clearAlpha: 1, clearColor: 0x808080 } );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.shadowCameraNear = 3;
	renderer.shadowCameraFar = this.camera.far;
	renderer.shadowCameraFov = 50;
	renderer.shadowMapBias = 0.0039;
	renderer.shadowMapDarkness = 0.5;
	renderer.shadowMapWidth = SHADOW_MAP_WIDTH;
	renderer.shadowMapHeight = SHADOW_MAP_HEIGHT;
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	container.appendChild( renderer.domElement );

	// Grid

	var line_material = new THREE.LineBasicMaterial( { color: 0xcccccc, opacity: 0.2 } ),
		geometry = new THREE.Geometry(),
		floor = -0.04, step = 5, size = 100;

	for ( var i = 0; i <= size / step * 2; i ++ ) {

		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );

		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );

	}

	var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
	scene.add( line );

	// JSON obejcts

	loader.load( "./assets/robotBody.js",  function( geometry ) {
		var material = new THREE.MeshPhongMaterial();
		material.color = new THREE.Color().setRGB(0.8549019607843137,0.8666666666666667,0.9215686274509803);
		material.ambient = new THREE.Color().setRGB(0,0.3333333333333333,1);
		material.specular = new THREE.Color().setRGB(0,0.3333333333333333,1);

		robotBody = creategGeometry( geometry,  material, 0, 0, 0, 1 );
		robotBody.position.set(0,0,0);
		robotBody.rotation.set(0,0,0);
		robotBody.scale.set(1,1,1);
		scene.add( robotBody );
	} );
	loader.load( "./assets/robotHead.js",  function( geometry ) {
		var material = new THREE.MeshPhongMaterial();
		material.color = new THREE.Color().setRGB(0.9411764705882353,0.9490196078431372,0.9803921568627451);
		material.ambient = new THREE.Color().setRGB(1,0,0.08235294117647059);
		material.specular = new THREE.Color().setRGB(0,0.25098039215686274,1);

		robotHead = creategGeometry( geometry,  material, 0, 0, 0, 1 );
		robotHead.position.set(0,77.01283547257887,0);
		robotHead.rotation.set(0,0,0);
		robotHead.scale.set(1,1,1);
		scene.add( robotHead );
	} );

	loader.load( "./assets/robotEyes.js",  function( geometry ) {
		var material = new THREE.MeshPhongMaterial();
		material.color = new THREE.Color().setRGB(0.9411764705882353,0.9490196078431372,0.9803921568627451);
		material.ambient = new THREE.Color().setRGB(1,0,0.08235294117647059);
		material.specular = new THREE.Color().setRGB(0,0.25098039215686274,1);

		robotEyes = creategGeometry( geometry,  material, 0, 0, 0, 1 );
		robotEyes.position.set(0,77.01283547257887,0);
		robotEyes.rotation.set(0,0,0);
		robotEyes.scale.set(1,1,1);
		scene.add( robotEyes );
	} );

	
	// Lights
	//scene.add( new THREE.AmbientLight( 0xcccccc ) );

	var pointLight01 = new THREE.PointLight();
	pointLight01.intensity = 1;
	pointLight01.castShadow = false;
	pointLight01.color = new THREE.Color().setRGB(0.8666666666666667,0.8823529411764706,0.9019607843137255);
	pointLight01.position.set(100,117.32788798133033,42.00700116686119);
	pointLight01.rotation.set(0,0,0);
	pointLight01.scale.set(1,1,1);
	scene.add( pointLight01 );

	var pointLight02 = new THREE.PointLight();
	pointLight02.intensity = 1;
	pointLight02.castShadow = false;
	pointLight02.color = new THREE.Color().setRGB(0.8588235294117647,0.2549019607843137,0.10588235294117647);
	pointLight02.position.set(-228.0423280423279,0.641773628938215,0);
	pointLight02.rotation.set(0,0,0);
	pointLight02.scale.set(1,1,1);
	scene.add( pointLight02 );

	// WindowResize resizes screan according to screen
	THREEx.WindowResize(renderer, camera);

	container.appendChild( renderer.domElement );


		
	// FPS stats 
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
} //init()


// ## Animate and Display the Scene
function animate() {

	requestAnimationFrame( animate );
	render();
	stats.update();

} //animate()

// ## Render the 3D Scene
function render() {

	var delta = Date.now() * 0.0005;


	//head.rotation.x =+ (targetRotation - head.rotation.x) * 0.08;
	//head.rotation.y =+ (targetRotation - head.rotation.y) * 0.1;
	//head.rotation.z =+ (targetRotation - head.rotation.z) * 0.05;
	//camera.rotation.z =+ (targetRotation - camera.rotation.z) * 0.1;
	//cameraPosition.y =+ (targetRotation - cameraPosition.y) * 0.5;




	//console.log("targetRotation: " + targetRotation);
	//console.log("targetRotationOnMouseDown: " + targetRotationOnMouseDown);
	//console.log("targetRotation: " + targetRotation);

	renderer.render( scene, camera );

} //render()





