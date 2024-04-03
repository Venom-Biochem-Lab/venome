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
				primary: {
					50: "#f2f8fd",
					100: "#e4f0fa",
					200: "#c4e1f3",
					300: "#8fc8ea",
					400: "#54abdc",
					500: "#2d91ca",
					600: "#1e74ab",
					700: "#194f73", // flowbite uses this one for 'primary' variants
					800: "#194f73",
					900: "#19405c", // same as darkblue below
					950: "#112b40",
				},
				// then match the css global variables defined in .postcss file so these can be used in tailwind
				darkblue: "hsla(205, 57%, 23%, 1)",
				lightblue: "hsla(198, 41%, 54%, 1)",
				darkorange: "hsla(27, 77%, 55%, 1)",
				lightorange: "hsla(38, 83%, 60%, 1)",
			},
		},
	},
};

module.exports = config;
