const config = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	],

	plugins: [require("flowbite/plugin")],

	darkMode: "class",

	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					// TODO: actually interpolate lightness here
					50: "hsla(205, 57%, 23%, 1)",
					100: "hsla(205, 57%, 23%, 1)",
					200: "hsla(205, 57%, 23%, 1)",
					300: "hsla(205, 57%, 23%, 1)",
					400: "hsla(205, 57%, 23%, 1)",
					500: "hsla(205, 57%, 23%, 1)",
					600: "hsla(205, 57%, 23%, 1)",
					700: "hsla(205, 57%, 23%, 1)",
					800: "hsla(205, 57%, 23%, 1)",
					900: "hsla(205, 57%, 23%, 1)",
				},
				// then match the css global variables defined in .postcss file
				darkblue: "hsla(205, 57%, 23%, 1)",
				lightblue: "hsla(198, 41%, 54%, 1)",
				darkorange: "hsla(27, 77%, 55%, 1)",
				lightorange: "hsla(38, 83%, 60%, 1)",
			},
		},
	},
};

module.exports = config;
