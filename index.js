const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(res, file, cb){
        cb(null, path.join(__dirname,'uploads'));
    },
    filename : function(res, file, cb ){
        cb(null, file.fieldname + '_' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
})
const size = 1*1024*1024;
const upload = multer({
        storage: storage,
        limits: {
            fileSize: size,
        },
        fileFilter: function(res, file, cb){
            const filetype = /png|jpeg|jpg/;
            const mimeType = filetype.test(file.mimetype);
            const ext = filetype.test(file.mimetype.split('/')[1]);
            if(mimeType && ext){
                return cb(null, true)
            }
            cb('file type must be in : ' + filetype + ' format');
        }
}).single('img')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/upload', (req, res) => {
    console.log(JSON.stringify(req.file));
    upload(req, res, function(err){
        if(err){
            res.send(err);
        }else{
            res.send('Your File: '+ JSON.stringify(req.file));
    }    
    })
})

app.listen(8000, () => { console.log('App listening... 8000 Port');})