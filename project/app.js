var express = require('express'),
    app = express(),
    fs = require('fs'),
    bodyParser = require('body-parser');

app.use(bodyParser);

app.get('*', function(request, response, nextRoute){
    
    var file = '.' + request.path;

    if (file === './') file = './index.html';

    fs.stat(file, function(error, info){
        if (error || ! info.isFile()) {
            nextRoute();
            return;
        }

        response.sendfile(file);
    });
});

app.get('/files', function(request, response){
    fs.readdir('./files', function(error, files){
        files = files.map(function(name){
            return {
                name: name
            };
        });
        response.send(files);
    });
});

app.delete('/files/:name', function(request, response){
    var name = request.param('name');
    fs.unlink('./files/' + name, function(error){
        response.send(error || name);
    });
});

app.all('/files/create', function(request, response){
    var name = request.param('name');
    fs.writeFile('./files/' + name, request.param('content'), function(error){
        response.send(error || name);
    });
});

app.listen(1333);

//region ================== Utils =====================================

(function(){
    var _send = app.response.__proto__.send;
    app.response.__proto__.send = function(value){
        if (value instanceof Error) {
            _send.call(this, 500, value);
        }
        else {
            _send.apply(this, arguments);
        }
    };
})();

//endregion ===========================================================