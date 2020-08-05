const {desktopCapturer, remote, BrowserWindow, app, ipcRenderer, session } = require('electron');
const {Menu, dialog, Notification} = remote;
const path = require('path');
const puppeteer = require('puppeteer');
const Database = require('./Database');
const { link } = require('fs');


const closeBtn = document.getElementById('closeWindow')
closeBtn.onclick = e => {
    remote.getCurrentWindow().close();
};

const minimizeBtn = document.getElementById('minimizeWindow')
minimizeBtn.onclick = e => {
    remote.getCurrentWindow().minimize();
};

const registerBtn = document.getElementById('registerBtn');

const loginBtn = document.getElementById('loginBtn')
loginBtn.onclick = e => {
    if(loginBtn.innerText == "Log in"){
        ipcRenderer.send('openLogin');
    }
};


window.onload = async function(){
    if(sessionStorage.getItem('user_id')){
        document.getElementById('adminPanel').style.display = "block";
        document.getElementById('notConnected').style.display = "none";
        loginBtn.innerText = sessionStorage.getItem('user_name');
        registerBtn.setAttribute("style", "visibility: hidden;");
        generateTable();
    }else{
        document.getElementById('adminPanel').style.display = "none";
    }
}



function generateTable(){
    getAllProducts();
    var allTbody = document.querySelectorAll('tbody');
    var products = [];
    for(body in allTbody){
        var thisBody = allTbody[body];
        if(thisBody.classList.contains('processors')){
            products = JSON.parse(sessionStorage.getItem('processors'));
        }else if(thisBody.classList.contains('graphic-cards')){
            products = JSON.parse(sessionStorage.getItem('graphic-cards'));
        }else if(thisBody.classList.contains('storage')){
            products = JSON.parse(sessionStorage.getItem('storage'));
        }else{
            products = JSON.parse(sessionStorage.getItem('ram'));
        }
        
        for(product in products){
            product = products[product];
            let row = document.createElement('tr');
            let idCell = document.createElement('td');
            let id = document.createTextNode(product.id);
            let titleCell = document.createElement('td');
            let title = document.createTextNode(product.title);
            let linkCell = document.createElement('td');
            let link = document.createTextNode(product.link);
            let priceCell = document.createElement('td');
            price = document.createTextNode(product.price);
            idCell.appendChild(id);
            titleCell.appendChild(title);
            linkCell.appendChild(link);
            priceCell.appendChild(price);
            row.appendChild(idCell);
            row.appendChild(titleCell);
            row.appendChild(linkCell);
            row.appendChild(priceCell);
            thisBody.appendChild(row);
        }
    }
}

function getProductsByCategory(category) {
    const url = 'http://127.0.0.1:8000/getcomponents/'+category;
    const result = JSON.parse(fetchData(url));
    return result;
}

function fetchData(url){
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    return req.responseText;
}

function getAllProducts(){
    if(!sessionStorage.getItem('processors')){
        const processors = getProductsByCategory(1);
        sessionStorage.setItem('processors', JSON.stringify(processors));
    }

    if(!sessionStorage.getItem('ram')){
        const ram = getProductsByCategory(2);
        sessionStorage.setItem('ram', JSON.stringify(ram));
    }

    if(!sessionStorage.getItem('storage')){
        const storage = getProductsByCategory(3);
        sessionStorage.setItem('storage', JSON.stringify(storage));
    }

    if(!sessionStorage.getItem('graphic-cards')){
        const graphicCards = getProductsByCategory(4);
        sessionStorage.setItem('graphic-cards', JSON.stringify(graphicCards));
    }
}