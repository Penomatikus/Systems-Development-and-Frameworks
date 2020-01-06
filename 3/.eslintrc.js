module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["plugin:vue/essential", "@vue/prettier"],

  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "graphql/template-strings": [
      "error",
      {
        env: "literal",
        projectName: "app",
        schemaJsonFilepath: "node_modules/.temp/graphql/schema.json"
      }
    ]
  },

  parserOptions: {
    parser: "babel-eslint"
  },

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ],

  plugins: ["graphql"]
};
