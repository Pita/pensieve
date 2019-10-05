echo "generate jwt key pair...";
if [ -f "../backend/secrets/jwt/public_key.pem" ]; then
  echo "skipped"
  exit 
fi

mkdir -p ../backend/secrets/jwt
cd ../backend/secrets/jwt
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
echo "done"