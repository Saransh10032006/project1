const express = require('express');
const notes = require('./data/notes');
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');


const app = express();
dotenv.config()
connectDB();
app.use(express.json( ))

app.get('/',(req,res)=>{
    res.send('hey');
});

app.get('/api/notes',(req,res)=>{
    res.send(notes)
})

app.use('/api/users',userRoutes)
app.use('/api/notes',noteRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000;

app.listen(PORT,console.log(`Server started at PORT ${PORT}`))