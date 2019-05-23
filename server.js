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

app.get('/getTenants/:id',(req,res) => {
    request(`http://35.244.1.53:7678/console/tenants/listby/partner/${req.params.id}/page/0/size/10`, {json: true}, (err, response, body) => {
        //console.log(body);
        res.send(body)

    })
});
app.post('/addPartners',(req,res)=>{
//res.sendStatus(200)
    //console.log(req)

    request.post({
        headers: {'content-type' : 'application/json'},
        url:     'http://35.244.1.53:7678/console/partners',
        body:    JSON.stringify(req.body)
    }, function(error, response, body){
        res.send(body)

    });




});
app.post('/addTenants',(req,res)=>{


    request.post({
        headers: {'content-type' : 'application/json'},
        url:     'http://35.244.1.53:7678/console/tenants',
        body:    JSON.stringify(req.body)
    }, function(error, response, body){
        res.send(body)

    });




});


app.post('/deletePartner',(req,res)=>{
    console.log('http://35.244.1.53:7678/console/partners/'+req.body.id);
    var url = 'http://35.244.1.53:7678/console/partners/'+req.body.id;
    request.delete(url,{},(err,response,body) =>{
        console.log(response)
    });

});

app.post('/deleteTenant',(req,res)=>{
    console.log('http://35.244.1.53:7678/console/tenants/'+req.body.id);
    var url = 'http://35.244.1.53:7678/console/tenants/'+req.body.id;
    request.delete(url,{},(err,response,body) =>{
        console.log(response)
    });

});



app.use('/', express.static(path.join(__dirname)));


app.listen(3030, () => console.log('Dashboard app listening on port 3030!'));

