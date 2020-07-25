const {desktopCapturer, remote, BrowserWindow, app, ipcRenderer } = require('electron');
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

        //constante qui récupère la valeur de l'élement ciblé par le selecteur CSS
        const grabFromRow = (row, classname)=>row
        .querySelector(classname)
        .innerText
        .trim();

        //selecteur CSS d'un produit
        const productRowSelector = '.listing-product ul:nth-child(1) > li.pdt-item';

        const data = [];

        //tableau contenant tout les produits retournés
        const productRows = document.querySelectorAll(productRowSelector);

        //pour chaque produit du tableau de produits, on ajoute dans data le nom, prix, desc, lien image du produit
        for(const li of productRows){
            data.push({
                name: grabFromRow(li, productName),
                price: grabFromRow(li, productPrice)
            })
        }
        return data;
    });
    console.log(products);
    var db = new Database();
    //db.insertIntoDatabase(products);
}

window.onload = async function(){
    const url = 'https://www.ldlc.com/informatique/pieces-informatique/processeur/c4300/';
    //appel de la fonction pour scraper
    scrapeProducts(url);
}

ipcRenderer.on('connected', (event, args) => {
    console.log(args);
    loginBtn.innerText = args["username"];
    registerBtn.setAttribute("style", "visibility: hidden;");
})