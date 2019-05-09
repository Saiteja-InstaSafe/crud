const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const path = require("path");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/examples/dashboard.html');
});

app.get('/getPartners',(req,res) => {
    request('http://35.244.1.53:7678/console/partners/listall/page/0/size/100', {json: true}, (err, response, body) => {
        //console.log(body);
        res.send(body)

    })
});
app.post('/addPartners',(req,res)=>{

    //console.log(req)

    request.post({
        headers: {'content-type' : 'application/json'},
        url:     'http://35.244.1.53:7678/console/partners',
        body:    JSON.stringify(req.body)
    }, function(error, response, body){
        res.send(body)

    });

});


app.use('/', express.static(path.join(__dirname)));


app.listen(3030, () => console.log('Dashboard app listening on port 3030!'));

