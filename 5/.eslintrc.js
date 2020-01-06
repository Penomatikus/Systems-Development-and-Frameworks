module.exports = {
	root: true,

	env: {
		node: true,
	},

	extends: [
		'plugin:vue/essential',
		'@vue/prettier',
		'plugin:prettier/recommended',
	],

	rules: {
		'no-console': 'off',
		'no-debugger': 'off',
	},

	parserOptions: {
		parser: 'babel-eslint',
	},

	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)',
			],
			env: {
				jest: true,
			},
		},
	],

	plugins: ['graphql', 'prettier'],
}
