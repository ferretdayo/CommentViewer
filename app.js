require('electron-debug')();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var login = require('./routes/login');

var webApp = express();

// Electron
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

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

const port = 3000;

webApp.listen(port, function() {
  console.log('App server started : http://localhost:' + port);
});

// メインウィンドウはGCされないようにグローバル宣言
var mainWindow = null;

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Electronの初期化完了後に実行
app.on('ready', function() {
    // メイン画面の表示。ウィンドウの幅、高さを指定できる
    mainWindow = new BrowserWindow({width: 800, height: 600, 'node-integration': false});
    //mainWindow.loadURL('file://' + __dirname + '/views/index.html');
    mainWindow.loadURL('http://127.0.0.1:' + port);
    // ウィンドウが閉じられたらアプリも終了
    mainWindow.webContents.openDevTools();
    
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

module.exports = webApp;
