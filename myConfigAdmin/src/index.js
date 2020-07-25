const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron');
const path = require('path');
const { info } = require('console');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    transparent: true,
    frame: false,
    width: 1280,
    minWidth:1024,
    height: 720,
    resizable: false,
    webPreferences:{
      nodeIntegration: true,
      enableRemoteModule: true
    },
    backgroundColor: '#00FFFFFF'
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('log-error', () => {
  const options = {
    type: 'info',
    title: 'MyConfig - Erreur',
    message: 'Erreur ! Veuillez rapporter ce bug au développeur de l\'application.'
  }
  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options);
});

ipcMain.on('openLogin', ()=>{
    // and load the index.html of the app.
    var loginPage = new BrowserWindow({
        width: 500,
        height: 300,
        parent: BrowserWindow.getAllWindows()[0],
        frame: false,
        transparent: true,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    loginPage.loadFile(path.join(__dirname, 'login.html'));
    loginPage.webContents.openDevTools();
    loginPage.show();
});

/*ipcMain.on('connected', function(event, data) {
  console.log(data);
  console.log(BrowserWindow.getAllWindows());

  //SEND TO MAIN PAGE ACCOUNT CONNECTED
  //It's 1 because login became [0] because of focusing him.
  BrowserWindow.getAllWindows()[1].webContents.send('coucou');
});*/

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
