require('dotenv').config();
const fs = require('fs')
const cookieParser = require('cookie-parser');
const express = require('express');
const router = require('./routes/route');

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(router);

const port = process.env.PORT
app.listen(port,() => {
  if (process.env.SERVICE_ACCOUNT) {
    fs.writeFileSync(process.env.SERVICE_ACCOUNT_PATH, process.env.SERVICE_ACCOUNT)
  }

  console.log(`berjalan di port ${port}`);
})

