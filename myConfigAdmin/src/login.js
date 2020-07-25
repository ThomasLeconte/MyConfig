const {desktopCapturer, remote, BrowserWindow, app, ipcRenderer } = require('electron');
const {Menu, dialog, Notification} = remote;
const path = require('path');
const puppeteer = require('puppeteer');
const Database = require('./Database');
//const fetch = require('electron-fetch');

const closeBtn = document.getElementById('closeWindow')
closeBtn.onclick = e => {
    ipcRenderer.send('log-error');
    remote.getCurrentWindow().close();
};

const loginBtn = document.getElementById('checkLogin');
loginBtn.onclick = e => {
    var login = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    checkConnexion(login, password);
}

function checkConnexion (login, password) {
    var API_TOKEN = 'iqB4SjZ8ozkYLuK6eBRh4oMYsfxhm4I2';
    const url = 'http://localhost/MyConfigApi/?token='+API_TOKEN+'&username='+login+'&password='+password;
    const result = JSON.parse(fetchData(url));
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