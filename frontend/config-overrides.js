const {
  override,
  babelInclude,
  addWebpackAlias,
  removeModuleScopePlugin
} = require("customize-cra");
const path = require("path");

module.exports = override(
  removeModuleScopePlugin(),
  babelInclude([
    path.resolve("src"),
    path.resolve(__dirname, "../sharedCrypto")
  ]),
  addWebpackAlias({
    sharedCrypto: path.resolve(__dirname, "../sharedCrypto")
  })
);
