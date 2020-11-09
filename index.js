const express = require('express');
const request = require('request');
const engine = require('ejs-locals');
const app = express();
const fs = require('fs');
const compression = require('compression');

app.use(compression());

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.json());

app.engine('ejs', engine);
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    res.render('index', {active: 0})
});

app.get("/data", (req, res) => {
    res.render('data', {active: 1})
});
app.get("/kontak", (req, res) => {
    res.render('kontak', {active: 2})
});
app.get("/faq", (req, res) => {
    res.render('faq', {active: 3})
});


app.get('/api', (req, res) => {
    request({
        url: "http://data.covid19.go.id/public/api/prov.json",
        json: true
    }, (err, reponse, body) => {
        let getSumut = body.list_data.filter((val) => {
            return val.key == "SUMATERA UTARA";
        });

        let rawdata = fs.readFileSync('./public/json/saveData.json');
        let pushdata = JSON.parse(rawdata);
        let last = pushdata.length - 1;
        let data_last = pushdata[last];
        
        if (getSumut[0].jumlah_kasus != data_last.jumlah_kasus ||
            getSumut[0].jumlah_sembuh != data_last.jumlah_sembuh ||
            getSumut[0].jumlah_meninggal != data_last.jumlah_meninggal ||
            getSumut[0].jumlah_dirawat != data_last.jumlah_dirawat) {
            
            let data_pasien = {
                date: body.last_date,
                jumlah_kasus: getSumut[0].jumlah_kasus,
                jumlah_sembuh: getSumut[0].jumlah_sembuh,
                jumlah_meninggal: getSumut[0].jumlah_meninggal,
                jumlah_dirawat: getSumut[0].jumlah_dirawat
            };
            
            pushdata.push(data_pasien);
            fs.writeFileSync('./public/json/saveData.json', JSON.stringify(pushdata, null, 2));
        }

        res.send(body);
    });
});

app.get('/api/local', (req, res) => {
    res.send(require('./public/json/data.json'));
});

app.get('/api/statistik', (req, res) => {
    res.send(require('./public/json/saveData.json'));
});



// app.get('/api/:req', (req, res) => {
//     const q = req.query;
//     const chooseAPI = req.params;
//     var pick;

//     if (Object.keys(q).length === 0) {
//         pick = chooseAPI.req;
//     }
//     else
//         pick = chooseAPI.req + "/" + q.id;    
    
//     const reqAPI = request({
//         url: "http://128.199.143.66:3000/" + pick,
//         json: true
//     }, (err, reponse, body) => {
//         // res.setHeader("content-type", "application/json")
//         // res.send(JSON.stringify(body))
//         res.send(body);
//             // const api_temp = JSON.stringify(body, undefined, 4);
//     });
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server Started on port ${port}`));