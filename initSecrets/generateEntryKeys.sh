echo "generate entry key pairs...";
if [ -f "../secrets/entry/keys.json" ]; then
  echo "skipped"
  exit 
fi

mkdir -p ../secrets/entry
node_modules/.bin/ts-node ./generateEntryKeys.ts
echo "done"