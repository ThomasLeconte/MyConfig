const { app, BrowserWindow, ipcMain, session, remote, ipcRenderer } = require('electron');
const path = require('path');

app.allowRendererProcessReuse = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Index",
    transparent: true,
    frame: false,
    width: 1280,
    minWidth:1024,
    height: 720,
    resizable: false,
    webPreferences:{
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    icon: "src/img/icon.png"
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

ipcMain.on('openChooseWindow', function(event, args) {
    const chooseWindow = new BrowserWindow({
      title: "Choose",
      transparent: true,
      frame: false,
      width: 1280,
      minWidth:1024,
      height: 720,
      resizable: false,
      webPreferences:{
        nodeIntegration: true,
        enableRemoteModule: true,
      },
      icon: "src/img/icon.png"
    });
    chooseWindow.loadFile(path.join(__dirname, 'choose.html'));
    chooseWindow.webContents.openDevTools();
    chooseWindow.show();
    
});

var chosenType = "";

ipcMain.on('chooseType', function(event, args){
    chosenType = args;
});

ipcMain.on('getChosenType', function(event, args){
  event.sender.send('chooseType', chosenType);
});

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
