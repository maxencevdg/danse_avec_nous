const URL = "./my_model/";
let model, webcam, ctx, labelContainer, maxPredictions;
let video;
let isPlaying = false;
let totalScore = 0;
let expectedPose = "";
let timecodes = [];
let bestScore = 0;
let poseValidated = false;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const size = 300;
  const flip = true;
  webcam = new tmPose.Webcam(size, 200, flip);
  await webcam.setup();
  await webcam.play();

  const canvas = document.getElementById("canvas");
  canvas.width = size;
  canvas.height = 200;
  ctx = canvas.getContext("2d");
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  video = document.getElementById("dance-video");

  // Load timecodes
  const response = await fetch("./video/timecodes.json");
  timecodes = await response.json();

  video.addEventListener("timeupdate", updateExpectedPose);
}

async function loop(timestamp) {
  if (isPlaying) {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  }
}

async function predict() {
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  const prediction = await model.predict(posenetOutput);

  let maxPrediction = prediction[0];
  for (let i = 1; i < maxPredictions; i++) {
    if (prediction[i].probability > maxPrediction.probability) {
      maxPrediction = prediction[i];
    }
  }

  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className +
      ": " +
      (prediction[i].probability * 100).toFixed(2) +
      "%";
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }

  if (isPlaying && maxPrediction.className === expectedPose) {
    // Mettre à jour le meilleur score pour la position actuelle
    if (maxPrediction.probability > bestScore) {
      bestScore = maxPrediction.probability;
    }
  }

  drawPose(pose);
}

function drawPose(pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  }
}

function updateExpectedPose() {
  const currentTime = video.currentTime;
  const currentMove = timecodes.find(
    (tc) => currentTime >= tc.startTime && currentTime <= tc.endTime
  );
  if (currentMove) {
    expectedPose = currentMove.expectedPose;
    poseValidated = false; // Réinitialiser la validation de la pose pour le nouvel intervalle
    bestScore = 0; // Réinitialiser le meilleur score pour la nouvelle position
  } else if (expectedPose && !poseValidated) {
    // Ajouter le meilleur score à la fin de l'intervalle de temps de la position
    totalScore += Math.round(bestScore * 100);
    document.getElementById("score-display").textContent =
      "Score: " + totalScore;
    poseValidated = true; // Marquer la pose comme validée
  } else {
    expectedPose = "";
  }
}

async function start() {
  if (!isPlaying) {
    isPlaying = true;
    await init();
    video.play();
    window.requestAnimationFrame(loop);
  }
}

function pause() {
  isPlaying = false;
  webcam.stop();
  video.pause();
}

function reset() {
  isPlaying = false;
  webcam.stop();
  video.pause();
  video.currentTime = 0;
  totalScore = 0;
  expectedPose = "";
  bestScore = 0;
  poseValidated = false;
  document.getElementById("score-display").textContent = "Score: 0";
  labelContainer.innerHTML = "";
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
}
