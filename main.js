const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

  const {Tray, Menu} = electron




var ua = require("./libua.js");


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let trayIcon


const {ipcMain} = require('electron')
ipcMain.on('login', (event, arg) => {
  console.log(arg.email) // prints "ping"
    ua.login(arg.email, arg.password) 


  event.sender.send('resp', 'login')
})


function moveWindow(coord){
  console.log("Move Windows") // prints "ping"

     
  var screen = electron.screen.getPrimaryDisplay().workAreaSize
  console.log(screen) // prints "ping"

mainWindow.setPosition(screen.width - 400 , coord.y - 600)




}






ipcMain.on('getMat', (event, arg) => {
  console.log("GetMateriales") // prints "ping"
    ua.getMateriales(arg.idmat,arg.codasi) 


  event.sender.send('resp', 'mat')
})

ipcMain.on('scan', (event, arg) => {
  console.log("SCAN") // prints "ping"
    ua.scanMat(); 


  event.sender.send('scan', 'mat')
})


ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

function createWindow () {
  // Create the browser window.

  mainWindow = new BrowserWindow({width: 400, height: 600,skipTaskbar: true,    autoHideMenuBar: true/*, frame: false*/})
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })




  trayIcon = new Tray(path.join('','./resources/images/notepad.png'))


         const trayMenuTemplate = [
            {
               label: 'Empty Application',
               enabled: false
            },
            
            {
               label: 'Settings',
               click: function () {
                  console.log("Clicked on settings")
               }
            },
            
            {
               label: 'Help',
               click: function () {
                  console.log("Clicked on Help")
               }
            }
         ]
         
         let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
         trayIcon.setContextMenu(trayMenu)
                  console.log(trayIcon.getBounds());

                    trayIcon.on('click', function handleClicked () {
                      console.log('Tray clicked');
                      console.log(electron.screen.getCursorScreenPoint());
                      moveWindow(electron.screen.getCursorScreenPoint());
                        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
                        mainWindow.setSkipTaskbar(true);


                    });




}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.




