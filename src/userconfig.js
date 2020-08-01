const {desktopCapturer, remote, BrowserWindow, app, ipcRenderer, session } = require('electron');
const {Menu, dialog, Notification} = remote;
const path = require('path');
const drivelist = require('drivelist');
const gpuInfo = require('gpu-info');
var os = require('os');

var userProc = document.getElementById('userconfig-proc');
var userRam = document.getElementById('userconfig-ram');
var userGraphic = document.getElementById('userconfig-graphic-cards')
var userStorage = document.getElementById('userconfig-storage');
var table = document.getElementById('userconfig-resume');
var globalPrice = document.getElementById('globalPrice');

window.onload = async function(){
    var components = await getConfig();
    components.forEach(comp =>{
        var row = document.createElement('tr');
        var nameCell = document.createElement('td');
        var name = document.createTextNode(comp.name);
        nameCell.setAttribute("style", "font-size:0.8em")
        var priceCell = document.createElement('td');
        var price = document.createTextNode('100€');
        priceCell.setAttribute("style", "font-size:0.8em;float:right;color:blue;border-bottom:none");
        priceCell.setAttribute("class", "component-price")
        nameCell.appendChild(name);
        priceCell.appendChild(price);
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        table.appendChild(row);
    });
    setGlobalPrice();
}

async function getConfig(){
    const components = [];
    
    //CPU
    var cpus = os.cpus();
    userProc.innerText = cpus.length+"x "+cpus[0].model;
    var comp1 = {'name':cpus[0].model}
    components.push(comp1);
    
    //RAM // 1 mb = 1048576 bytes  and 1GB = 1024Mb
    var ram = Math.round(((os.totalmem()/1048576)/1024));
    userRam.innerText =  ram + " Go available";
    var comp2 = {'name':ram+'Go'};
    components.push(comp2);

    //GPU
    gpuInfo().then(data => {
        data.forEach(gpu =>{
            var comp = {'name':gpu.Caption};
            components.push(comp);
            userGraphic.innerText = userGraphic.innerText + gpu.Caption + "\n";
        });
    });

    
    //STORAGE
    const drives = await drivelist.list();
    drives.forEach((drive) => {
        userStorage.innerText = userStorage.innerText + drive.description + ' (' + Math.round(((drive.size/1048576)/1024)) + ' GB)\n';
        var comp = {"name":drive.description};
        components.push(comp);
    });
    return components;
}

function setGlobalPrice(){
    var prices = document.querySelectorAll('.component-price');
    var price = 0;
    prices.forEach(p=>{
        price = price + parseInt(p.innerText.replace('€',''));
    });
    globalPrice.innerText = price+"€";
}