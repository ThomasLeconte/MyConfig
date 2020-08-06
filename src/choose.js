const {desktopCapturer, remote, BrowserWindow, app, ipcRenderer, session } = require('electron');
const {Menu, dialog, Notification} = remote;
const path = require('path');

var type = "";

ipcRenderer.send('getChosenType');
ipcRenderer.on('chooseType', function(event, args){
    type = args;
});

const closeBtn = document.getElementById('closeWindow')
closeBtn.onclick = e => {
    remote.getCurrentWindow().close();
};

const minimizeBtn = document.getElementById('minimizeWindow')
minimizeBtn.onclick = e => {
    remote.getCurrentWindow().minimize();
};

window.onload = async function(){
    showItems();
}


/*========================================*/
/*============F U N C T I O N S===========*/
/*========================================*/

function showItems(){
    switch(type){
        case "proc":
            var products = getProductsByCategory(1);
            break;
        case "ram":
            var products = getProductsByCategory(2);
            break;
        case "graphic-card":
            var products = getProductsByCategory(4);
            break;
        case "storage":
            var products = getProductsByCategory(3);
            break;

    }
    
    var ul = document.querySelector('ul');
    for(product in products){
        var product = products[product];

        var li = document.createElement('li');
        li.setAttribute('class', product.id);
        li.setAttribute('onclick', 'chooseElement('+product.id+')')

        var divCard = document.createElement('div');
        divCard.setAttribute('class', 'card');

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
        divCard.appendChild(divCardContent);
        divCardContent.appendChild(divContent);
        divContent.appendChild(columns);
        li.appendChild(divCard);
        ul.appendChild(li);
    }
}

function chooseElement(element){
    ipcRenderer.sendTo(1, 'choosenItem', element);
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