echo "generate otp secret...";
if [ -f "../secrets/otp/secret.json" ]; then
  echo "skipped"
  exit 
fi

mkdir -p ../secrets/otp
node_modules/.bin/ts-node ./generateOTPSecret.ts
echo "done"