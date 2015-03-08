var http = require('http');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/browser', function(req, res) {
    http.get(
        {
            host: req.query.host,
            port: req.query.port,
            path: "/servers/Tankbot"
        }, function(_res) {
        var str = '';
        var raw = {};

        //another chunk of data has been recieved, so append it to `str`
        _res.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        _res.on('end', function () {
            // console.log("received: " + str);
            raw = JSON.parse(str);

            console.log("status code = " + _res.statusCode);

            var data = { motors: [], battery: 0 };

            // console.log(raw.entities)
            for (var i in raw.entities)
            {
                var props = raw.entities[i].properties;
                console.log("Found device " + props.id);
                if (props.type == "motor")
                {
                    console.log(props.id + " is a motor")
                    data.motors.push({ index: i, speed: props.speed });
                }
                else if (props.type == "battery")
                {
                    console.log(props.id + " is the battery");
                    data.battery = props.currentVoltage;
                }
            }

            res.render('browser', { host: req.query.host, port: req.query.port, data: data  });
        });
    }).on('error', function(e) {
        res.render('error', { error: e.message  });
    });
});

var server = app.listen(3001, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Controller app listening at http://%s:%s', host, port);

});