module.exports = {
  ...require("../../webpack.shared.config"),
  entry: "./src/client/index",
  output: {
    path: __dirname + "/static",
    filename: "bundle.js"
  }
};
