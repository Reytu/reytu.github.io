(function(){"use strict";

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
if (storageAvailable('localStorage')) {
    // Yippee! We can use localStorage awesomeness
}
  else {
    alert("Your browser does not support the Web Storage API. Some features may not work as intended.")
};

function getDelta(userDate) {
    let delta = Math.floor((userDate - new Date().setFullYear(userDate.getFullYear())) / (8.64 * Math.pow(10, 7))) + 1;
    if (delta < 0) {
        delta += 365;
    };
    return delta;
};

function add() {
    let name = document.getElementById("name").value;
    let date = document.getElementById("date").value; //2019-12-21
    date = date.split("-").map(numStr => parseInt(numStr));
    let newDate = new Date(date[0], date[1] - 1, date[2]);
    let n = localStorage.length;
    localStorage.setItem(n, [name, newDate, getDelta(newDate)]);
};
const button = document.getElementById("add");
button.addEventListener("click", add, false);

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let element of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(element);
        th.appendChild(text);
        row.appendChild(th);
    };
};

function generateTable(table) {
    for (let i = 0; i < localStorage.length; i++) {
        let row = table.insertRow();
        for (let j = 0; j < 3; j++) {
            let cell = row.insertCell();
            if (j === 1) {
                var text = document.createTextNode(new Date(localStorage.getItem(i).split(",")[j]).toLocaleString("en-GB").substring(10, 0));
            }
            else {
                text = document.createTextNode(localStorage.getItem(i).split(",")[j]);
            }
            cell.appendChild(text);
        }
    }
}

let table = document.querySelector("table");
let data = ["Name", "Birthday", "Days until birthday"];
if (localStorage.length > 0) {
    generateTableHead(table, data);
};
generateTable(table);
})();
