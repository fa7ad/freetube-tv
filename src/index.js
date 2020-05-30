const path = require('path');
const { app, BrowserWindow, session } = require('electron');

const SMART_TV_UA = 'iTunes-AppleTV/4.1';

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 740,
    icon: path.resolve('./assets/icon.png')
  });

  mainWindow.loadURL('https://www.youtube.com/tv');

  const filter = {
    urls: ['*://*.youtube.com/*']
  }

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['User-Agent'] = SMART_TV_UA;
    callback({ requestHeaders: details.requestHeaders })
  })

  // mainWindow.webContents.openDevTools();
  mainWindow.webContents.executeJavaScript(`
  for (let event_name of ["visibilitychange", "webkitvisibilitychange", "blur"]) {
    window.addEventListener(event_name, function(event) {
      event.stopImmediatePropagation();
    }, true);
  }`, true, _ => {
    console.log('Enjoy FreeTube TV')
  })
};

app.allowRendererProcessReuse = true;
app.userAgentFallback = SMART_TV_UA;

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
