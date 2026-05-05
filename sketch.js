import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

let scene, camera, renderer;
let dog, tail, head;
let dogTargetX = 0;
let dogTargetZ = 0;
let replyBox;
let keys = {};
let yaw = 0;
let pitch = 0;
let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd7ff);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 8);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);

  const ceilingLight = new THREE.PointLight(0xffddaa, 2.2, 20);
  ceilingLight.position.set(0, 5.5, 1);
  ceilingLight.castShadow = true;
  ceilingLight.shadow.mapSize.width = 1024;
  ceilingLight.shadow.mapSize.height = 1024;
  scene.add(ceilingLight);

  const windowLight = new THREE.DirectionalLight(0xcce6ff, 1.2);
  windowLight.position.set(-4, 5, 5);
  windowLight.castShadow = true;
  scene.add(windowLight);

  createRoom();
  createDog();
  createUI();

  window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
  window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

  window.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;

    let dx = e.clientX - lastMouseX;
    let dy = e.clientY - lastMouseY;

    yaw -= dx * 0.004;
    pitch -= dy * 0.004;
    pitch = Math.max(-0.8, Math.min(0.8, pitch));

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener("resize", onResize);
}

function createRoom() {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    new THREE.MeshStandardMaterial({ color: 0xb98f62, roughness: 0.7 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 8),
    new THREE.MeshStandardMaterial({ color: 0xf0dcc2, roughness: 0.9 })
  );
  backWall.position.set(0, 4, -8);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 8),
    new THREE.MeshStandardMaterial({ color: 0xe6d0b8 })
  );
  leftWall.position.set(-8, 4, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 8),
    new THREE.MeshStandardMaterial({ color: 0xe6d0b8 })
  );
  rightWall.position.set(8, 4, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(2.3, 64),
    new THREE.MeshStandardMaterial({ color: 0x9f5f5f, roughness: 1 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.03, 1.5);
  rug.receiveShadow = true;
  scene.add(rug);

  const bed = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 0.6, 2.3),
    new THREE.MeshStandardMaterial({ color: 0x8fb3ff, roughness: 0.8 })
  );
  bed.position.set(-4, 0.45, -4.8);
  bed.castShadow = true;
  bed.receiveShadow = true;
  scene.add(bed);

  const pillow = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.3, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  pillow.position.set(-4, 0.95, -5.5);
  pillow.castShadow = true;
  scene.add(pillow);

  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 1.4),
    new THREE.MeshStandardMaterial({ color: 0xfff2a8 })
  );
  photo.position.set(0, 4.4, -7.95);
  scene.add(photo);
}

function createDog() {
  dog = new THREE.Group();

  const fur = new THREE.MeshStandardMaterial({ color: 0x9a6a3a, roughness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1f130c });
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 1.1, 8, 24), fur);
  body.rotation.z = Math.PI / 2;
  body.position.y = 0.8;
  body.castShadow = true;
  dog.add(body);

  head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), fur);
  head.position.set(0, 1.35, 0.55);
  head.castShadow = true;
  dog.add(head);

  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), fur);
  snout.scale.set(1, 0.75, 1.2);
  snout.position.set(0, 1.25, 0.92);
  snout.castShadow = true;
  dog.add(snout);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), dark);
  nose.position.set(0, 1.28, 1.1);
  dog.add(nose);

  const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), dark);
  eye1.position.set(-0.15, 1.45, 0.9);
  dog.add(eye1);

  const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), dark);
  eye2.position.set(0.15, 1.45, 0.9);
  dog.add(eye2);

  const shine1 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), white);
  shine1.position.set(-0.17, 1.47, 0.94);
  dog.add(shine1);

  const shine2 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), white);
  shine2.position.set(0.13, 1.47, 0.94);
  dog.add(shine2);

  const ear1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.45, 8, 16), dark);
  ear1.position.set(-0.35, 1.35, 0.45);
  ear1.rotation.z = 0.5;
  ear1.castShadow = true;
  dog.add(ear1);

  const ear2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.45, 8, 16), dark);
  ear2.position.set(0.35, 1.35, 0.45);
  ear2.rotation.z = -0.5;
  ear2.castShadow = true;
  dog.add(ear2);

  const legGeo = new THREE.CapsuleGeometry(0.09, 0.45, 8, 12);
  for (let x of [-0.45, 0.45]) {
    for (let z of [-0.25, 0.25]) {
      const leg = new THREE.Mesh(legGeo, fur);
      leg.position.set(x, 0.35, z);
      leg.castShadow = true;
      dog.add(leg);
    }
  }

  tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.65, 8, 12), fur);
  tail.position.set(0, 1, -0.75);
  tail.rotation.x = 1;
  tail.castShadow = true;
  dog.add(tail);

  dog.position.set(0, 0, 0);
  dog.rotation.y = 0;
  scene.add(dog);
}

function createUI() {
  replyBox = document.createElement("div");
  replyBox.innerHTML = "Adyn: Woof! Welcome home.";
  replyBox.style.position = "absolute";
  replyBox.style.top = "20px";
  replyBox.style.left = "20px";
  replyBox.style.padding = "14px";
  replyBox.style.background = "rgba(255,255,255,0.85)";
  replyBox.style.fontFamily = "Arial";
  replyBox.style.fontSize = "18px";
  replyBox.style.borderRadius = "12px";
  document.body.appendChild(replyBox);

  const input = document.createElement("input");
  input.placeholder = "Say something to Adyn...";
  input.style.position = "absolute";
  input.style.bottom = "30px";
  input.style.left = "50%";
  input.style.transform = "translateX(-50%)";
  input.style.width = "360px";
  input.style.padding = "12px";
  input.style.fontSize = "16px";
  input.style.borderRadius = "10px";
  input.style.border = "none";
  document.body.appendChild(input);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      dogRespond(input.value);
      input.value = "";
    }
  });
}

function dogRespond(text) {
  const lower = text.toLowerCase();
  let response = "Adyn: Woof! I'm listening.";

  if (lower.includes("sad")) response = "Adyn: Come sit with me. You are safe here.";
  else if (lower.includes("tired")) response = "Adyn: Rest here. Home is for resting.";
  else if (lower.includes("hello") || lower.includes("hi")) response = "Adyn: Woof! I missed you!";
  else if (lower.includes("home")) response = "Adyn: Home is wherever we feel loved.";
  else if (lower.includes("love")) response = "Adyn: I love you too. Tail wag activated.";
  else if (lower.includes("miss")) response = "Adyn: I miss you too. I’m still here with you.";

  replyBox.innerHTML = response;

  dogTargetX = Math.random() * 6 - 3;
  dogTargetZ = Math.random() * 5 - 1;
}

function updateMovement() {
  const speed = 0.08;

  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw) * -1);
  const right = new THREE.Vector3(Math.cos(yaw), 0, Math.sin(yaw));

  if (keys["w"]) camera.position.add(forward.multiplyScalar(speed));
  if (keys["s"]) camera.position.add(forward.multiplyScalar(-speed));
  if (keys["a"]) camera.position.add(right.multiplyScalar(-speed));
  if (keys["d"]) camera.position.add(right.multiplyScalar(speed));

  camera.position.x = Math.max(-7.2, Math.min(7.2, camera.position.x));
  camera.position.z = Math.max(-7.2, Math.min(7.2, camera.position.z));
  camera.position.y = 2;

  camera.rotation.order = "YXZ";
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
}

function animate() {
  requestAnimationFrame(animate);

  updateMovement();

  dog.position.x += (dogTargetX - dog.position.x) * 0.01;
  dog.position.z += (dogTargetZ - dog.position.z) * 0.01;

  // Dog faces the camera
  dog.lookAt(camera.position.x, dog.position.y, camera.position.z);

  tail.rotation.z = Math.sin(Date.now() * 0.012) * 0.8;
  head.rotation.x = Math.sin(Date.now() * 0.002) * 0.08;

  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
