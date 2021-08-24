//******************************* create dB ******************************************
let request = indexedDB.open("camera", 1); //instruction to open a db if there or to make new db
let db;

request.onsuccess = function (e) {
     db = request.result; //when the request is accepted db we store it on db
	// let note = {
	//     nId: "jfbuverufv",
	//     txt: "hello i am anubha"
	// }

	// let tx = db.transaction("gallery", "readwrite");
	// let store = tx.objectStore("gallery"); //permission to access gallery
	// store.add(note);
};

request.onerror = function () {
	console.log("error");
};

//**************************** add store ********************************************
request.onupgradeneeded = function (e) {  // this function runs when you try to change versions and when ever db is made
	db = request.result;
	db.createObjectStore("gallery", { keyPath: "nId" }) // to create a new row an unique id is set by keypath and value of column 
};

//***************************** add transaction *************************************
function addData(type, data) {
	let tx = db.transaction("gallery", "readwrite"); //(store on which transaction is to be made , type of transaction)
	let store = tx.objectStore("gallery"); //fetch out gallery
	store.add({ nId: Date.now(), type: type, data: data });  //add in gallery
}

// function getData() {
// 	let tx = db.transaction('gallery', 'readonly');
// 	let store = tx.ObjectStore('gallery');

// 	let req = store.openCursor(); // request for cursor
// 	req.onsuccess;
// }
