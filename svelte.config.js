import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
    adapter: adapter()
  },
	compilerOptions: {
    enableSourcemap: true,
  },
  preprocess: sveltePreprocess({
    sourceMap: true,
  }),
};

export default config;
