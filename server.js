require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
// connected routes
const userRouter = require('./routes/user');
const boardRouter = require('./routes/board');
const commendRouter = require('./routes/commend');
// connected mongodb
const connectDB = require('./config/database');
connectDB();
// connected body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
// connected morgan
app.use(morgan('dev'))
app.use('/user', userRouter);
app.use('/board', boardRouter);
app.use('/commend', commendRouter);

const PORT = process.env.PORT || 7000
app.listen(PORT, console.log("connected server..."))