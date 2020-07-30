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

const fetchBtn = document.getElementById('fetchItems')
fetchBtn.onclick = e => {
    getAllProducts('processors');
};

const itemCounter = document.getElementById('itemCounter');

window.onload = async function(){
    
    if(sessionStorage.getItem('user_id')){
        document.getElementById('adminPanel').style.display = "block";
        document.getElementById('notConnected').style.display = "none";
        getGlobalStats();
    }else{
        document.getElementById('adminPanel').style.display = "none";
        //generateTable();
        getAllProducts('processors');
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

async function getAllProducts(type){
    const products = [];
    switch(type){
        case "processors":

            const urls = ['https://www.ldlc.com/informatique/pieces-informatique/processeur/c4300/?sort=1'];
            const allUrls = await getNumberOfPages(urls[0]);
            var counter = 0;
            for(const url of allUrls){
                urls.push('https://www.ldlc.com'+url);
            }
            for(url of urls){
                const productsOfUrl = await scrapeProducts(url);
                //db = new Database();
                //db.insertIntoDatabase(productsOfUrl);
                products.push(productsOfUrl);
            }
            for(var p of products){
                counter = counter + p.length;
            }
            console.log(products);
            itemCounter.innerText = "Items fetched : "+counter;
        break;
    }
    //remote.getCurrentWindow().reload();
}

async function scrapeProducts(url){
    //Lancement d'un naviguateur invisible
    const browser = await puppeteer.launch();
    //nouvel onglet
    const page = await browser.newPage();
    //redirection vers l'url
    await page.goto(url);

    const products = await page.evaluate(()=>{

        //Tout les selecteurs CSS
        const productName = 'div > div:nth-child(1) > div:nth-child(1) > h3:nth-child(1)';
        const productPrice = 'div > div:nth-child(4) > div:nth-child(1) > div:nth-child(1)';
        const productDesc = 'div > div:nth-child(1) > div:nth-child(1) > p:nth-child(2)';
        const productLink = 'div > div:nth-child(1) > div:nth-child(1) > h3:nth-child(1) > a:nth-child(1)';
        const productImg = 'div > a:nth-child(1) > img:nth-child(1)';

        //constante qui récupère la valeur de l'élement ciblé par le selecteur CSS
        const grabFromRow = (row, classname)=>row
        .querySelector(classname)
        .innerText
        .trim();

        const grabLinkFromRow = (row, classname)=>row
        .querySelector(classname)
        .getAttribute('href')
        .trim();

        const grabImgFromRow = (row, classname)=>row
        .querySelector(classname)
        .getAttribute('src')
        .trim();

        //selecteur CSS d'un produit
        const productRowSelector = '.listing-product ul:nth-child(1) > li.pdt-item';

        const data = [];

        //tableau contenant tout les produits retournés
        const productRows = document.querySelectorAll(productRowSelector);

        var cpt = 0;
        //pour chaque produit du tableau de produits, on ajoute dans data le nom, prix, desc, lien image du produit
        for(const li of productRows){
            data.push({
                name: grabFromRow(li, productName),
                desc: grabFromRow(li, productDesc),
                price: grabFromRow(li, productPrice),
                link: 'https://www.ldlc.com'+grabLinkFromRow(li, productLink),
                image: grabImgFromRow(li, productImg)
            })
            cpt = cpt+1;
        }
        return data;
    });
    return products;
}

async function getNumberOfPages(url){
    //Lancement d'un naviguateur invisible
    const browser = await puppeteer.launch();
    //nouvel onglet
    const page = await browser.newPage();
    //redirection vers l'url
    await page.goto(url);
    
    const pages = await page.evaluate(()=>{
    
        //selecteur CSS d'une page
        const productRowSelector = '.pagination li';
        
        //tableau contenant toutes les pages retournées
        const pages = document.querySelectorAll(productRowSelector);

        var data = [];

        for(const page of pages){
            //si une page contient une balise <a> (ce qui n'est pas le cas pour la page "active")
            if(page.contains(page.querySelector('.pagination li a'))){
                //si le tableau ne contient pas déjà le lien
                if(!data.includes(page.querySelector('.pagination li a').getAttribute('href'))){
                    data.push(page.querySelector('.pagination li a').getAttribute('href'));
                }
            }
        }
        return data;
    });
    return pages;
}

function getGlobalStats() {
    var API_TOKEN = 'iqB4SjZ8ozkYLuK6eBRh4oMYsfxhm4I2';
    const url = 'http://127.0.0.1:8000/components/1&2&3&4';
    const result = JSON.parse(fetchData(url));

    document.getElementById('component-processors').innerText = result[0];
    document.getElementById('component-RAM').innerText = result[1];
    document.getElementById('component-storage').innerText = result[2];
    document.getElementById('component-graphic-cards').innerText = result[3];
}

function fetchData(url){
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    return req.responseText;
}