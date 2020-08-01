const {desktopCapturer, remote, BrowserWindow, app, ipcRenderer, session } = require('electron');
const {Menu, dialog, Notification} = remote;
const path = require('path');


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

const fetchBtn = document.getElementById('fetchItems')
fetchBtn.onclick = e => {
    getAllProducts('processors');
    getAllProducts('ram');
    getAllProducts('storage');
    getAllProducts('graphic-cards');
};

const itemCounter = document.getElementById('itemCounter');

window.onload = async function(){
    
    if(sessionStorage.getItem('user_id')){
        document.getElementById('adminPanel').style.display = "block";
        document.getElementById('notConnected').style.display = "none";
        getGlobalStats();
    }else{
        document.getElementById('adminPanel').style.display = "none";
    }
}

ipcRenderer.on('connected', (event, args) => {
    console.log(args);
    sessionStorage.setItem('user_id', args['id']);
    sessionStorage.setItem('user_name', args['username']);
    loginBtn.innerText = args["username"];
    registerBtn.setAttribute("style", "visibility: hidden;");
    document.getElementById('adminPanel').style.display = "block";
    document.getElementById('notConnected').style.display = "none";
})


/*========================================*/
/*============F U N C T I O N S===========*/
/*========================================*/

