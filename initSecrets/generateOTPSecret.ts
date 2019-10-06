import speakeasy from "speakeasy";
import QRCode from "qrcode";
import * as fs from "fs";

const secret = speakeasy.generateSecret();
fs.writeFileSync(__dirname + "/../secrets/otp/secret.json", JSON.stringify(secret), "utf8");

QRCode.toString(secret.otpauth_url,{type:'terminal'}, function (err, url) {
  console.log(url);
});
