const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const fs = require("fs");

const secret = speakeasy.generateSecret();
fs.writeFileSync(__dirname + "/../backend/secrets/otp/secret.json", JSON.stringify(secret), "utf8");

QRCode.toString(secret.otpauth_url,{type:'terminal'}, function (err, url) {
  console.log(url);
});
