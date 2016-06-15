var packager = require('electron-packager');
var config = require('./package.json');
 
packager({
    dir: './',
    out: '../dist',
    name: config.name,
    platform: 'win32,darwin',
    arch: 'x64',
    version: '0.37.7',
     
    'app-bundle-id': 'io.github.ferretdayo', //<- �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?
 
    'app-version': config.version,
    'helper-bundle-id': 'io.github.ferretdayo', //<- �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?
    overwrite: true,
    asar: true,
    prune: true,
    ignore: "node_modules/(electron-packager|electron-prebuilt|\.bin)|release\.js",
    'version-string': {
        CompanyName: 'ferretdayo',
        FileDescription: 'This is CommentViewer in NicoNico Broadcast',
        OriginalFilename: config.name,
        FileVersion: config.version,
        ProductVersion: config.version,
        ProductName: config.name,
        InternalName: config.name
    }
}, function done (err, appPath) {
    if(err) {
        throw new Error(err);
    }
    console.log('Done!!');
});
