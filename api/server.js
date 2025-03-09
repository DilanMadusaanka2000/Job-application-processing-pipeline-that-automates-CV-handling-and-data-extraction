const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const cors = require('cors');
const uploadRoutes = require('./extract');
const applicationRouter = require('./extract');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const detailsRoutes = require('./userdetailsStore');


const app = express();
const port = 8800;
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log(' connect to mongoDB')
    } catch (error) {
        throw error
        
    }
 

};

 


app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/applications', applicationRouter);
app.use('/api/applications/details', detailsRoutes);





app.listen(port, () => {
    connect();
    console.log(`Server running at http://localhost:${port}`);
});