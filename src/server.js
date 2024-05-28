require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const authRouter = require('./routes/auth')

const app = express();
app.use(cookieParser());
app.use(express.json())

app.use('/', authRouter)


const port = process.env.PORT
app.listen(port,() => {
  console.log(`berjalan di port ${port}`)
})

