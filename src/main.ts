import {
  ArcRotateCamera,
  Color3,
  Color4,
  DirectionalLight,
  Engine,
  GlowLayer,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  SceneLoader,
  ShadowGenerator,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import './style.css';
import { gameStory, type StoryStep } from './story-data';

const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas')!;
const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const scene = new Scene(engine);
scene.clearColor = new Color4(0.018, 0.022, 0.09, 1);
scene.fogMode = Scene.FOGMODE_EXP2;
scene.fogDensity = 0.008;
scene.fogColor = new Color3(0.04, 0.055, 0.13);

const camera = new ArcRotateCamera('camera', -Math.PI / 2, 1.12, 18, new Vector3(0, 2, 2), scene);
camera.attachControl(canvas, true);
camera.lowerRadiusLimit = 11;
camera.upperRadiusLimit = 24;
camera.lowerBetaLimit = 0.75;
camera.upperBetaLimit = 1.35;
camera.wheelPrecision = 35;
camera.panningSensibility = 0;

const ambient = new HemisphericLight('ambient', new Vector3(-0.3, 1, 0.2), scene);
ambient.intensity = 0.75;
ambient.diffuse = new Color3(0.55, 0.63, 1);
ambient.groundColor = new Color3(0.16, 0.11, 0.22);

const sun = new DirectionalLight('sun', new Vector3(-0.55, -1, 0.35), scene);
sun.position = new Vector3(16, 24, -12);
sun.intensity = 2.25;
sun.diffuse = new Color3(1, 0.76, 0.52);
const shadows = new ShadowGenerator(2048, sun);
shadows.useBlurExponentialShadowMap = true;
shadows.blurKernel = 24;

const glow = new GlowLayer('glow', scene);
glow.intensity = 0.45;

function material(name: string, color: Color3, emissive?: Color3) {
  const result = new StandardMaterial(name, scene);
  result.diffuseColor = color;
  result.specularColor = new Color3(0.08, 0.08, 0.1);
  if (emissive) result.emissiveColor = emissive;
  return result;
}

const moonMat = material('moon-dust', new Color3(0.39, 0.37, 0.44));
moonMat.roughness = 1;
const darkDust = material('crater-shadow', new Color3(0.16, 0.15, 0.21));
const whiteSuit = material('suit', new Color3(0.92, 0.91, 0.86));
const visorMat = material('visor', new Color3(0.13, 0.22, 0.34), new Color3(0.03, 0.08, 0.14));
visorMat.specularColor = new Color3(0.95, 0.66, 0.25);
const goldMat = material('gold', new Color3(0.72, 0.33, 0.08), new Color3(0.08, 0.025, 0));
const metalMat = material('metal', new Color3(0.22, 0.25, 0.32));
const orangeMat = material('mission-orange', new Color3(1, 0.35, 0.08), new Color3(0.35, 0.045, 0));

const ground = MeshBuilder.CreateGround('lunar-surface', { width: 70, height: 70, subdivisions: 2 }, scene);
ground.material = moonMat;
ground.receiveShadows = true;

function createCrater(x: number, z: number, radius: number, depth = 0.16) {
  const hollow = MeshBuilder.CreateCylinder(`crater-${x}-${z}`, { diameter: radius * 1.48, height: 0.06, tessellation: 48 }, scene);
  hollow.position.set(x, 0.015, z);
  hollow.material = darkDust;
  const rim = MeshBuilder.CreateTorus(`rim-${x}-${z}`, { diameter: radius * 1.72, thickness: radius * depth, tessellation: 48 }, scene);
  rim.position.set(x, 0.07, z);
  rim.scaling.y = 0.35;
  rim.material = moonMat;
  rim.receiveShadows = true;
}

[
  [-10, -1, 2.8], [11, 5, 3.8], [-15, 10, 2.1], [15, -8, 1.8],
  [-5, -13, 1.5], [4, 14, 2.4], [19, 12, 3.2], [-20, -10, 2.6],
].forEach(([x, z, r]) => createCrater(x, z, r));

for (let i = 0; i < 36; i += 1) {
  const radius = 0.12 + ((i * 13) % 9) / 18;
  const rock = MeshBuilder.CreateIcoSphere(`rock-${i}`, { radius, subdivisions: 1 }, scene);
  rock.position.set(-27 + ((i * 11) % 54), radius * 0.58, -25 + ((i * 17) % 50));
  rock.rotation.set(i * 0.31, i * 0.57, i * 0.19);
  rock.scaling.y = 0.55;
  rock.material = i % 3 === 0 ? darkDust : moonMat;
  shadows.addShadowCaster(rock);
}

const starMat = material('stars', Color3.White(), new Color3(1, 0.9, 0.78));
for (let i = 0; i < 170; i += 1) {
  const star = MeshBuilder.CreateSphere(`star-${i}`, { diameter: 0.045 + (i % 5) * 0.018, segments: 4 }, scene);
  const angle = i * 2.399;
  const distance = 28 + (i % 9);
  star.position.set(Math.cos(angle) * distance, 5 + ((i * 19) % 20), Math.sin(angle) * distance);
  star.material = starMat;
}

const earthMat = material('earth', new Color3(0.13, 0.4, 0.9), new Color3(0.035, 0.14, 0.32));
const earth = MeshBuilder.CreateSphere('earth', { diameter: 4.4, segments: 48 }, scene);
earth.position.set(10, 16, -24);
earth.material = earthMat;
const cloudMat = material('clouds', new Color3(0.85, 0.9, 1), new Color3(0.12, 0.16, 0.22));
const cloudBand = MeshBuilder.CreateTorus('earth-clouds', { diameter: 3.65, thickness: 0.12, tessellation: 64 }, scene);
cloudBand.parent = earth;
cloudBand.rotation.x = 1.15;
cloudBand.material = cloudMat;

function box(name: string, size: { width: number; height: number; depth: number }, position: Vector3, mat: StandardMaterial, parent?: TransformNode) {
  const mesh = MeshBuilder.CreateBox(name, size, scene);
  mesh.position = position;
  mesh.material = mat;
  if (parent) mesh.parent = parent;
  shadows.addShadowCaster(mesh);
  return mesh;
}

function buildAstronaut() {
  const root = new TransformNode('astronaut-root', scene);
  root.position.set(-4.2, 0, 7);
  const torso = MeshBuilder.CreateCapsule('astronaut-torso', { height: 1.65, radius: 0.55, tessellation: 32 }, scene);
  torso.parent = root;
  torso.position.y = 1.72;
  torso.material = whiteSuit;
  shadows.addShadowCaster(torso);
  box('backpack', { width: 0.92, height: 1.25, depth: 0.45 }, new Vector3(0, 1.72, 0.43), whiteSuit, root);
  const helmet = MeshBuilder.CreateSphere('helmet', { diameter: 1.22, segments: 32 }, scene);
  helmet.parent = root;
  helmet.position.y = 2.75;
  helmet.material = whiteSuit;
  shadows.addShadowCaster(helmet);
  const visor = MeshBuilder.CreateSphere('visor', { diameter: 0.94, segments: 32, slice: 0.64 }, scene);
  visor.parent = root;
  visor.position.set(0, 2.75, -0.29);
  visor.rotation.x = -0.2;
  visor.material = visorMat;
  [-0.7, 0.7].forEach((x) => {
    const arm = MeshBuilder.CreateCapsule(`arm-${x}`, { height: 1.25, radius: 0.19 }, scene);
    arm.parent = root;
    arm.position.set(x, 1.7, 0);
    arm.rotation.z = x > 0 ? -0.16 : 0.16;
    arm.material = whiteSuit;
    shadows.addShadowCaster(arm);
    const leg = MeshBuilder.CreateCapsule(`leg-${x}`, { height: 1.2, radius: 0.24 }, scene);
    leg.parent = root;
    leg.position.set(x * 0.48, 0.63, 0);
    leg.material = whiteSuit;
    shadows.addShadowCaster(leg);
    box(`boot-${x}`, { width: 0.48, height: 0.25, depth: 0.68 }, new Vector3(x * 0.48, 0.15, -0.12), metalMat, root);
  });
  box('chest-panel', { width: 0.65, height: 0.45, depth: 0.12 }, new Vector3(0, 1.78, -0.53), metalMat, root);
  return root;
}

function buildLunarStation() {
  const root = new TransformNode('apollo-12-station', scene);
  root.position.set(1.8, 0, -6.5);
  const base = MeshBuilder.CreateCylinder('station-base', { diameter: 2.5, height: 1.35, tessellation: 8 }, scene);
  base.parent = root;
  base.position.y = 1.55;
  base.material = goldMat;
  shadows.addShadowCaster(base);
  const top = MeshBuilder.CreateCylinder('station-top', { diameterTop: 1.35, diameterBottom: 2.05, height: 1.2, tessellation: 8 }, scene);
  top.parent = root;
  top.position.y = 2.75;
  top.material = metalMat;
  shadows.addShadowCaster(top);
  box('station-panel', { width: 1.6, height: 0.75, depth: 0.12 }, new Vector3(0, 1.55, -1.08), orangeMat, root);
  [-1, 1].forEach((side) => {
    const strut = MeshBuilder.CreateCylinder(`strut-${side}`, { diameter: 0.12, height: 3.15, tessellation: 12 }, scene);
    strut.parent = root;
    strut.position.set(side * 1.35, 0.95, 0);
    strut.rotation.z = side * 0.72;
    strut.material = metalMat;
    shadows.addShadowCaster(strut);
    const foot = MeshBuilder.CreateCylinder(`foot-${side}`, { diameter: 0.75, height: 0.12, tessellation: 24 }, scene);
    foot.parent = root;
    foot.position.set(side * 2.2, 0.08, 0);
    foot.material = goldMat;
  });
  const antenna = MeshBuilder.CreateCylinder('antenna', { diameter: 0.08, height: 1.5 }, scene);
  antenna.parent = root;
  antenna.position.set(0.55, 3.85, 0);
  antenna.material = metalMat;
  const beacon = MeshBuilder.CreateSphere('beacon', { diameter: 0.28 }, scene);
  beacon.parent = root;
  beacon.position.set(0.55, 4.62, 0);
  beacon.material = orangeMat;
  return root;
}

const astronaut = buildAstronaut();
const proceduralAstronautParts = astronaut.getChildren().slice();
const station = buildLunarStation();

async function importSceneAsset(
  fileName: string,
  assetName: string,
  parent: TransformNode,
  targetSpan: number,
  rootUrl = '/models/kenney/',
) {
  const result = await SceneLoader.ImportMeshAsync('', rootUrl, fileName, scene);
  const importedRoot = result.meshes[0];
  importedRoot.name = assetName;
  importedRoot.computeWorldMatrix(true);
  const bounds = importedRoot.getHierarchyBoundingVectors(true);
  const dimensions = bounds.max.subtract(bounds.min);
  const largestDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);
  const assetScale = largestDimension > 0 ? targetSpan / largestDimension : 1;
  importedRoot.scaling.setAll(assetScale);
  importedRoot.computeWorldMatrix(true);
  const scaledBounds = importedRoot.getHierarchyBoundingVectors(true);
  importedRoot.position.y -= scaledBounds.min.y;
  importedRoot.parent = parent;

  for (const mesh of result.meshes) {
    mesh.receiveShadows = true;
    shadows.addShadowCaster(mesh);
  }
  return importedRoot;
}

async function loadKenneySceneAssets() {
  try {
    await importSceneAsset(
      'astronaut-poly-google.glb',
      'poly-google-astronaut',
      astronaut,
      1.9,
      '/models/poly/',
    );
    for (const part of proceduralAstronautParts) part.setEnabled(false);

    const environmentAssets = [
      { file: 'crater-large.glb', name: 'kenney-crater-a', position: new Vector3(-8, 0.01, 3), span: 4.2, rotation: 0.25 },
      { file: 'crater-large.glb', name: 'kenney-crater-b', position: new Vector3(10, 0.01, -11), span: 3.1, rotation: -0.4 },
      { file: 'rock.glb', name: 'kenney-rock-a', position: new Vector3(-6, 0, -5), span: 0.9, rotation: 0.7 },
      { file: 'rock.glb', name: 'kenney-rock-b', position: new Vector3(7, 0, 5), span: 0.7, rotation: -0.35 },
      { file: 'rocks-small.glb', name: 'kenney-rocks-small', position: new Vector3(3.5, 0, -1.5), span: 1.15, rotation: 1.1 },
    ];

    await Promise.all(environmentAssets.map(async (asset) => {
      const anchor = new TransformNode(`${asset.name}-anchor`, scene);
      anchor.position.copyFrom(asset.position);
      anchor.rotation.y = asset.rotation;
      await importSceneAsset(asset.file, asset.name, anchor, asset.span);
    }));
    document.documentElement.dataset.kenneyAssets = 'loaded';
  } catch (error) {
    console.error('Não foi possível carregar os recursos Kenney.', error);
    document.documentElement.dataset.kenneyAssets = 'fallback';
  }
}

void loadKenneySceneAssets();

async function loadOfficialNasaLunarModule() {
  try {
    const result = await SceneLoader.ImportMeshAsync(
      '',
      '/models/nasa/',
      'apollo-lunar-module.glb',
      scene,
    );
    const importedRoot = result.meshes[0];
    importedRoot.name = 'nasa-apollo-lunar-module';
    importedRoot.computeWorldMatrix(true);
    const initialBounds = importedRoot.getHierarchyBoundingVectors(true);
    const modelHeight = initialBounds.max.y - initialBounds.min.y;
    const modelScale = modelHeight > 0 ? 3.15 / modelHeight : 1;
    importedRoot.scaling.setAll(modelScale);
    importedRoot.computeWorldMatrix(true);
    const scaledBounds = importedRoot.getHierarchyBoundingVectors(true);
    importedRoot.position.y -= scaledBounds.min.y;
    importedRoot.parent = station;

    for (const mesh of result.meshes) {
      mesh.receiveShadows = true;
      shadows.addShadowCaster(mesh);
    }

    for (const child of station.getChildren()) {
      if (child !== importedRoot) child.setEnabled(false);
    }
    document.documentElement.dataset.nasaModel = 'loaded';
  } catch (error) {
    console.error('Não foi possível carregar o modelo oficial da NASA.', error);
    document.documentElement.dataset.nasaModel = 'fallback';
  }
}

void loadOfficialNasaLunarModule();

const discoveryRing = MeshBuilder.CreateTorus('discovery-ring', { diameter: 5.2, thickness: 0.06, tessellation: 64 }, scene);
discoveryRing.position.set(station.position.x, 0.12, station.position.z);
discoveryRing.material = orangeMat;

const keys = new Set<string>();
window.addEventListener('keydown', (event) => keys.add(event.key.toLowerCase()));
window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));

const intro = document.querySelector<HTMLElement>('#intro')!;
const startButton = document.querySelector<HTMLButtonElement>('#start-button')!;
const discoveryToast = document.querySelector<HTMLElement>('#discovery-toast')!;
const discoveryCard = document.querySelector<HTMLElement>('#discovery-card')!;
const investigateButton = document.querySelector<HTMLButtonElement>('#investigate-button')!;
const closeButton = document.querySelector<HTMLButtonElement>('#continue-button')!;
const prologueEyebrow = document.querySelector<HTMLElement>('#prologue-eyebrow')!;
const prologueTitle = document.querySelector<HTMLElement>('#prologue-title')!;
const prologuePages = document.querySelector<HTMLElement>('#prologue-pages')!;
const prologueMission = document.querySelector<HTMLElement>('#prologue-mission')!;
const encounterCopy = document.querySelector<HTMLElement>('#encounter-copy')!;
const storyTabs = document.querySelector<HTMLElement>('#story-tabs')!;
const storyPanel = document.querySelector<HTMLElement>('#story-panel')!;
const knowledgeScore = document.querySelector<HTMLElement>('#knowledge-score')!;
let gameStarted = false;
let found = false;
const completedSteps = new Set<string>();

prologueEyebrow.textContent = gameStory.prologue.eyebrow;
prologueTitle.innerHTML = `As histórias que<br /><em>ficaram na Lua.</em>`;
prologuePages.innerHTML = gameStory.prologue.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');
prologueMission.textContent = gameStory.prologue.mission;
encounterCopy.innerHTML = gameStory.firstDiscovery.encounter.map((paragraph) => `<p>${paragraph}</p>`).join('');

function updateKnowledgeScore() {
  const score = gameStory.firstDiscovery.steps
    .filter((step) => completedSteps.has(step.id))
    .reduce((total, step) => total + step.reward, 0);
  knowledgeScore.textContent = `${score} / 60 PONTOS`;
}

function openStoryStep(step: StoryStep, tab: HTMLButtonElement) {
  storyTabs.querySelectorAll('button').forEach((button) => button.classList.remove('active'));
  tab.classList.add('active');
  storyPanel.classList.remove('hidden');
  storyPanel.innerHTML = `
    <p class="story-reward">+${step.reward} PONTOS</p>
    <h3>${step.title}</h3>
    ${step.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}
    <div class="story-activity">
      <strong>${step.activity.prompt}</strong>
      <div class="story-options">${step.activity.options.map((option, index) => `<button data-option="${index}">${option}</button>`).join('')}</div>
      <p class="activity-feedback" aria-live="polite"></p>
    </div>`;

  storyPanel.querySelectorAll<HTMLButtonElement>('[data-option]').forEach((option) => {
    option.addEventListener('click', () => {
      const feedback = storyPanel.querySelector<HTMLElement>('.activity-feedback')!;
      if (Number(option.dataset.option) !== step.activity.correct) {
        feedback.textContent = 'Quase! Observe as pistas e tente novamente.';
        feedback.className = 'activity-feedback try-again';
        return;
      }
      completedSteps.add(step.id);
      option.classList.add('correct');
      feedback.textContent = `${step.activity.success} +${step.reward} pontos.`;
      feedback.className = 'activity-feedback success';
      tab.classList.add('complete');
      updateKnowledgeScore();
    });
  });
}

gameStory.firstDiscovery.steps.forEach((step) => {
  const tab = document.createElement('button');
  tab.innerHTML = `<span>${step.label}</span><small>+${step.reward}</small>`;
  tab.addEventListener('click', () => openStoryStep(step, tab));
  storyTabs.appendChild(tab);
});

startButton.addEventListener('click', () => {
  intro.classList.add('hidden');
  gameStarted = true;
  canvas.focus();
});

investigateButton.addEventListener('click', () => {
  discoveryToast.classList.add('hidden');
  discoveryCard.classList.remove('hidden');
});

closeButton.addEventListener('click', () => discoveryCard.classList.add('hidden'));

scene.onBeforeRenderObservable.add(() => {
  earth.rotation.y += 0.0008;
  discoveryRing.rotation.y += 0.012;
  discoveryRing.scaling.setAll(1 + Math.sin(performance.now() / 500) * 0.04);
  if (!gameStarted || !discoveryCard.classList.contains('hidden')) return;
  const direction = new Vector3(
    (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0),
    0,
    (keys.has('s') || keys.has('arrowdown') ? 1 : 0) - (keys.has('w') || keys.has('arrowup') ? 1 : 0),
  );
  if (direction.lengthSquared() > 0) {
    direction.normalize();
    astronaut.position.addInPlace(direction.scale(0.075));
    astronaut.position.y = Math.abs(Math.sin(performance.now() / 115)) * 0.055;
    astronaut.position.x = Math.max(-25, Math.min(25, astronaut.position.x));
    astronaut.position.z = Math.max(-25, Math.min(25, astronaut.position.z));
    // O modelo Poly considera o eixo frontal oposto ao usado pela movimentação.
    astronaut.rotation.y = Math.atan2(direction.x, direction.z) + Math.PI;
    camera.target = Vector3.Lerp(camera.target, astronaut.position.add(new Vector3(0, 1.5, 0)), 0.045);
  } else {
    astronaut.position.y *= 0.82;
  }
  if (!found && Vector3.Distance(astronaut.position, station.position) < 7.5) {
    found = true;
    discoveryToast.classList.remove('hidden');
  }
});

engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());
