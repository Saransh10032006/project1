const express = require('express');
const notes = require('./data/notes');
const dotenv = require('dotenv')

const app = express();
dotenv.config

app.get('/',(req,res)=>{
    res.send('hey');
});

app.get('/api/notes',(req,res)=>{
    res.send(notes)
})

app.get('/api/notes/:id',(req,res)=>{
    const note = notes.find((n)=> n._id === req.params.id);
    res.send(note)
})

const PORT = process.env.PORT || 6000;

app.listen(PORT,console.log("server started"))