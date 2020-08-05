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

const chooseProc = document.getElementById('chooseProcessor')
chooseProc.onclick = e => {
    ipcRenderer.send('openChooseWindow');
    ipcRenderer.send('chooseType', 'proc');
};

const chooseRam = document.getElementById('chooseRam')
chooseRam.onclick = e => {
    ipcRenderer.send('openChooseWindow');
    ipcRenderer.send('chooseType', 'ram');
};

const chooseGraphicCard = document.getElementById('chooseGraphicCard')
chooseGraphicCard.onclick = e => {
    ipcRenderer.send('openChooseWindow');
    ipcRenderer.send('chooseType', 'graphic-card');
};

const chooseStorage = document.getElementById('chooseStorage')
chooseStorage.onclick = e => {
    ipcRenderer.send('openChooseWindow');
    ipcRenderer.send('chooseType', 'storage');
};

window.onload = async function(){
    //changeCard('proc', 2050);
    if(!sessionStorage.getItem('config')){
        var config = {'proc':'', 'ram':'', 'graphic-card':'','storage':''};
        sessionStorage.setItem('config', JSON.stringify(config));
    }
}

ipcRenderer.on('choosenItem', function(event, args){
    var config = JSON.parse(sessionStorage.getItem('config'));
    switch(sessionStorage.getItem('chooseType')){
        case "processor":
            config['proc'] = args;
            break;
        case "ram":
            config['ram'] = args;
            break;
        case "graphic-card":
            config['graphic-card'] = args;
            break;
        case "storage":
            config['storage'] = args;
            break;
    }
    sessionStorage.setItem('config', JSON.stringify(config));
    console.log(sessionStorage);
});

/*========================================*/
/*============F U N C T I O N S===========*/
/*========================================*/

function changeCard(cardType, productId){
    var card = document.querySelector('#container > div > div > div > div.column.is-two-thirds > div.card.processor');
    while (card.firstChild) {
        card.removeChild(card.lastChild);
    }

    var product = getProductById(productId);

    var divCardContent = document.createElement('div');
    divCardContent.setAttribute('class', 'card-content');

    var divContent = document.createElement('div');
    divContent.setAttribute('class', 'content');

    var columns = document.createElement('div');
    columns.setAttribute('class', 'columns');

    //IMG
    var column1 = document.createElement('div');
    column1.setAttribute('class', 'column');

    var img = document.createElement('img');
    img.setAttribute('src', product.img);
    img.setAttribute('width', '100px');
    img.setAttribute('height', '100px');

    //TITLE & DESC
    var column2 = document.createElement('div');
    column2.setAttribute('class', 'column is-two-thirds');

    var title = document.createElement('h1');
    var titleText = document.createTextNode(product.title);
    title.appendChild(titleText);

    var desc = document.createElement('p');
    var descText = document.createTextNode(product.desc);
    desc.appendChild(descText);

    //PRICE
    var column3 = document.createElement('div');
    column3.setAttribute('class', 'column');

    var price = document.createElement('p');
    priceText = document.createTextNode(product.price);
    price.appendChild(priceText);


    column1.appendChild(img);
    column2.appendChild(title);
    column2.appendChild(desc);
    column3.appendChild(price);
    columns.appendChild(column1);
    columns.appendChild(column2);
    columns.appendChild(column3);
    card.appendChild(divCardContent);
    divCardContent.appendChild(divContent);
    divContent.appendChild(columns);
}

function getProductById(id) {
    const url = 'http://127.0.0.1:8000/component/'+id;
    const result = JSON.parse(fetchData(url));
    return result;
}

function fetchData(url){
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    return req.responseText;
}

