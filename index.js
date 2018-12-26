const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const pubkey = fs.readFileSync('public.pem');
const privatekey = fs.readFileSync('private.key'); 

//protected route
app.post("/user/add", verifyToken, function (req, res) {   
    jwt.verify(req.token, pubkey, (err, authData) => {
        if (err) {
            res.status(403).json({
                error: 'Forbidden'
            });
        } else {}
        res.json({
            authData,
            status: "user added"
        });
    });
});



app.post("/login", (req, res) => {
    const user = {
        id: 1,
        username: 'Chad',
    }
   
    jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: user        
    }, privatekey,{algorithm: 'RS256'}, (err, token) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                token
            })
        }
    });
});

//token format


function verifyToken(req, res, next) {
    //get auth header value
    const BearerHeader = req.headers['authorization']
    //check if barer is undefined
    if (typeof BearerHeader !== 'undefined') {
        const bearerToken = BearerHeader.split(' ')[1];
        req.token = bearerToken;
       
        next();
    } else {
        res.status(403).json({
            error: 'Forbidden'
        });
    }
}

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});