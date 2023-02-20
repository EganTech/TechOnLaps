const https = require('https');
const http = require('http');
const express = require('express');
const path = require("path");
const paypal = require('paypal-rest-sdk');
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
var multer = require('multer'); //used to load file
var fs = require('fs');
var pg = require('pg');

//configure paypal
paypal.configure({
    'mode' : 'sandbox',
    'client_id' : process.env.client_id,
    'client_secret' : process.env.client_secret
})

const pay1 = {}
const pay2 = {}
const pay1Desc = ""
const pay2Desc = ""

//database object - pools ,, superuser, and users
let user = {
    user: 'vuser',
    host: 'localhost',
    database: 'vorreiter_db',
    password: 'vUser2022',
    port: '5432'
}

let superUser = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'wallace1997',
    port: '5432'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname + '/public/images/'));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname + '/public/ids/'));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload1 = multer({ storage: storage }).single('photo')
var upload2 = multer({ storage: storage2 }).single('id')

var images = __dirname + "/public/images"; //hold images
if (!fs.existsSync(images)) {
    fs.mkdirSync(images)
}
var ids = __dirname + '/public/ids'
if(!fs.existsSync(ids)){
    fs.mkdirSync(ids)
}

function configureDatabase(){
    let superPool = new pg.Pool(superUser);
    superPool.query("CREATE DATABASE vorreiter_db", (err, res) => {
        superPool.query("CREATE USER vuser WITH password 'vUser2022'", (err, res) => {
            superPool.query("GRANT CONNECT ON DATABASE vorreiter_db TO vuser", (err, res) => {
                superPool.end();
                superUser.database = 'vorreiter_db';
                superPool = new pg.Pool(superUser);
                //create table
                superPool.query('CREATE TABLE IF NOT EXISTS profile (email VARCHAR PRIMARY KEY, fullname VARCHAR NOT NULL)', (err, res) =>{
                    superPool.query('CREATE TABLE IF NOT EXISTS catalog (id SERIAL PRIMARY KEY, propertyType INTEGER, listType INTEGER, rent VARCHAR, price VARCHAR, fees VARCHAR, county VARCHAR, area VARCHAR, street VARCHAR, coordinates VARCHAR, zipcode VARCHAR, propertyNumber VARCHAR, size VARCHAR, bedrooms VARCHAR, bathrooms VARCHAR, pool BOOLEAN, gym BOOLEAN, photo_url VARCHAR, id_url VARCHAR)', (err, res)=>{
                        superPool.query("CREATE TABLE payments IF NOT EXISTS (id VARCHAR PRIMARY KEY, fullname VARCHAR, transaction_code VARCHAR, date VARCHAR)", (err, res) =>{
                            superPool.query("GRANT INSERT, SELECT, UPDATE ON catalog TO vuser", (err, res) =>{
                                superPool.query("GRANT INSERT, SELECT, UPDATE ON profile TO vuser", (err, res) =>{
                                    superPool.query("GRANT USAGE, SELECT ON SEQUENCE catalog_id_seq TO vuser", (err, res) =>{
                                        if(err){
                                            console.log(err) 
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })   
}

configureDatabase()

//Route requests
app.post('/pay', (req, res) =>{
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method":"paypal"
        },
        "redirect_urls": {
            "return_url":"/success/"+ req.body.payType,
            "cancel_url": "/failed"
        },
        "transactions": [{
            "item_list": {
                "items": [
                    (req.body.payType == 1) ? pay1 : pay2
                ]
            },
            "amount": {
                "currency": "USD",
                "total" : (req.body.payType == 1) ? pay1.price : pay2.price
            },
            "description" : (req.body.payType == 1) ? pay1Desc : pay2Desc
        }]
    }

    paypal.payment.create(create_payment_json, function(err){
        if(err){
            throw err;
        }else {
            for(let i = 0; i < payment.links.length; i++){
                if(payment.links[i].rel === 'approval_url'){
                    res.redirect(payment.links[i].href)
                }
            }
        }
    })
})

app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    let payType = req.url.split("/")[1]
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": (payType == 1) ? pay1.price : pay2.price
          }
       }]
    };
    
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            //add the payment to the database here
            res.send('Success');
        }
    });
});

app.get('/health', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }
    res.status(200).send(data);
});

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname + "/public/main.html"));
})

app.get('/catalogPage', (req, res) =>{
    res.sendFile(path.join(__dirname + "/public/catalog.html"));
})

app.get('/listProperty', (req, res) =>{
    res.sendFile(path.join(__dirname + "/public/formB.html"));
})

app.get('/displayProperty', (req, res) =>{
    res.sendFile(path.join(__dirname + "/public/displayProperty.html"));
})

app.post('/propertyDetails', (req, res1) =>{
    let userPool = new pg.Pool(user);
    let SQL = "SELECT propertyType, listType, rent, price, fees, county, area, street, coordinates, zipcode, propertyNumber, size, bedrooms, bathrooms, pool, gym, photo_url FROM catalog WHERE id = $1"
    userPool.query(SQL, [req.body.itemid], (err, res) =>{
        let results = res.rows;
        userPool.end()
        for(let i in results){
            results[i].photo_url = '/images/' + results[i].photo_url
        }
        res1.end(JSON.stringify(results))
    })
})

app.post('/listProperty', (req, res1) =>{
    let userPool = new pg.Pool(user)
    let values = [req.body.pType, req.body.lType, req.body.rent, req.body.price, req.body.fees, req.body.county, req.body.area, req.body.street, req.body.coordinates, req.body.zipcode, req.body.pNo, req.body.size, req.body.bedrooms, req.body.bathrooms, req.body.pool, req.body.gym]
    userPool.query("INSERT INTO catalog (propertyType, listType, rent, price, fees, county, area, street, coordinates, zipcode, propertyNumber, size, bedrooms, bathrooms, pool, gym) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id", values, (err, res) =>{
        let result = []
        if(!err){
            result.push(res.rows[0].id);
        }else {
            console.log(err)
        }
        userPool.end()
        res1.end(JSON.stringify(result))
    })
})

app.post('/photo', (req, res1)=>{
    upload1(req, res1, function(err){
        let photoUrl = req.file.filename
        let userPool = new pg.Pool(user)
        userPool.query('UPDATE catalog SET photo_url = $1 WHERE id = $2', [photoUrl, req.body.itemid], (err, res)=>{
            let result = "1"
            if(err){
                console.log(err)
                result = "0"
            }
            userPool.end()
            res1.end(result)
        })
    })
})

app.post('/id', (req, res1)=>{
    upload2(req, res1, function(err){
        let idUrl = req.file.filename
        let userPool = new pg.Pool(user)
        userPool.query('UPDATE catalog SET id_url = $1 WHERE id = $2', [idUrl, req.body.itemid], (err, res)=>{
            let result = "1"
            if(err){
                console.log(err)
                result = "0"
            }
            userPool.end()
            res1.end(result)
        })
    })
})

app.post('/filter', (req, res1) => {
    let userPool = new pg.Pool(user);
    let pType = req.body.pType
    let values = []
    let SQL
    if(pType != 4) {
        SQL = "SELECT id, propertyType, photo_url, county, bedrooms, bathrooms, rent, size, price FROM catalog WHERE propertyType = $1" 
        values.push(req.body.pType)
    }else {
        SQL = "SELECT id, propertyType, photo_url, county, bedrooms, bathrooms, rent, size, price FROM catalog"
     }
    userPool.query(SQL, values, (err, res) =>{
        if(err) console.log(err)
        let results = res.rows;
        for(let i in results){
            results[i].photo_url = "/images/" + results[i].photo_url
        }
        res1.end(JSON.stringify(results));
        userPool.end()
    })
})

app.post('/search1', (req, res1) => {
    let userPool = new pg.Pool(user);
    let sql = "SELECT id, propertyType, photo_url, county, bedrooms, bathrooms, rent, price FROM catalog WHERE county ILIKE CONCAT ('%', $1::text, '%')"
    userPool.query(sql, [req.body.search], (err, res) => {
        for(let i in res.rows){
            res.rows[i].photo_url = "/images/" + res.rows[i].photo_url
        }
        res1.end(JSON.stringify(res.rows))
        userPool.end()
    })
})

app.post('/search2', (req, res1) => {
    let superPool = new pg.Pool(superUser)
    let pType = req.body.pType;
    let SQL;
    let values = []
    if(pType == 3){
        let c = 1;
        SQL = "SELECT id, photo_url, county, rent, price FROM catalog WHERE "
        if(req.body.county != ""){
            SQL += "county = $" + c
            c++
            values.push(req.body.county)
        }
        if(req.body.price != ""){   
            if(c > 1){
                SQL += " AND"
            }
            SQL += SQL += "price <= $" + c
            values.push(req.body.price)
        }
    }else {
        let c = 1;
        SQL = "SELECT id, photo_url, county, bedrooms, bathrooms, rent, price FROM catalog WHERE "
        console.log(req.body.county)
        if(req.body.county != ""){
            SQL += "county = $" + c
            c++
            values.push(req.body.county)
        }
        if(req.body.bedrooms != ""){
            if(c > 1){
                SQL += " AND"
            }
            SQL += "bedrooms = $" + c
            c++
            values.push(req.body.bedrooms)
        }
        if(req.body.bathrooms != ""){
            if(c > 1){
                SQL += " AND"
            }
            SQL += "bathrooms = $" + c
            c++
            values.push(req.body.bathrooms)
        }
        if(req.body.price != ""){   
            if(c > 1){
                SQL += " AND"
            }
            SQL += SQL += "price <= $" + c
            values.push(req.body.price)
        }
    }
    superPool.query(SQL, values, (err, res) =>{
        let results = []
        if(err){
            console.log(err)
        }else {
            results = res.rows;
            for(let i in results){
                results[i].photo_url = '/images/' + results[i].photo_url
            }
        }
        superPool.end()
        res1.end(JSON.stringify(results));
    })
})

//sendMail('', process.env.EMAILPASS, '', 'CUSTOMER INQUIRY', about)

function sendMail(sender, pass, receiver, subject, text){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: sender,
          pass: pass
        }
    });
      
    var mailOptions = {
        from: sender,
        to: receiver,
        subject: subject,
        text: text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        //email sent
    });
}

https.createServer(app).listen(443, () => {
    console.log('Https server started');
});

http.createServer(app).listen(80, () => {
    console.log('Http server started');
});