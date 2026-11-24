/// <reference types="vitest/config" />
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import react from "@vitejs/plugin-react"

export default defineConfig({
	plugins: [react(), viteSingleFile()],
	test: {
		environment: "jsdom",
		globals: true,
	},
})
