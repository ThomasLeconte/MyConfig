const {desktopCapturer, remote, BrowserWindow, app, ipcRenderer } = require('electron');
const {Menu, dialog, Notification} = remote;
const path = require('path');
const puppeteer = require('puppeteer');
const Database = require('./Database');


const closeBtn = document.getElementById('closeWindow')
closeBtn.onclick = e => {
    ipcRenderer.send('log-error');
    remote.getCurrentWindow().hide();
};