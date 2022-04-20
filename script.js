const video = document.getElementById('video')
// get models for detections 
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)
// init the video for detection
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream, // by webcam stream 
    err => console.error(err) // send console error if ...
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video) // create the canvas for detection 
  document.body.append(canvas) // add to the HTML canvas 
  const displaySize = { width: video.width, height: video.height } // set the size of display used 
  faceapi.matchDimensions(canvas, displaySize) // fit to display size , see the displaySize definition 
  setInterval(async () => {
    // create detection
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    // resize it 
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // draw rectangle 
    faceapi.draw.drawDetections(canvas, resizedDetections)
    // draw face with dots and lines 
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})