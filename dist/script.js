const video = document.getElementById('video')
const canv = document.getElementById('canv')

var img = new Image()


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
]).then(startVideo)

function startVideo() {
    navigator.mediaDevices.getUserMedia({video:true})
      .then((stream)=>{
        video.srcObject = stream
      }).catch((err)=>{
        console.log(err)
      })
  }

video.addEventListener('play',async ()=>{
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas,displaySize)
    var findFace = setInterval(async () =>{
        const detections = await faceapi.detectAllFaces(video, 
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
        
        if(detections.length != 0){
            setTimeout(()=>{
                video.pause()
                canv.style.display = 'none'
                canv.getContext("2d").drawImage(video,0,0)
                img = canv.toDataURL("image/png")
                
                
              },1500)
            clearInterval(findFace)
        }
        const resizedDetections = faceapi.resizeResults(detections,displaySize)
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceapi.draw.drawDetections(canvas,resizedDetections)
    },100)
    
})

video.addEventListener('pause',()=>{

    console.log(img)
})
