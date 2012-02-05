// Shooter by Arjun Prakash
// 01.29.12
// schooter.js

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var FLOOR = -250;
var container, stats;

var camera, scene, renderer, objects;
var particleLight, pointLight;
var dae, skin;
var ship;


callbackShip   = function( geometry ) { createScene( geometry,  0, 0, 0, 0.05 ) };
// load 3d objects
var loader = new THREE.JSONLoader();
loader.load( "./assets/ship.js", function( geometry ) {
	ship = createScene( geometry,  0, 0, 0, 0.05 );
	
	init();
	animate()

} );


function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 2, 2, 3 );
	scene.add( camera );

	// Grid

	var line_material = new THREE.LineBasicMaterial( { color: 0xcccccc, opacity: 0.2 } ),
		geometry = new THREE.Geometry(),
		floor = -0.04, step = 1, size = 14;

	for ( var i = 0; i <= size / step * 2; i ++ ) {

		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );

		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );

	}

	var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
	scene.add( line );

	// JSON obejcts
	scene.add( ship );

	// Lights
	scene.add( new THREE.AmbientLight( 0xcccccc ) );

	// Renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	// WindowResize resizes screan according to screen
	THREEx.WindowResize(renderer, camera);

	container.appendChild( renderer.domElement );

	// FPS stats 
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

}


function createScene( geometry, x, y, z, b ) {

	zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
	zmesh.position.set( x, y, z );
	zmesh.scale.set( b, b, b);
	zmesh.overdraw = true;
	//scene.add( zmesh );
	return zmesh;

}

function animate() {

	requestAnimationFrame( animate );
	render();
	stats.update();

}

function render() {

	var timer = Date.now() * 0.0005;

	camera.position.x = Math.cos( timer ) * 10;
	camera.position.y = 2;
	camera.position.z = Math.sin( timer ) * 10;

	camera.lookAt( scene.position );


	renderer.render( scene, camera );

			}