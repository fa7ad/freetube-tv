const path = require('path');
const { app, BrowserWindow, session } = require('electron');

const SMART_TV_UA = 'Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.2.1 Chr0me/38.0.2125.122 Safari/537.36 LG Browser/8.00.00(LGE; 60UH6550-UB; 03.00.15; 1; DTV_W16N); webOS.TV-2016; LG NetCast.TV-2013 Compatible (LGE, 60UH6550-UB, wireless)';


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
