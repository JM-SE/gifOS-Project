 //
 //
 //
 let elapsedTime = document.getElementById('elapsedTime');
 const startRecordingButton = document.getElementById('startRecordingButton');
 const stopRecordingButton = document.getElementById('stopRecordingButton');
 const circleIcon = document.getElementById('circleIcon');
 const captureRepeat = document.getElementById('captureRepeat');
 const image = document.getElementById('gifBlock');
 const video = document.getElementById('videoPre');
 const captureUpload = document.getElementById('captureUpload');
 const captureTitleInner = document.getElementById('captureTitleInner');
 const captureCloseButton = document.getElementById('captureCloseButton');
 const cameraIcon = document.getElementById('cameraIcon');
 const progressBar = document.getElementById('progressBar');
 const apiKey = 'CclvPS0iGiXBUBKFuYeM47klAW0kINYG';
 const uploadURL = `https://upload.giphy.com/v1/gifs?api_key=${apiKey}`;
 const captureAtRecord = document.getElementById('captureAtRecord');
 const cancelUploadButton = document.getElementById('cancelUploadButton');
 const timeMsg = document.getElementById('timeMsg');
 const uploadSuccessButton = document.getElementById('uploadSuccessButton');
 const saveGifButton = document.getElementById('saveGifButton');
 const clipboardGifURLButton = document.getElementById('clipboardGifURLButton');
 const uploadingScreen = document.getElementById('uploadingScreen');
 const gifPrevSmall = document.getElementById('gifPrevSmall')
 const misGuifos = document.getElementById('misGuifos');
 let userColorPref = localStorage.getItem('darkMode');
 const logoNode = document.getElementById('logoNode');
 const linkDarkCSS = document.getElementById('linkDarkCSS');
 const navArrow = document.getElementById('navArrow');


 //
 // Check If Dark

 function checkIfDark() {
     if (userColorPref === 'enabled') {
         linkDarkCSS.href = 'styles/dark.css';
         logoNode.src = 'assets/gifOF_logo_dark.png';
         navArrow.style.filter = 'invert(100%)';
     }
 };

 //
 // Go To Index

 navArrow.addEventListener('click', () => {
     window.location = 'index.html';
 });

 captureCancelButton.addEventListener('click', () => {
     window.location = 'index.html';
 });

 //
 // Start Creating Gif

 captureStartButton.addEventListener('click', () => {
     captureImg.style.display = 'none';
     captureBody.style.display = 'none';
     captureButtons.style.display = 'none';
     video.style.display = 'block';
     captureCloseButton.style.display = 'block'

     const mobileWidth = window.matchMedia('(max-width: 600px)');
     if (mobileWidth.matches) {
         captureSection.style.height = '520px';
         captureSection.style.width = '450px';
     } else {
         captureSection.style.height = '548px';
         captureSection.style.width = '860px';
     }

     const tabletWidthA = window.matchMedia('(min-width: 601px)');
     const tabletWidthB = window.matchMedia('(max-width: 1024px)');
     if (tabletWidthA.matches && tabletWidthB.matches) {
         captureSection.style.height = '620px';
         captureSection.style.width = '720px';
     }

     document.getElementById('startRecordingButton').style.display = 'block';
     document.getElementById('cameraIcon').style.display = 'block';
     document.getElementById('captureTitleInner').innerHTML = 'Un Chequeo Antes de Empezar';

     getStream()
 });

 //
 // Stream On

 function getStream() {
     navigator.mediaDevices.getUserMedia({
             audio: false,
             video: {
                 height: 434,
                 width: 844,
             }
         })
         .then(function(camera) {
             video.srcObject = camera;
             video.play()
         })
 };

 //
 // Record Timer

 let date = new Date()
 date.setHours(00, 00, 00);


 //
 // Fx Grabar Gif

 let recorder = null;

 function recordGif(stream) {
     recorder = new RecordRTC(stream, {
         type: 'gif',
         frameRate: 1,
         quality: 10,
         onGifRecordingStarted: function() {
             console.log('Recording started')
         },
     });
     recorder.startRecording();
 }

 //
 // Start Recording

 let seconds;

 startRecordingButton.addEventListener('click', async() => {
     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
     recordGif(stream)

     document.getElementById('captureTitleInner').innerText = "Capturando tu guifo"
     document.getElementById('cameraIcon').style.display = 'none';
     startRecordingButton.style.display = 'none'
     elapsedTime.style.display = 'block'
     stopRecordingButton.style.display = 'block'
     circleIcon.style.display = 'flex';
     stopRecordingButton.disabled = false;

     let countSeconds = setInterval(function() {
         seconds = date.getSeconds()
         seconds++
         date.setSeconds(seconds)

         let dateTemplate = `0${date.getHours()}:0${date.getMinutes()}:0${date.getSeconds()}`
         elapsedTime.innerHTML = dateTemplate

         progressBar.max = seconds;

         stopRecordingButton.onclick = () => {
             clearInterval(countSeconds);
         }
     }, 1000);
 });

 //
 // Progress Bar

 let progressValue = 0;
 let clearIncrementSeconds;

 function incrementSeconds() {
     if (progressValue < seconds) {
         progressValue += 1;
         progressBar.value = progressValue;
     } else {
         progressValue = 0;
         incrementSeconds();
     }
 };


 //
 // Stop Recording

 let blob = null
 let url = ""

 stopRecordingButton.addEventListener('click', async() => {
     await recorder.stopRecording();
     blob = await recorder.getBlob();
     url = URL.createObjectURL(blob);

     video.style.display = "none"
     image.src = url
     image.style.display = "block"

     captureTitleInner.innerText = "Vista Previa"
     stopRecordingButton.style.display = 'none'
     captureUpload.style.display = 'block'
     captureRepeat.style.display = 'block'
     circleIcon.style.display = 'none';
     captureCloseButton.style.display = 'none'
     clearIncrementSeconds = setInterval(incrementSeconds, 1050);
     progressBar.style.display = 'block';
     playIcon.style.display = 'flex';

     const mobileWidth = window.matchMedia('(max-width: 768px)');
     if (mobileWidth.matches) {
         progressBar.style.display = 'none';
         playIcon.style.display = 'none';
     }
 });


 //
 // Repeat Capture

 captureRepeat.addEventListener('click', () => {
     captureTitleInner.innerText = "Un chequeo antes de empezar"
     date.setHours(00, 00, 00);
     elapsedTime.innerHTML = "0:0:0"
     elapsedTime.style.display = 'none'
     captureUpload.style.display = 'none'
     captureRepeat.style.display = 'none'
     startRecordingButton.style.display = 'block'
     cameraIcon.style.display = 'block'
     image.style.display = "none"
     video.style.display = "block"
     captureCloseButton.style.display = 'block'
     progressBar.style.display = 'none';
     playIcon.style.display = 'none';
     clearInterval(clearIncrementSeconds);
 });


 //
 // Upload Gif

 const controller = new AbortController();
 const signal = controller.signal;
 let intervalMsg = setInterval(randomMsg, 1000);

 captureUpload.addEventListener('click', () => {
     clearInterval(clearIncrementSeconds);
     captureTitleInner.innerHTML = 'Subiendo Guifo'
     uploadingScreen.style.display = "flex"
     cancelUploadButton.style.display = "block"
     captureUpload.style.display = 'none'
     captureRepeat.style.display = 'none'
     elapsedTime.style.display = 'none'
     video.style.display = "none"
     image.style.display = "none"
     captureCloseButton.style.display = 'block'
     progressBar.style.display = 'none';
     playIcon.style.display = 'none';

     setInterval(intervalMsg);

     let formData = new FormData();
     formData.append("file", blob, "myGif.gif");

     const options = {
         method: 'POST',
         body: formData,
         signal: signal
     };

     fetch(uploadURL, options)
         .then(response => {
             return response.json();
         })
         .then(json => {
             const gifObject = json;
             saveGif(gifObject.data.id);
             clearInterval(intervalMsg);

             const copyID = json.data.id;
             const getApiURL = `https://api.giphy.com/v1/gifs/${copyID}?api_key=${apiKey}&gif_id=${copyID}`;
             getGifURL(getApiURL);

             uploadingScreen.style.display = "none"
             cancelUploadButton.style.display = "none"
             captureTitleInner.innerHTML = 'Guifo subido con éxito!'
             uploadSuccessScreen.style.display = "grid"
             gifPrevSmall.src = url
         })
         .catch(error => {
             console.log(error)
         })
 });


 //
 // Cancel Upload

 cancelUploadButton.addEventListener('click', () => {
     controller.abort();
     console.log('Upload cancelled');
     uploadingScreen.style.display = "none"
     cancelUploadButton.style.display = "none"
     uploadSuccessScreen.style.display = "none"
     captureTitleInner.innerHTML = 'Vista Previa'
     uploadingScreen.style.display = "none"
     captureUpload.style.display = 'block'
     captureRepeat.style.display = 'block'
     elapsedTime.style.display = 'block'
     image.style.display = "block"
 });


 //
 // Copy To Clipboard Fx

 function clipboardCopy(text) {
     const hiddenTextArea = document.createElement("textarea");
     document.body.appendChild(hiddenTextArea);
     hiddenTextArea.value = text;
     hiddenTextArea.select();
     document.execCommand("copy");
     document.body.removeChild(hiddenTextArea);
 };

 //
 // Get Gif URL

 let createdGifURL;

 function getGifURL(url) {
     useRequest(url).then(response => {
         createdGifURL = response.data.url
     })
 };


 //
 // Copy Gif URL

 clipboardGifURLButton.addEventListener('click', () => {
     try {
         clipboardCopy(createdGifURL)
         clipboardGifURLButton.innerHTML = 'Enlace copiado con éxito!';
     } catch (e) {
         alert('Error al copiar el enlace');
     }
 });


 //
 // Save Gif To PC

 saveGifButton.addEventListener('click', () => {
     invokeSaveAsDialog(blob);
 });


 //
 // Upload Success

 uploadSuccessButton.addEventListener('click', () => {
     elapsedTime.innerHTML = "0:0:0"
     date.setHours(00, 00, 00);
     window.location = 'index.html';
 });


 //
 // Save Gifs To LocalStorage

 let arrayGifs = []

 function saveGif(gifID) {
     if (localStorage.getItem('arrayGifs') == null) {
         arrayGifs.push(gifID)
     } else {
         arrayGifs = localStorage.getItem('arrayGifs').split(',')
         arrayGifs.push(gifID)
     }

     localStorage.setItem('arrayGifs', arrayGifs.join())
 };


 //
 // Get Gifs From LocalStorage

 let savedGifs = localStorage.getItem('arrayGifs')
 const gifGetURL = `https://api.giphy.com/v1/gifs?api_key=${apiKey}&ids=${savedGifs}`;
 const misGuifosInnerText = document.getElementById('misGuifosInnerText');

 function getMyGifs(output) {
     if (savedGifs) {
         fetch(gifGetURL)
             .then(res => {
                 return res.json()

             }).then(response => {
                 appendGif(response, output)
             })
             .catch(error => {
                 console.log(error)
             })
     } else {
         misGuifosInnerText.innerHTML = 'Aún no creaste ningún Gifo!';
     }
 };


 //
 // Append Gif Fx

 function appendGif(response, output) {
     response.data.forEach(object => {
         const createdElement = document.createElement('img');
         output.appendChild(createdElement).src = object.images.fixed_height.url;
         createdElement.alt = object.title;
     })
 };

 //
 // Hover States

 function hoverWhenActiveOn(hoverOnElement, otherHover) {
     if (hoverOnElement === cameraIcon || hoverOnElement === startRecordingButton) {
         if (userColorPref === 'enabled') {
             hoverOnElement.style.background = '#CE36DB';
             otherHover.style.background = '#CE36DB';
         } else {
             hoverOnElement.style.background = '#e6bbe2';
             otherHover.style.background = '#e6bbe2';
         }
     } else if (hoverOnElement === circleIcon || hoverOnElement === stopRecordingButton) {
         hoverOnElement.style.background = 'rgb(207, 79, 79)';
         otherHover.style.background = 'rgb(207, 79, 79)';
     }
 };

 function hoverWhenActiveOff(hoverOffElement, otherHover) {
     if (hoverOffElement === cameraIcon || hoverOffElement === startRecordingButton) {
         if (userColorPref === 'enabled') {
             hoverOffElement.style.background = '#EE3EFE';
             otherHover.style.background = '#EE3EFE';
         } else {
             hoverOffElement.style.background = '#f7c9f3';
             otherHover.style.background = '#f7c9f3';
         }
     } else if (hoverOffElement === circleIcon || hoverOffElement === stopRecordingButton) {
         hoverOffElement.style.background = '#FF6161';
         otherHover.style.background = '#FF6161';
     }
 };


 //
 // Random Time Remaining

 function randomMsg() {
     const msgArray = ['Tiempo restante: Un segundo', 'Tiempo restante: 258 días', 'Tiempo restante: 14 años luz', 'Tiempo restante: Acercandose a un agujero negro', 'Tiempo restante: 144 zeptosegundos', 'Tiempo restante: 1633 años', 'Tiempo restante: Un montón', 'Tiempo restante: [Error: Server is not responding (500)]', 'Tiempo restante: Sube o no sube??'];
     timeMsg.innerHTML = msgArray[Math.floor(Math.random() * msgArray.length)];
 };

 //
 // Fetch Fx

 async function useRequest(url) {
     const response = await fetch(url);
     const json = await response.json();
     return json;
 };