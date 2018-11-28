module.exports = {
	"extends" : "airbnb",
	"parser" : "babel-eslint",
	"plugins" : [
		"react",
		"jsx-a11y",
		"import"
	],
	"rules": {
		"react/jsx-filename-extension": 0,
		"no-use-before-define": 0,
		"no-console": 0,
		"func-names": 0,
		"no-undef": 0,
		"no-unused-vars": 0,
		"strict": 0,
		"dot-notation": 0,
		"import/extensions": 0,
		"no-useless-constructor": 0,
		"react/prefer-stateless-function": 0,
		"react/prop-types": 0,
		"react/destructuring-assignment": 0,
		"react/no-array-index-key": 0,
		"react/no-did-update-set-state": 0,
		"no-restricted-syntax": 0,
		"import/no-unresolved": 0,
		"no-shadow": 0,
		"brace-style": [2, "stroustrup"],
		"react/sort-comp": [2, {
			order: [
				"lifecycle",
				"static-methods",
				"rendering",
			]
		}]
	}
};
