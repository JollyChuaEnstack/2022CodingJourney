//To run this, right click index.htcl and click 'open with live server' 

const indexDB = 
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

const request = indexedDB.open("CarsDatabase", 1)

request.onerror = function (event) {
  console.error("An error occured with IndexedDB")
  console.error(event);
};

request.onupgradeneeded = function () {
    const db = request.result;
    const store = db.createObjectStore("cars", {keyPath: "id"});
    store.createIndex("cars_colour", ["colour"], { unique: false });
    store.createIndex("colour_and_make", ["colour", "make"], {
        unique: false,
    });
};

request.onsuccess = function () {
    const db = request.result
    const transaction = db.transaction("cars", "readwrite");

    const store = transaction.objectStore('cars');
    const colourIndex = store.index("cars_colour");
    const makeModelIndex = store.index("colour_and_make");

    store.put({ id: 1, colour: "Red", make: "Toyota"});
    store.put({ id: 2, colour: "Red", make: "Kia"});
    store.put({ id: 3, colour: "Green", make: "Honda"});
    store.put({ id: 4, colour: "Blue", make: "Honda"});
    store.put({ id: 5, colour: "Silver", make: "Ford"});
    
    //Finds via ID
    const idQuery = store.get(4);

    const colourQuery = colourIndex.getAll(["Red"]);

    const colourMakeQuery = makeModelIndex.get(["Blue", "Honda"]);
    

    idQuery.onsuccess = function () {
        console.log('idQuery', idQuery.result);
    };

    colourQuery.onsuccess = function () {
        console.log('colourQuery', colourQuery.result);
    };

    colourMakeQuery.onsuccess = function () {
        console.log('colurMakeQuery', colourMakeQuery.result);
    };

    transaction.oncomplete = function () {
        db.close();
    };
};