let constraints = { video: true, audio: true };

let videoPlayer = document.querySelector('video');

let frame = document.querySelector('.frame');
frame.style['max-width'] = videoPlayer.offsetWidth + 'px';

let audioPlayer = document.querySelector('audio');
let recordBtn = document.querySelector('#record-video');
let captureBtn = document.querySelector('#click-picture');

let recordState = false;
let chunks = [];
let mediaRecorder;


// ============================ on click of zoom-in and zoom-out =============================
let zoom = 1;

let zoomIn = document.querySelector('.zoom-in');
zoomIn.addEventListener('click', function (){
	if (zoom < 2.5) {
		zoom += 0.1;
		videoPlayer.style.transform = `scale(${zoom})`;
	}
});

let zoomOut = document.querySelector('.zoom-out');
zoomOut.addEventListener('click', function () {
	if (zoom > 1) {
		zoom -= 0.1;
		videoPlayer.style.transform = `scale(${zoom})`;
	}
});

// ============================ on click record button function =============================
let timeInterval;
let second = 0;
let minute = 0;

recordBtn.addEventListener('click', function () {
	if (!recordState) {
		mediaRecorder.start();
		recordState = true;
		timeInterval = setInterval(() => {
			second++;
			if (second == 60) {
				minute++;
				second = 0;
			}
			if (minute < 10) {
				document.querySelector('.minute').innerText = '0' + minute;
			} else {
				document.querySelector('.minute').innerText = minute;
			}

			if (second < 10) {
				document.querySelector('.second').innerText = '0' + second;
			} else {
				document.querySelector('.second').innerText = second;
			}
		}, 1000);
		recordBtn.innerHTML = `<img style=" margin-right:12px" src="https://img.icons8.com/color/45/000000/stop.png"/> Stop`;
	} else {
		mediaRecorder.stop();
		recordState = false;
		clearInterval(timerInterval);
		second = 0;
		minute = 0;
		document.querySelector('.minute').innerText = '00';
		document.querySelector('.second').innerText = '00';
		recordBtn.innerHTML = ``;
	}
});

navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {

    videoPlayer.srcObject = mediaStream;
	audioPlayer.srcObject = mediaStream;

	mediaRecorder = new MediaRecorder(mediaStream); //tells the user what it has to record
	mediaRecorder.ondataavailable = function (e) {
		chunks.push(e.data);
	};

	mediaRecorder.onstop = function (e) {
		let blob = new Blob(chunks, { type: 'video/mp4' }); // blob is an object for storage and gave it mime type
		chunks = [];
		let blobUrl = URL.createObjectURL(blob); //made url for the blob
		addData("video", blobUrl);

		// let a = document.createElement("a");
		// a.href = blobUrl;
		// a.download = "temp.mp4"; // it will download it with file name this
		// a.click();
	};
});

// ============================ on click capture button function =============================
captureBtn.addEventListener("click", function () {
	capture();
})

let imageNumber = 1;

//=========================== capture an image function =====================
function capture() {
	let canvas = document.createElement("canvas");
	canvas.width = videoPlayer.videoWidth; // canvas is given width as that of videoPlayer
	canvas.height = videoPlayer.videoHeight;
	let ctx = canvas.getContext("2d");
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(zoom, zoom);
	ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
	ctx.drawImage(videoPlayer, 0, 0); //image will be drawn whatever there is on videoplayer
	if (filter != '') {
		ctx.fillStyle = filter;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	addData("image", canvas.toDataURL());
	let link = document.createElement("a");
	link.download = `img${imageNumber++}.png`; //whenver this link will download it will be saved with this name
	link.href = canvas.toDataURL(); //it will create link of that
	link.click();
}

let filter = "";

let allFilters = document.querySelectorAll('.filter');

for (let i of allFilters) {
	i.addEventListener('click', function (e) {
		filter = e.currentTarget.style.backgroundColor;
		addFilterToScreen(filter);
	});
}

function addFilterToScreen(filter) {
	let prevScreenFilter = document.querySelector('.screen-filter'); ///if already any filter remove it first
	if (prevScreenFilter) {
		prevScreenFilter.remove();
	}
	let filterScreen = document.createElement('div');
	filterScreen.classList.add('screen-filter');
	filterScreen.style.height = frame.offsetHeight + 'px';
	filterScreen.style.width = frame.offsetWidth + 'px';
	filterScreen.style.backgroundColor = filter;
    filterScreen.style.marginTop = ((window.innerHeight - frame.offsetHeight)/2) +'px';
	document.querySelector('.filter-screen-parent').append(filterScreen);
}

// navigator.mediaDevices.enumerateDevices().then(function(devices) {
//     console.log(devices);
// })

let showGallery = document.querySelector('show-gallery');

// //**********************show gallery on click of gallery icon ************************************
// showGallery.addEventListener('click', function (e) {
// 	let modal = document.createElement('div');
// 	modal.classList.add('modal');
// 	modal.innerHTML = ``;
// 	document.querySelector('body').append(modal);
// 	let closeModal = document.querySelector('.close-modal');
// 	closeModal.addEventListener('click', function (e) {
// 		modal.remove();
// 	});
// });
 