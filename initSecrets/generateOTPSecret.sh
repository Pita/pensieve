echo "generate otp secret...";
if [ -f "../backend/secrets/otp/secret.json" ]; then
  echo "skipped"
  exit 
fi

mkdir -p ../backend/secrets/otp
node ./generateOTPSecret.js
echo "done"