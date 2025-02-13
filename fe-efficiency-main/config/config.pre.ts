import { defineConfig } from 'umi';
export default defineConfig({
  define:{
    APP_ENV: 'pre',
    GIT_VERSION:process.env.GIT_VERSION
  },
  plugins: [
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
});

