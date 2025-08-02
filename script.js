import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import questionsData from './questions.json';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.AmbientLight(0xFFFFFF);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

const loader = new GLTFLoader();
let hat;
loader.load('/models/sorting_hat.glb', (gltf) => {
    hat = gltf.scene;
    hat.scale.set(10, 10, 10);
    hat.position.set(-200, 0, 0);
    scene.add(hat);
}, undefined, (error) => console.error(error));

camera.position.z = 1200;
camera.position.x = -200;
camera.position.y = 100;

// Quiz Logic
let currentQuestion = 0;
let scores = { gryffindor: 0, hufflepuff: 0, ravenclaw: 0, slytherin: 0 };
const questions = questionsData.questions;

// Initialize quiz
document.addEventListener('DOMContentLoaded', () => {
    startQuiz();
    document.getElementById('quiz-container').style.display = 'block';
});

function startQuiz() {
    if (currentQuestion >= questions.length) {
        showResult();
        return;
    }
    
    const question = questions[currentQuestion];
    document.getElementById("question").innerText = question.text;
    
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option.text;
        button.onclick = () => answer(index);
        optionsContainer.appendChild(button);
    });
}

export function answer(choiceIndex) {
    const question = questions[currentQuestion];
    const selectedOption = question.options[choiceIndex];
    
    // Add points based on the scoring system
    Object.entries(selectedOption.scoring).forEach(([house, points]) => {
        scores[house] += points;
    });
    
    currentQuestion++;
    startQuiz();
}

function showResult() {
    document.getElementById("quiz-ui").style.display = "none";
    const house = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    document.getElementById("result").innerText = `Welcome to ${house.charAt(0).toUpperCase() + house.slice(1)}!`;
    document.getElementById("result").style.display = "block";
    
    // Add house-specific effects here
    if (hat) {
        // Example: Change hat color based on house
        const houseColors = {
            gryffindor: 0xFF0000,
            hufflepuff: 0xFFD700,
            ravenclaw: 0x0000FF,
            slytherin: 0x00FF00
        };
        hat.traverse((child) => {
            if (child.isMesh) {
                child.material.color.setHex(houseColors[house]);
            }
        });
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    if (hat) hat.rotation.y += 0.01; // Simple rotation
    renderer.render(scene, camera);
}
animate();

// Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.answer = answer; 