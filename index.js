const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/public/home.html');
})

app.post('/',(req,res)=>{
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const number = req.body.tel_number;
  const address_street = req.body.address_1;
  const address_apt = req.body.address_2;
  const city = req.body.city;
  const state = req.body.state;
  const zip = req.body.zip;
  const comment = req.body.comment;
  const prefix = req.body.salutations;

  const data ={
    members:[
      {
        email_address:email,
        status:'subscribed',
        merge_fields:{
          FNAME:fname,
          LNAME:lname,
          COMMENT:comment,
          PHONE:number,
          PFX:prefix,
          ADDRESS:{
            addr1:address_street,
            addr2:address_apt,
            city:city,
            state:state,
            zip:zip
          }
        }
      }
    ]


  }

  const jsdata = JSON.stringify(data);
  const url = "https://us20.api.mailchimp.com/3.0/lists/51fa3d1d9d";
  const options = {
    method:'POST',
    auth:'patrick:85bda23a487ffc04cfc99801c996e5ac-us20'
  };

  const request1 = https.request(url,options,(response)=>{
    if (response.statusCode===200){
      res.sendFile(__dirname+'/public/success.html')
    }else{
      res.sendFile(__dirname+'/public/failure.html')
    }
    response.on('data',(data)=>{
      console.log(JSON.parse(data));
    })
  })
  request1.write(jsdata);
  request1.end();


});

app.post('/success', (req,res)=>{
  res.redirect('/')
})
app.post('/failure', (req,res)=>{
  res.redirect('/')
})
// Api : 85bda23a487ffc04cfc99801c996e5ac-us20
// Audience: 51fa3d1d9d




app.listen(process.env.PORT || 3000, ()=>{
  console.log('we are running on server 3000');
})
