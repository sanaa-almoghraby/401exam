
'use strict'
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());
const PORT=process.env.PORT //3004
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const dataSchema = new mongoose.Schema({
    name: String,
    instructions:String,
    photo:String,
  });
  const userSchema = new mongoose.Schema({
    email:String,
    data:[dataSchema]
  });
  const user = mongoose.model('user', userSchema);
  function seedfun(){
      const userdata=new user({
          email:'sanaa.almoghraby@gmail.com',
          data:[{
            "instructions": "Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5.",
            "photo": "https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3",
            "name": "Azalea"
            },]
      })
      const userdata2=new user({
        email:'roaa.abualeeqa@gmail.com',
        data:[{
          "instructions": "Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5.",
          "photo": "https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3",
          "name": "Azalea"
          },]
    })
      userdata.save();
      userdata2.save();

  }
//   seedfun();


// http://localhost:3004/getdatadb?email=sanaa.almoghraby@gmail.com
server.get('/getdatadb', getdata)
function getdata(req, res) {
    let email = req.query.email
    user.find({ email: email }, (err, databok) => {
        if (err) {
            res.send('erorrrrr')
        } else {
            res.send(databok[0].data)
        }
    })
}


// http://localhost:3004/dataapi
server.get('/dataapi', dataApi)

function dataApi(req, res) {
    let urlApi = 'https://flowers-api-13.herokuapp.com/getFlowers';
    axios.get(urlApi).then(item => {
        let dataApi = item.data.flowerslist.map(ele => {
            return new newopj(ele)
        })
        res.send(dataApi)
    })
}

class newopj {
    constructor(alldata) {
        this.instructions = alldata.instructions;
        this.photo = alldata.photo;
        this.name = alldata.name;

    }
}
// http://localhost:3004/addtofav
server.post('/addtofav', addtofavfun)

function addtofavfun(req, res) {
    const { email, instructions, photo, name } = req.body;
    user.find({ email: email }, (err, databok) => {
        if (err) {
            res.send('erorrrrr')
        } else {
            const newopj = {
                instructions: instructions,
                photo: photo,
                name: name,
            }
            databok[0].data.push(newopj)
        }
        databok[0].save();
        res.send(databok[0]);
    })

}
// http://localhost:3004/update/inx
server.put('/update/:id', updatefun)
function updatefun(req, res) {
    let { email, instructions, photo, name } = req.body;
    let ind = req.params.id
    user.findOne({ email: email }, (err, databok) => {
        if (err) {
            res.send('erorrrrr')
        } else {
            databok.data.splice(ind, 1, {
                instructions: instructions,
                photo: photo,
                name: name,
            });
            databok.save();
            res.send(databok.data)
        }
    })
}
// http://localhost:3004/delete/inx
server.delete('/delete/:id',deletefun)
function deletefun(req, res) {
    let email = req.query.email;
    let ind=req.params.id;
    user.findOne({ email: email }, (err, databok) => {
        if (err) {
            res.send('erorrrrr')
        } else {
            databok.data.splice(ind,1);
            databok.save();
            res.send(databok.data)
        }
    })
}





// http://localhost:3002/
server.get('/',(req,res)=>{
    res.send('goood')
})
server.listen(PORT, () => {
    console.log(`listen on ${PORT}`);
})