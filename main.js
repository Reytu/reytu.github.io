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
    };
};
function checkStorage() {
    if (storageAvailable('localStorage')) {

    }
    else {
    alert("Your browser does not support the Web Storage API. Some features may not work as intended.")
    };
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
    if (name.length == 0 || date.length == 0) {

    }
    else {
        date = date.split("-").map(numStr => parseInt(numStr));
        let newDate = new Date(date[0], date[1] - 1, date[2]);
        let n = localStorage.length;
        localStorage.setItem(n, [name, newDate, getDelta(newDate)]);
    };
};

function clear() {
    localStorage.clear();
    let table = document.getElementById("table1");
    let parent = table.parentElement;
    parent.removeChild(table);
};

function edit() {
    let x = this.parentNode.parentNode.rowIndex;
    let table = document.getElementById("table1");
    let rowid = table.rows[x].id;
    let key = rowid.split("-")[1]
    function showModal() {
        let modal = document.querySelector(".modal");
        let closeBtn = document.querySelector(".close-btn");
        modal.style.display = "block";
        closeBtn.addEventListener("click", function() {modal.style.display = "none"}, false);
        window.onclick = function(e){
            if(e.target == modal){
              modal.style.display = "none"
            };
        };
    };
    function confirmEdit() {
        let name = document.getElementById("editName").value;
        let date = document.getElementById("editDate").value;
        if (name.length == 0 || date.length == 0) {

        }
        else {
            date = date.split("-").map(numStr => parseInt(numStr));
            var newDate = new Date(date[0], date[1] - 1, date[2]);
        };
        localStorage[key] = [name, newDate, getDelta(newDate)]
    };
    showModal();
    const confirm = document.getElementById("confirm");
    confirm.addEventListener("click", confirmEdit, false)

};

function remove() {
    let x = this.parentNode.parentNode.rowIndex;
    let table = document.getElementById("table1");
    let id = table.rows[x].id;
    for (let i of Object.entries(localStorage)) {
        let key = i[0];
        if (id == "row-" + key) {
            document.getElementById(id).remove();
            localStorage.removeItem(key);
    };
    if (localStorage.length == 0) {
        table.parentElement.removeChild(table);
    };
    };
};

function buttons() {
    const clearButton = document.getElementById("clear");
    const addButton = document.getElementById("add");
    addButton.addEventListener("click", add, false);
    clearButton.addEventListener("click", clear, false);
};

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let element of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(element);
        th.appendChild(text);
        row.appendChild(th);
        if (element == "Days until birthday") {
            th.className = "delta";
        };
    };
};

function generateTable(table) {
    let keys = []
    for (let i of Object.entries(localStorage)) {
        let key = i[0];
        keys.push(key)
    };
    keys.sort()
    console.log(keys)
    for (let i = 0; i < keys.length; i++) {
        let row = table.insertRow();
        row.id = "row-"+ i;
        for (let j = 0; j < 5; j++) {
            let cell = row.insertCell();
            if (j === 0) {
                text = document.createTextNode(localStorage.getItem(keys[i]).split(",")[0]);
            }
            else if (j === 1) {
                var text = document.createTextNode(new Date(localStorage.getItem(keys[i]).split(",")[j]).toLocaleString("en-GB").substring(10, 0));
            }
            else if (j === 2) {
                text = document.createTextNode(localStorage.getItem(keys[i]).split(",")[j]);
                cell.className = "delta"
            }
            else if (j === 3) {
                text = new Image();
                text.src = "https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/1460699381574330920-64.png";
                text.alt = "Edit";
                text.className = "edit";
                text.id = "edit-" + i;
                text.addEventListener("click", edit, false);
            }
            else if (j == 4) {
                text = new Image();
                text.src = "https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/21269369161530177266-64.png";
                text.alt = "Remove";
                text.className = "remove";
                text.id = "remove-" + i;
                text.addEventListener("click", remove, false);
            }
            else {
                text = document.createTextNode(localStorage.getItem(keys[i]).split(",")[j]);
            };
            cell.appendChild(text);

        };
    };
};

function table() {
    let table = document.getElementById("table1");
    let data = ["Name", "Birthday", "Days until birthday"];
    if (localStorage.length > 0) {
        generateTableHead(table, data);
    };
    generateTable(table);
};

checkStorage();
buttons();
table();
})();
