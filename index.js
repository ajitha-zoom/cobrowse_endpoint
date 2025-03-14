'use strict'
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');
const KJUR = require('jsrsasign');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json(), cors());
app.options('*', cors());

app.post('/', (req, res) => {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const user_id = req.body.userId ?? Math.random().toString(36).substring(2)
  const user_name = req.body.userName ?? user_id

  const oHeader = { alg: 'HS256', typ: 'JWT' };


  const oPayload = {
    app_key: process.env.ZOOM_SDK_KEY,
    role_type: req.body.role,
    user_id,
    user_name,
    iat,
    exp
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_SDK_SECRET)
  return res.json({ token: sdkJWT })
});

app.listen(port, () => console.log(`Zoom Cobrowse SDK Auth Endpoint Sample Node.js, listening on port ${port}!`))

//module.exports = app
