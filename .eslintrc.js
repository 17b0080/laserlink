module.exports = {
  "extends": ["airbnb-base", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "import/no-extraneous-dependencies": [2, { "devDependencies": true }],
    "no-unused-expressions": ["error", { "allowTernary": true }],
    "prettier/prettier": ["error"]
  }
};
