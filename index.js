const fs          = require('fs');
const csv         = require('csv-parser');
const csvWriter   = require('csv-write-stream');
//rate limit one request per second. Otherwsie 
const throttle    = require('promise-ratelimit')(500); 

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');	

// Creates a client
const client = new vision.ImageAnnotatorClient();

async function getDetections(imageUrl) {
  const request = {
    image: {
      source: {imageUri: imageUrl}
    }
  };
  return new Promise(async function(resolve, reject){
    // Performs label detection on the image file
    const [result] = await client.logoDetection(request);
    // console.log(JSON.stringify(result))
    if (result){
      resolve (result.logoAnnotations)
    } else {
      reject(result)
    }
  })
}

const detectionWriter = csvWriter()
const errorWriter = csvWriter()
detectionWriter.pipe(fs.createWriteStream("detections.csv"))
errorWriter.pipe(fs.createWriteStream("error_log.csv"))

fs.createReadStream("frame_urls.csv")
  .pipe(csv())
  .on('data', function(row){
    throttle().then(function(){
      const getDetectionsPromise = getDetections(row.imageUrl)
      getDetectionsPromise.then(function(detections){
        detectionWriter.write({name: row.imageUrl, detections: JSON.stringify(detections)})
      }, function(err) {
        errorWriter.write({name: row.imageUrl, error: JSON.stringify(err)})
      }) 
    })
  })
  .on('end',function(){
      //some final operation
  });  
