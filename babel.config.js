module.exports = {
  presets: ["@babel/preset-typescript"],
  plugins: [
    "babel-plugin-react-compiler",
    "babel-plugin-console-source",
    "@babel/plugin-transform-strict-mode",
    "@babel/plugin-transform-json-strings",
    "@babel/plugin-transform-literals",
    "@babel/plugin-transform-unicode-regex",
  ],
};
