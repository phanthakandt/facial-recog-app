const video = document.getElementById('video')
const canv = document.getElementById('canv')
const image = document.getElementById('imageEjs')
image.style.display = 'none'

var img = new Image()
var script = document.querySelector('#getNames').innerHTML
var beforeSplit = script.substr(20,script.length-26)

var names = beforeSplit.split('\\",\\"')
console.log(names)


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
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
                image.src = img
                
                
              },1500)
            clearInterval(findFace)
        }
        /*const resizedDetections = faceapi.resizeResults(detections,displaySize)
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceapi.draw.drawDetections(canvas,resizedDetections)*/
    },100)
    
})

video.addEventListener('pause',async ()=>{
    //console.log(names)
    const labeledFaceDescriptors = await loadLabeledImages(names)
    const displaySize = { width: image.width, height: image.height }
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors,0.6)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const result = resizedDetections.map(d=> faceMatcher.findBestMatch(d.descriptor))
    console.log(result.toString())
  })

function loadLabeledImages(namelist) {
  //const labels = ['phanthakan tunvichai']
  return Promise.all(
    namelist.map(async label => {
      const descriptions = []
      for(let i = 1; i<=2; i++){
        //console.log(label)
        const img = await faceapi.fetchImage(`/${label}/1.jpg`)
        //console.log('ok got that img')
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }     

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}