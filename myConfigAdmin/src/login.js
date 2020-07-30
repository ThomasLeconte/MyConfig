const {desktopCapturer, remote, BrowserWindow, app, ipcRenderer, session } = require('electron');
const {Menu, dialog, Notification} = remote;
const path = require('path');
const puppeteer = require('puppeteer');
const Database = require('./Database');
const { windowsStore } = require('process');
//const fetch = require('electron-fetch');

const closeBtn = document.getElementById('closeWindow')
closeBtn.onclick = e => {
    remote.getCurrentWindow().close();
};

const minimizeBtn = document.getElementById('minimizeWindow')
minimizeBtn.onclick = e => {
    remote.getCurrentWindow().minimize();
};

const loginBtn = document.getElementById('checkLogin');
loginBtn.onclick = e => {
    var login = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    checkConnexion(login, password);
}

function checkConnexion (login, password) {
    /*var API_TOKEN = 'iqB4SjZ8ozkYLuK6eBRh4oMYsfxhm4I2';
    const url = 'http://localhost/MyConfigApi/?token='+API_TOKEN+'&username='+login+'&password='+password;*/
    const url = 'http://127.0.0.1:8000/checkCredentials/'+login+'&'+password;
    const result = JSON.parse(fetchData(url));
    console.log(result);
    if(result['connected']){
        //SEND TO MAIN PAGE CONNECTED ALERT WITH ACCOUNT DATA IN PARAMETER
        ipcRenderer.sendTo(1, 'connected', result);
        remote.getCurrentWindow().close();
    }else{
        const options = {
            type: 'info',
            title: 'MyConfig - Login',
            message: 'Error ! Please check your credentials before try again.'
        }
        remote.dialog.showMessageBox(remote.BrowserWindow.getFocusedWindow(), options);
    }
}

function fetchData(url){
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    return req.responseText;
}