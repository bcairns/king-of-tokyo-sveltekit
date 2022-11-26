import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from "svelte-preprocess";

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
    paths: {
      base: dev ? '' : '/king-of-tokyo-sveltekit',
    },
    appDir: 'internal',
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: false,
      strict: true
    })
  },
	compilerOptions: {
    enableSourcemap: true,
  },
  preprocess: sveltePreprocess({
    sourceMap: true,
  }),
};

export default config;
