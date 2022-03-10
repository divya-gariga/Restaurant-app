import tablesData from "./tables.js";
import menuData from "./menu.js"
//inserting table data
document.getElementById("para1").innerHTML = "Rs." + tablesData[0]["bill"] + " " + "| Total items: " + tablesData[0]["itemCount"];
document.getElementById("para2").innerHTML = "Rs." + tablesData[1]["bill"] + " " + "| Total items: " + tablesData[1]["itemCount"];
document.getElementById("para3").innerHTML = "Rs." + tablesData[2]["bill"] + " " + "| Total items: " + tablesData[2]["itemCount"];

//rendering menus
createMenu();
function createMenu() {
    const menuPane = document.querySelector('#menuItems');
    let id = 0;
    menuData.forEach((data) => {
        const menuItem = document.createElement('li');

        menuItem.draggable = true;
        menuItem.ondragstart = function (event) {
            console.log("dragstart");
            let foodItemData = JSON.stringify(data);
            event.dataTransfer.setData("text", foodItemData);
        }

        const menuName = document.createElement('div');
        const price = document.createElement('span');
        const course = document.createElement('span');
        course.className = 'course';

        menuName.textContent = data["itemName"];
        price.textContent = data["price"] + "  ";
        course.textContent = data["course"];

        menuPane.appendChild(menuItem);
        menuItem.appendChild(menuName);
        menuItem.appendChild(price);
        menuItem.appendChild(course);
    }
    );
}

//drag and drop functionality
let table1 = document.getElementById("table1");
let myParam1 = "Table-1";
table1.addEventListener("click", () => { createModalVar(table1, myParam1) });
table1.ondragover = (event) => {
    event.preventDefault();
}
table1.ondrop = (event) => {
    event.preventDefault();
    console.log("ondrp");
    let data = event.dataTransfer.getData("text");
    let foodItemData = JSON.parse(data);
    let key = "Table-1"
    if (!sessionStorage.getItem(key)) {
        let value = [[]];
        value[0][0] = foodItemData["itemName"];
        value[0][1] = foodItemData["price"];
        value[0][2] = 1;
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    else {
        let oldOrderedData = JSON.parse(sessionStorage.getItem(key));
        let flag = 0;
        for (let i = 0; i < oldOrderedData.length; i++) {
            if (oldOrderedData[i][0] == foodItemData["itemName"]) {
                oldOrderedData[i][2] += 1;
                flag = 1;
            }
        }
        if (flag == 0) {
            let length = oldOrderedData.length;
            let newOrder = [foodItemData["itemName"], foodItemData["price"], 1];
            oldOrderedData.push(newOrder);
        }
        sessionStorage.setItem(key, JSON.stringify(oldOrderedData));
    }

    document.getElementById("para1").innerHTML = "Rs." + totalPrice(key) + " " + "| Total items: " + totalItems(key);
}


let table3 = document.getElementById("table3");
let myParam3 = "Table-3";
table3.addEventListener("click", () => { createModalVar(table3, myParam3) });
table3.ondragover = (event) => {
    event.preventDefault();
}
table3.ondrop = (event) => {
    event.preventDefault();
    console.log("ondrp");
    let data = event.dataTransfer.getData("text");
    let foodItemData = JSON.parse(data);
    let key = "Table-3";
    if (!sessionStorage.getItem(key)) {
        let value = [[]];
        value[0][0] = foodItemData["itemName"];
        value[0][1] = foodItemData["price"];
        value[0][2] = 1;
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    else {
        let oldOrderedData = JSON.parse(sessionStorage.getItem(key));
        let flag = 0;
        for (let i = 0; i < oldOrderedData.length; i++) {
            if (oldOrderedData[i][0] == foodItemData["itemName"]) {
                oldOrderedData[i][2] += 1;
                flag = 1;
            }
        }
        if (flag == 0) {
            let length = oldOrderedData.length;
            let newOrder = [foodItemData["itemName"], foodItemData["price"], 1];
            oldOrderedData.push(newOrder);
        }
        sessionStorage.setItem(key, JSON.stringify(oldOrderedData));

    }
    document.getElementById("para3").innerHTML = "Rs." + totalPrice(key) + " " + "| Total items: " + totalItems(key);
}


let table2 = document.getElementById("table2");
let myParam2 = "Table-2";
table2.addEventListener("click", () => { createModalVar(table2, myParam2) });
table2.ondragover = (event) => {
    event.preventDefault();
}
table2.ondrop = (event) => {
    event.preventDefault();
    console.log("ondrp");
    let data = event.dataTransfer.getData("text");
    let foodItemData = JSON.parse(data);
    let key = "Table-2";
    if (!sessionStorage.getItem(key)) {
        let value = [[]];
        value[0][0] = foodItemData["itemName"];
        value[0][1] = foodItemData["price"];
        value[0][2] = 1;
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    else {
        let oldOrderedData = JSON.parse(sessionStorage.getItem(key));
        let flag = 0;
        for (let i = 0; i < oldOrderedData.length; i++) {
            if (oldOrderedData[i][0] == foodItemData["itemName"]) {
                oldOrderedData[i][2] += 1;
                flag = 1;
            }
        }
        if (flag == 0) {
            let length = oldOrderedData.length;
            let newOrder = [foodItemData["itemName"], foodItemData["price"], 1];
            oldOrderedData.push(newOrder);
        }
        sessionStorage.setItem(key, JSON.stringify(oldOrderedData));

    }
    document.getElementById("para2").innerHTML = "Rs." + totalPrice(key) + " " + "| Total items: " + totalItems(key);
}

function totalPrice(table) {
    if (sessionStorage.getItem(table)) {
        let price = 0;
        let orders = JSON.parse(sessionStorage.getItem(table));
        for (let i = 0; i < orders.length; i++) {
            price += (orders[i][1] * orders[i][2]);
        }
        return price;
    } else {
        return 0;
    }
}

function totalItems(table) {
    if (sessionStorage.getItem(table)) {
        let items = 0;
        let orders = JSON.parse(sessionStorage.getItem(table));
        for (let i = 0; i < orders.length; i++) {
            items += orders[i][2];
        }
        return items;
    } else {
        return 0;
    }

}

function totalBill(table) {
    if (sessionStorage.getItem(table)) {
        let bill = 0;
        let orders = JSON.parse(sessionStorage.getItem(table));
        for (let i = 0; i < orders.length; i++) {
            bill += (orders[i][1] * orders[i][2]);
        }
        return bill;
    } else {
        return 0;
    }
}

let createModalVar = function createModal(element, table) {
    element.style.backgroundColor = "#ff9933";
    var modal = document.getElementById("myModal");
    let tableBody = document.querySelector('tbody');
    let billTag = document.getElementById('bill');
    var span = document.getElementsByClassName("close")[0];
    tableBody.innerHTML = "";
    document.getElementById('tableHeader').innerHTML = table + " |Order Details";
    if (sessionStorage.getItem(table)) {
        let orders = JSON.parse(sessionStorage.getItem(table));
        for (let i = 0; i < orders.length; i++) {
            let newRow = document.createElement('tr');
            let sno = document.createElement('td');
            let orderItem = document.createElement('td');
            let orderPrice = document.createElement('td');
            let noofItems = document.createElement('td');
            let orderDelete = document.createElement('button');

            sno.innerHTML = i + 1;
            orderItem.innerHTML = orders[i][0];
            orderPrice.innerHTML = orders[i][1];
            noofItems.innerHTML = orders[i][2];
            orderDelete.textContent = "Delete";

            tableBody.append(newRow);
            newRow.append(sno);
            newRow.append(orderItem);
            newRow.append(orderPrice);
            newRow.append(noofItems);
            newRow.append(orderDelete);

            orderDelete.addEventListener("click", () => { deleteItemVar(orderDelete, table, orders[i][0], newRow) });
        }

        billTag.textContent = "Total: " + totalBill(table) + ".00";
    }

    span.onclick = function () {
        modal.style.display = "none";
        element.style.backgroundColor = "white";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            element.style.backgroundColor = "white";
        }
    }
    let generateBillTag = document.getElementById('generateBill');
    generateBillTag.onclick = () => {
        alert("Your Total Bill is: " + totalBill(table));
        tableBody.innerHTML = "";
        billTag.textContent = "Total: 00";
        if (sessionStorage.getItem(table)) {
            sessionStorage.setItem(table, JSON.stringify([]));
        }
        if (table == "Table-1") {
            document.getElementById("para1").innerHTML = "Rs." + tablesData[0]["bill"] + " " + "| Total items: " + tablesData[0]["itemCount"];
        }
        else if (table == "Table-2") {
            document.getElementById("para2").innerHTML = "Rs." + tablesData[0]["bill"] + " " + "| Total items: " + tablesData[0]["itemCount"];
        }
        else {
            document.getElementById("para3").innerHTML = "Rs." + tablesData[0]["bill"] + " " + "| Total items: " + tablesData[0]["itemCount"];
        }


    };
    modal.style.display = "block";
}


let deleteItemVar = function deleteItem(element, table, eleToDelete, newRow) {
    if (sessionStorage.getItem(table)) {
        let orders = JSON.parse(sessionStorage.getItem(table));
        for (let i = 0; i < orders.length; i++) {
            if (orders[i][0] == eleToDelete) {
                orders.splice(i, 1);
                break;
            }
        }
        sessionStorage.setItem(table, JSON.stringify(orders));
        newRow.innerHTML = '';
        let billTag = document.getElementById('bill');
        billTag.textContent = "Total: " + totalBill(table) + ".00";
        if (table == "Table-1") {
            document.getElementById("para1").innerHTML = "Rs." + totalPrice(table) + " " + "| Total items: " + totalItems(table);
        }
        else if (table == "Table-2") {
            document.getElementById("para2").innerHTML = "Rs." + totalPrice(table) + " " + "| Total items: " + totalItems(table);
        }
        else {
            document.getElementById("para3").innerHTML = "Rs." + totalPrice(table) + " " + "| Total items: " + totalItems(table);
        }
    }
}

let searchTableVar = document.getElementById('searchTable');
searchTableVar.onkeyup = () => {
    let input, filter, ul, li, div, i, txtValue;
    input = document.getElementById('searchTable');
    filter = input.value.toUpperCase();
    ul = document.getElementById("tableItems");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        div = li[i].getElementsByTagName("div")[0];
        txtValue = div.textContent || div.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
};

let searchMenuVar = document.getElementById('searchMenu');
searchMenuVar.onkeydown = () => {
    let input, filter, ul, li, div, i, txtValue, txtValue1, span;
    input = document.getElementById('searchMenu');
    filter = input.value.toUpperCase();
    ul = document.getElementById("menuItems");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        div = li[i].getElementsByTagName("div")[0];
        span = li[i].getElementsByTagName('span')[1];
        txtValue = div.textContent || div.innerText;
        txtValue1 = span.textContent || span.innerHTML;
        console.log(txtValue + "   " + txtValue1);
        if ((txtValue.toUpperCase().indexOf(filter) > -1)) {
            li[i].style.display = "";
        } else {
            if ((txtValue1.toUpperCase().indexOf(filter) > -1))
                li[i].style.display = "";
            else
                li[i].style.display = "none";
        }
    }
};












// [document.querySelector("#table1"), document.querySelector("#table2"),
// document.querySelector("#table3")].forEach(item => {
//     item.addEventListener("dropover", event => {
//         event.preventDefault();
//         console.log("ondropover");
//     });
// });

// [document.getElementById("table1"), document.getElementById("table2"),
// document.getElementById("table3")].forEach(item => {
//     item.addEventListener("drop", event => {
//         event.preventDefault();
//         console.log("ondrop");
//     })
// });
