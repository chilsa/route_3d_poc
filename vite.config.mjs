// vite.config.js
import { defineConfig } from 'vite'
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	base: '/route_3d_poc/',
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: 'assets/*',
					dest: 'assets/'
				}
			]
		})
	]
})
