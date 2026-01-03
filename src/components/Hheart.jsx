<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Three.js Interactive Heart Video Grid</title>
<style>
body { 
  margin: 0; 
  background: #1a1a2e;
  overflow: hidden; 
  font-family: system-ui, -apple-system, sans-serif;
}
canvas { display: block; }
.info {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 14px;
  background: rgba(0,0,0,0.7);
  padding: 15px 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  max-width: 300px;
  z-index: 10;
}
.info h2 {
  margin: 0 0 10px 0;
  font-size: 18px;
}
.info p {
  margin: 5px 0;
  font-size: 12px;
  opacity: 0.8;
}
.upload-area {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0,0,0,0.7);
  padding: 15px 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  color: white;
  z-index: 10;
}
.upload-btn {
  background: #667eea;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}
.upload-btn:hover {
  background: #764ba2;
}
#videoInput {
  display: none;
}
</style>
</head>
<body>
<div class="info">
  <h2>Video Projection Mapping</h2>
  <p>Heart-shaped video grid</p>
  <p style="margin-top: 10px;">💡 Upload your own video (MP4/WebM) →</p>
</div>

<div class="upload-area">
  <input type="file" id="videoInput" accept="video/*">
  <button class="upload-btn" onclick="document.getElementById('videoInput').click()">
    📹 Upload Video
  </button>
  <button class="upload-btn" onclick="loadVideoURL()" style="margin-left: 10px; background: #f093fb;">
    🔗 Load URL
  </button>
  <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.7;" id="videoStatus">
    Currently: Animated Demo
  </p>
  <p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.6;">
    💡 Get free videos from: <a href="https://pixabay.com/videos/" target="_blank" style="color: #4ade80;">Pixabay</a>, <a href="https://www.pexels.com/videos/" target="_blank" style="color: #4ade80;">Pexels</a>
  </p>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
// Create animated canvas as video source
const videoCanvas = document.createElement('canvas');
videoCanvas.width = 1920;
videoCanvas.height = 1080;
const vctx = videoCanvas.getContext('2d');

let time = 0;
let personX = 960;
let personY = 540;
let personAngle = 0;

function animateVideoCanvas() {
  time += 0.015;
  
  // Create a more photorealistic background
  const bgGradient = vctx.createLinearGradient(0, 0, 1920, 1080);
  bgGradient.addColorStop(0, '#87CEEB'); // Sky blue
  bgGradient.addColorStop(0.7, '#E0F6FF');
  bgGradient.addColorStop(1, '#90EE90'); // Light green ground
  vctx.fillStyle = bgGradient;
  vctx.fillRect(0, 0, 1920, 1080);
  
  // Add sun
  const sunGrad = vctx.createRadialGradient(1600, 200, 50, 1600, 200, 150);
  sunGrad.addColorStop(0, '#FFF9E3');
  sunGrad.addColorStop(0.5, '#FFE66D');
  sunGrad.addColorStop(1, 'rgba(255, 230, 109, 0)');
  vctx.fillStyle = sunGrad;
  vctx.beginPath();
  vctx.arc(1600, 200, 150, 0, Math.PI * 2);
  vctx.fill();
  
  // Ground/path
  vctx.fillStyle = '#C8B08F';
  vctx.fillRect(0, 700, 1920, 380);
  
  // Animate person position - walking across screen
  personX = 400 + (Math.sin(time * 0.3) * 0.5 + 0.5) * 1200;
  personY = 650;
  
  const walkCycle = time * 5;
  
  // Draw more realistic person
  vctx.save();
  vctx.translate(personX, personY);
  
  // Shadow
  vctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  vctx.beginPath();
  vctx.ellipse(0, 200, 80, 25, 0, 0, Math.PI * 2);
  vctx.fill();
  
  // Legs (animated walking) - more realistic proportions
  const leftLegSwing = Math.sin(walkCycle) * 0.5;
  const rightLegSwing = Math.sin(walkCycle + Math.PI) * 0.5;
  
  vctx.strokeStyle = '#2C3E50';
  vctx.lineWidth = 18;
  vctx.lineCap = 'round';
  
  // Left leg
  vctx.save();
  vctx.translate(-15, 80);
  vctx.rotate(leftLegSwing);
  vctx.beginPath();
  vctx.moveTo(0, 0);
  vctx.lineTo(0, 100);
  vctx.stroke();
  vctx.restore();
  
  // Right leg
  vctx.save();
  vctx.translate(15, 80);
  vctx.rotate(rightLegSwing);
  vctx.beginPath();
  vctx.moveTo(0, 0);
  vctx.lineTo(0, 100);
  vctx.stroke();
  vctx.restore();
  
  // Torso - more realistic body
  const torsoGradient = vctx.createLinearGradient(-50, -60, 50, 80);
  torsoGradient.addColorStop(0, '#4A90E2');
  torsoGradient.addColorStop(1, '#357ABD');
  vctx.fillStyle = torsoGradient;
  vctx.fillRect(-50, -60, 100, 140);
  
  // Neck
  vctx.fillStyle = '#FFD5A6';
  vctx.fillRect(-15, -80, 30, 25);
  
  // Arms (animated swinging)
  const leftArmSwing = Math.sin(walkCycle + Math.PI) * 0.4;
  const rightArmSwing = Math.sin(walkCycle) * 0.4;
  
  vctx.lineWidth = 16;
  vctx.strokeStyle = '#4A90E2';
  
  // Left arm
  vctx.save();
  vctx.translate(-50, -40);
  vctx.rotate(leftArmSwing);
  vctx.beginPath();
  vctx.moveTo(0, 0);
  vctx.lineTo(0, 90);
  vctx.stroke();
  vctx.restore();
  
  // Right arm
  vctx.save();
  vctx.translate(50, -40);
  vctx.rotate(rightArmSwing);
  vctx.beginPath();
  vctx.moveTo(0, 0);
  vctx.lineTo(0, 90);
  vctx.stroke();
  vctx.restore();
  
  // Head - more realistic
  const headGradient = vctx.createRadialGradient(-10, -115, 20, 0, -110, 60);
  headGradient.addColorStop(0, '#FFE4C4');
  headGradient.addColorStop(1, '#FFD5A6');
  vctx.fillStyle = headGradient;
  vctx.beginPath();
  vctx.arc(0, -110, 55, 0, Math.PI * 2);
  vctx.fill();
  
  // Hair
  vctx.fillStyle = '#3D2817';
  vctx.beginPath();
  vctx.arc(0, -130, 50, Math.PI, Math.PI * 2);
  vctx.arc(-25, -125, 25, 0, Math.PI * 2);
  vctx.arc(25, -125, 25, 0, Math.PI * 2);
  vctx.fill();
  
  // Face details
  vctx.fillStyle = '#1A1A1A';
  vctx.beginPath();
  vctx.arc(-18, -115, 5, 0, Math.PI * 2);
  vctx.arc(18, -115, 5, 0, Math.PI * 2);
  vctx.fill();
  
  // Smile
  vctx.strokeStyle = '#D1495B';
  vctx.lineWidth = 3;
  vctx.beginPath();
  vctx.arc(0, -100, 22, 0.3, Math.PI - 0.3);
  vctx.stroke();
  
  // Nose
  vctx.strokeStyle = '#CC9966';
  vctx.lineWidth = 2;
  vctx.beginPath();
  vctx.moveTo(0, -110);
  vctx.lineTo(-3, -100);
  vctx.stroke();
  
  vctx.restore();
  
  // Add some environmental elements
  // Clouds
  for (let i = 0; i < 3; i++) {
    const cloudX = 200 + i * 600 + Math.sin(time * 0.1 + i) * 50;
    const cloudY = 150 + i * 50;
    
    vctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    vctx.beginPath();
    vctx.arc(cloudX, cloudY, 40, 0, Math.PI * 2);
    vctx.arc(cloudX + 40, cloudY, 50, 0, Math.PI * 2);
    vctx.arc(cloudX + 80, cloudY, 40, 0, Math.PI * 2);
    vctx.fill();
  }
  
  // Birds
  vctx.strokeStyle = '#333';
  vctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const birdX = 300 + i * 400 + Math.sin(time + i) * 100;
    const birdY = 250 + Math.cos(time * 0.7 + i) * 50;
    
    vctx.beginPath();
    vctx.moveTo(birdX - 15, birdY);
    vctx.quadraticCurveTo(birdX - 10, birdY - 10, birdX, birdY);
    vctx.quadraticCurveTo(birdX + 10, birdY - 10, birdX + 15, birdY);
    vctx.stroke();
  }
  
  // Text overlay
  vctx.font = 'bold 48px Arial';
  vctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  vctx.textAlign = 'center';
  vctx.fillText('Interactive Video Projection', 960, 100);
  vctx.font = '32px Arial';
  vctx.fillText('Upload your own video to see it here!', 960, 950);
}

// Video element for uploads
let uploadedVideo = null;
let useUploadedVideo = false;

// Function to load video from URL
function loadVideoURL() {
  const url = prompt('Paste a direct video URL (must end in .mp4, .webm, etc.):\n\nFree sources:\n• Pixabay: https://pixabay.com/videos/\n• Pexels: https://www.pexels.com/videos/\n\nNote: Right-click on a video → Copy video address');
  
  if (!url) return;
  
  console.log('Loading video from URL:', url);
  
  if (uploadedVideo) {
    uploadedVideo.pause();
    uploadedVideo.src = '';
  }
  
  uploadedVideo = document.createElement('video');
  uploadedVideo.src = url;
  uploadedVideo.crossOrigin = 'anonymous';
  uploadedVideo.loop = true;
  uploadedVideo.muted = true;
  uploadedVideo.playsInline = true;
  uploadedVideo.style.display = 'none';
  document.body.appendChild(uploadedVideo);
  
  uploadedVideo.addEventListener('loadeddata', function() {
    console.log('Video loaded from URL:', uploadedVideo.videoWidth, 'x', uploadedVideo.videoHeight);
    uploadedVideo.play().then(() => {
      console.log('Video playing');
      useUploadedVideo = true;
      
      const newTexture = new THREE.VideoTexture(uploadedVideo);
      newTexture.minFilter = THREE.LinearFilter;
      newTexture.magFilter = THREE.LinearFilter;
      
      cubes.forEach(cube => {
        cube.material.map = newTexture;
        cube.material.needsUpdate = true;
      });
      
      document.getElementById('videoStatus').textContent = ✓ Playing from URL;
      document.getElementById('videoStatus').style.color = '#4ade80';
    }).catch(err => {
      console.error('Play error:', err);
      alert('Could not play video: ' + err.message);
    });
  });
  
  uploadedVideo.addEventListener('error', function(e) {
    console.error('Video error:', uploadedVideo.error);
    alert('Error loading video from URL. Make sure:\n1. URL is a direct video link (.mp4, .webm)\n2. Video allows cross-origin access\n3. Try downloading and using Upload instead');
    document.getElementById('videoStatus').textContent = '❌ Error';
    document.getElementById('videoStatus').style.color = '#ef4444';
  });
  
  uploadedVideo.load();
}

// Handle video upload
document.getElementById('videoInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  console.log('File selected:', file.name, file.type);
  
  if (!file.type.startsWith('video/')) {
    alert('Please select a video file');
    return;
  }
  
  const url = URL.createObjectURL(file);
  
  if (uploadedVideo) {
    uploadedVideo.pause();
    uploadedVideo.src = '';
  }
  
  uploadedVideo = document.createElement('video');
  uploadedVideo.src = url;
  uploadedVideo.loop = true;
  uploadedVideo.muted = true;
  uploadedVideo.playsInline = true;
  uploadedVideo.style.display = 'none';
  document.body.appendChild(uploadedVideo);
  
  uploadedVideo.addEventListener('loadeddata', function() {
    console.log('Video loaded:', uploadedVideo.videoWidth, 'x', uploadedVideo.videoHeight);
    uploadedVideo.play().then(() => {
      console.log('Video playing');
      useUploadedVideo = true;
      
      // Create new video texture
      const newTexture = new THREE.VideoTexture(uploadedVideo);
      newTexture.minFilter = THREE.LinearFilter;
      newTexture.magFilter = THREE.LinearFilter;
      
      // Update all materials
      cubes.forEach(cube => {
        cube.material.map = newTexture;
        cube.material.needsUpdate = true;
      });
      
      document.getElementById('videoStatus').textContent = ✓ ${file.name};
      document.getElementById('videoStatus').style.color = '#4ade80';
    }).catch(err => {
      console.error('Play error:', err);
      alert('Could not play video: ' + err.message);
    });
  });
  
  uploadedVideo.addEventListener('error', function(e) {
    console.error('Video error:', uploadedVideo.error);
    alert('Error loading video. Try MP4 (H.264) format.');
    document.getElementById('videoStatus').textContent = '❌ Error';
    document.getElementById('videoStatus').style.color = '#ef4444';
  });
  
  uploadedVideo.load();
});

// Create heart mask
const maskCanvas = document.createElement('canvas');
const maskSize = 150;
maskCanvas.width = maskSize;
maskCanvas.height = maskSize;
const mctx = maskCanvas.getContext('2d');

mctx.fillStyle = 'white';
mctx.fillRect(0, 0, maskSize, maskSize);
mctx.fillStyle = 'black';
mctx.beginPath();

const centerX = maskSize / 2;
const centerY = maskSize / 2 + 5;
const size = 3.5;

for (let t = 0; t < Math.PI * 2; t += 0.01) {
  const x = centerX + size * 16 * Math.pow(Math.sin(t), 3);
  const y = centerY - size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  if (t === 0) mctx.moveTo(x, y);
  else mctx.lineTo(x, y);
}
mctx.closePath();
mctx.fill();

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 50);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Grid parameters
const gridSize = 45;
const cubeSize = 0.9;
const spacing = 1.15; // More space between cubes

// Get mask data
const maskImageData = mctx.getImageData(0, 0, maskSize, maskSize);
const maskData = maskImageData.data;

// Create texture from canvas
const videoTexture = new THREE.CanvasTexture(videoCanvas);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;

// Build grid
const cubes = [];
const group = new THREE.Group();
scene.add(group);

for (let y = 0; y < gridSize; y++) {
  for (let x = 0; x < gridSize; x++) {
    const maskX = Math.floor((x / gridSize) * maskSize);
    const maskY = Math.floor((y / gridSize) * maskSize);
    const maskIdx = (maskY * maskSize + maskX) * 4;
    const brightness = maskData[maskIdx];
    
    if (brightness < 128) {
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      
      const uvX = x / gridSize;
      const uvY = 1 - (y / gridSize);
      const uvWidth = 1 / gridSize;
      const uvHeight = 1 / gridSize;
      
      const uvAttribute = geometry.attributes.uv;
      const uvArray = uvAttribute.array;
      
      for (let i = 0; i < uvArray.length; i += 2) {
        uvArray[i] = uvX + (uvArray[i] * uvWidth);
        uvArray[i + 1] = uvY + (uvArray[i + 1] * uvHeight);
      }
      uvAttribute.needsUpdate = true;
      
      const material = new THREE.MeshBasicMaterial({ 
        map: videoTexture,
        side: THREE.DoubleSide
      });
      
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = spacing * (x - gridSize / 2);
      cube.position.y = spacing * (gridSize / 2 - y);
      cube.position.z = 0;
      
      cubes.push(cube);
      group.add(cube);
    }
  }
}

console.log(Created ${cubes.length} cubes in heart shape);

// Animation
let animTime = 0;
function animate() {
  requestAnimationFrame(animate);
  
  if (!useUploadedVideo) {
    animateVideoCanvas();
  }
  videoTexture.needsUpdate = true;
  
  animTime += 0.008;
  
  cubes.forEach((cube) => {
    const waveX = Math.sin(animTime * 1.5 + cube.position.x * 0.15);
    const waveY = Math.cos(animTime * 1.5 + cube.position.y * 0.15);
    cube.position.z = (waveX + waveY) * 2.5;
  });
  
  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse interaction
let targetRotX = 0, targetRotY = 0;
let currentRotX = 0, currentRotY = 0;

window.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  targetRotY = mouseX * 0.3;
  targetRotX = mouseY * 0.3;
});

function updateRotation() {
  currentRotX += (targetRotX - currentRotX) * 0.05;
  currentRotY += (targetRotY - currentRotY) * 0.05;
  group.rotation.x = currentRotX;
  group.rotation.y = currentRotY;
  requestAnimationFrame(updateRotation);
}
updateRotation();
</script>
</body>
</html>