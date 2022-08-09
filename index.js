require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/public/home.html');
})

app.post('/',(req,res)=>{
  const {fname, lname, email, number, address_1, address_2,
        city, state, zip, comment, salutations} = req.body;
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
          PFX:salutations,
          ADDRESS:{
            addr1:address_1,
            addr2:address_2,
            city:city,
            state:state,
            zip:zip
          }
        }
      }
    ]


  }

  const jsdata = JSON.stringify(data);
  const url = `https://us20.api.mailchimp.com/3.0/lists/${process.env.Audience_api}`;
  const options = {
    method:'POST',
    auth:`patrick:${process.env.Api}`
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


app.listen(port, ()=>{
  console.log(`The server is running on port ${port}`);
})
