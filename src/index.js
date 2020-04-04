const path = require('path');
const { app, BrowserWindow, session } = require('electron');

const SMART_TV_UA = 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0) AppleWebKit/538.1 (KHTML, like Gecko) Version/5.0 NativeTVAds Safari/538.1';


if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 576,
    icon: path.resolve('./assets/icon.png')
  });

  mainWindow.loadURL('https://www.youtube.com/tv');

  const filter = {
    urls: ['*://*.youtube.com/tv*']
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
