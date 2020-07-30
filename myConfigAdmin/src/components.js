const {desktopCapturer, remote, BrowserWindow, app, ipcRenderer, session } = require('electron');
const {Menu, dialog, Notification} = remote;
const path = require('path');
const puppeteer = require('puppeteer');
const Database = require('./Database');



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
    const body = document.getElementById('tbody');
    let row = document.createElement('tr');
    let cell = document.createElement('td');
    let text = document.createTextNode('coucou');
    body.appendChild(row);
    row.appendChild(cell);
    cell.appendChild(text);
}