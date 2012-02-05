// Shooter by Arjun Prakash
// 01.29.12
// schooter.js

// checks for webGL support
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// Variables
var container, stats;

var camera, scene, renderer;

var cube, plane;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


var dae, skin;


// load 3d objects
var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( './assets/ship.dae', function colladaReady( collada ) {

	dae = collada.scene;
	skin = collada.skins[ 0 ];

	dae.scale.x = dae.scale.y = dae.scale.z = 1;
	dae.updateMatrix();
	// ## bootstrap functions
	// initialiaze everything
	init();
	// make it move	
	animate();

} );



// ## Initialize everything
function init() {
	// Links the draw engine to a div
	container = document.createElement( 'div' );
	document.body.appendChild( container );


	// Create a new scene and camera
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.y = 150;
	camera.position.z = 500;
	scene.add( camera );

	// ## Create objects and add them to the scene

	// Cube

	var materials = [];

	for ( var i = 0; i < 6; i ++ ) {

		materials.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );

	}

	cube = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );
	cube.position.y = 150;
	cube.overdraw = true;
	scene.add( cube );

	// Plane

	plane = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
	plane.rotation.x = - 90 * ( Math.PI / 180 );
	plane.overdraw = true;
	scene.add( plane );

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	// WindowResize resizes screan according to screen
	THREEx.WindowResize(renderer, camera);

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
}


// ## Animate and Display the Scene
function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

// ## Render the 3D Scene
function render() {

	plane.rotation.z = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;
	renderer.render( scene, camera );

}