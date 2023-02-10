import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff, 1);
document.body.appendChild( renderer.domElement );

var circleGeometry = new THREE.CircleGeometry(1,32);

var circles = [];
for (var i = 0; i < 30; i++) {
    var color;
    if (i % 3 === 0) {
        color = new THREE.Color("rgb(96, 60, 20)"); // red
    } else if (i % 3 === 1) {
        color = new THREE.Color("rgb(156, 39, 6)"); // green
    } else {
        color = new THREE.Color("rgb(243, 188, 46)"); // blue
    }
    var circleMaterial = new THREE.MeshBasicMaterial({color: color});
    var circle = new THREE.Mesh (circleGeometry, circleMaterial);

    circle.position.x = (Math.random() - 0.5) * 20;
    circle.position.y = (Math.random() - 0.5) * 20;

    // give each circle a random velocity
    circle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
    );

    circles.push(circle);
    scene.add(circle);
}

var randomSpeed = Math.random() * 0.9;

function animate() {
    requestAnimationFrame( animate ); {
    renderer.render( scene, camera );
    for (var i = 0; i < 30; i++) {
        // update the position of the circles based on their velocity
        circles[i].position.x += circles[i].velocity.x;
        circles[i].position.y += circles[i].velocity.y;

        var minVelocity = 0.01;
    if (Math.abs(circles[i].velocity.x) < minVelocity) {
        circles[i].velocity.x = minVelocity * Math.sign(circles[i].velocity.x);
    }
    if (Math.abs(circles[i].velocity.y) < minVelocity) {
        circles[i].velocity.y = minVelocity * Math.sign(circles[i].velocity.y);
    }


        // check for collisions with other circles
        for (var j = 0; j < 30; j++) {
            if (i === j) continue; // don't check for collision with self
            var distance = circles[i].position.distanceTo(circles[j].position);
            if (distance < 2) { // the two circles have collided
                // calculate the normal vector between the two circles
                var normal = circles[j].position.clone().sub(circles[i].position).normalize();
                // calculate the velocity of each circle after the collision
                var u1 = circles[i].velocity.clone().dot(normal);
                var u2 = circles[j].velocity.clone().dot(normal);
                var v1 = circles[i].velocity.clone().sub(normal.clone().multiplyScalar(2 * u1)).multiplyScalar(0.6);
                var v2 = circles[j].velocity.clone().add(normal.clone().multiplyScalar(2 * u1)).multiplyScalar(0.6);
                circles[i].velocity = v1;
                circles[j].velocity = v2;
            }
        }

        // check for collisions with walls
        if (circles[i].position.x + 1 > 10 || circles[i].position.x - 1 < -10) {
            circles[i].velocity.x *= -1;
        }
        if (circles[i].position.y + 1 > 10 || circles[i].position.y - 1 < -10) {
            circles[i].velocity.y *= -1;
        }
    }
    }
}
animate();