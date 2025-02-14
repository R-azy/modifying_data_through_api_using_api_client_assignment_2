const express = require('express');
const { resolve } = require('path');
const menuitem = require('./schema');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

const mongoose=require("mongoose");
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to Database')
  }).catch(err=>{console.log(err)})
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/menu', async(req, res) => {
  try {  
    const newmenuitem = new menuitem({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    });
    await newmenuitem.save();
    res.status(201).json({ message: "new menu item added", item: newmenuitem });
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: "error in adding menu item", error: error.message });
  }
});
app.get('/menu', async(req, res) => {
  try {
    const menu = await menuitem.find();
    res.status(200).json(menu);
  } catch(error) {
    res.status(500).json({message: "error in getting menu"});
  }
})
app.put('/menu/:id', async(req,res)=>{
  try{
    const { name, description, price } = req.body;
    const upmenu=await menuitem.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true }
    );
    if (!upmenu) return res.status(404).json({ error: "User not found" });
    res.json(upmenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
})
app.delete('/menu/:id',async(req,res)=>{
  try{
    const del=await menuitem.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: "User not found" });
    res.json(del);
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});