var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//　router
var routes = require('./routes/index');
var login = require('./routes/login');

var webApp = express();

// Port
const port = 3000;

// メインウィンドウはGCされないようにグローバル宣言
var mainWindow = null;

const https = require('https');
const fs = require('fs');

// 証明書のファイルを指定します
var options = {
    key: fs.readFileSync('./key/server_key.pem'),
    cert: fs.readFileSync('./key/cert.pem')
};

https.createServer(options, webApp).listen(port);

//HTTPヘッダのセキュリティ
//var helmet = require('helmet');

// Electron
const {app, Menu, BrowserWindow} = require('electron');

// ElectronのMenuの設定
const templateMenu = [
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo',
            },
            {
                role: 'redo',
            },
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click(item, focusedWindow){
                    if(focusedWindow) focusedWindow.reload()
                },
            },
            {
                type: 'separator',
            },
            {
                role: 'togglefullscreen',
            }
        ]
    },
];

const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);

// view engine setup
webApp.set('views', path.join(__dirname, 'views'));
webApp.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
webApp.use(logger('dev'));
webApp.use(bodyParser.json());
webApp.use(bodyParser.urlencoded({ extended: false }));
webApp.use(cookieParser());
webApp.use(express.static(path.join(__dirname, 'public')));

webApp.use(cookieParser());
webApp.use('/', login);
webApp.use('/viewer', routes);

//webApp.use(helmet());

// catch 404 and forward to error handler
webApp.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (webApp.get('env') === 'development') {
  webApp.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
webApp.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// webApp.listen(port, function() {
//     console.log('App server started : https://localhost:' + port);
// });

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('certificate-error', function(event, webContents, url, error, certificate, callback) {
  event.preventDefault();
  callback(true);
});

// Electronの初期化完了後に実行
app.on('ready', function() {
    // メイン画面の表示。ウィンドウの幅、高さを指定できる
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false
        }
    });
    //mainWindow.loadURL('file://' + __dirname + '/views/index.html');
    mainWindow.loadURL('https://localhost:' + port);

    // ウィンドウが閉じられたらアプリも終了
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
    mainWindow.webContents.openDevTools();
});

module.exports = webApp;
