# ---Variables globales---
APP_NAME="react-typescript-app"
APP_DESCRIPTION=""
APP_TITLE="React Typescript App"
SUBDIRECTORY="/test/"

# ---Creacion del archivo de administracion de dependencias npm---
echo "{
  \"name\": \"${APP_NAME}\",
  \"version\": \"1.0.0\",
  \"description\": \"${APP_DESCRIPTION}\",
  \"scripts\": {
    \"compile\": \"webpack\",
    \"serve\": \"webpack serve\",
    \"deploy\": \"webpack --env NODE_ENV=production\"
    },
  \"author\": \"\",
  \"license\": \"ISC\"
}
" > ./package.json

# ---Instalacion de dependencias---
# React core
npm install --save react react-dom
# Polyfills
npm install --save whatwg-fetch core-js regenerator-runtime
# Must have addons
npm install --save react-router-dom prop-types react-localization
# Webpack
npm install --save-dev webpack webpack-cli webpack-dev-server
# Webpack loaders
npm install --save-dev babel-loader style-loader css-loader file-loader
# Webpack plugins
npm install --save-dev html-webpack-plugin mini-css-extract-plugin copy-webpack-plugin 
# Babel
npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/preset-react @babel/preset-typescript 
# Estilo
npm install --save-dev eslint-config-airbnb eslint-config-airbnb-typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser
# Typescript
npm install --save-dev typescript @types/react-dom

curl https://github.com/reactjs/reactjs.github.io/blob/master/favicon.ico > ./favicon.png

# ---Configuracion de webpack---
echo "/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = (env = {}) => {
  const NODE_ENV = env.NODE_ENV === undefined ? 'development' : env.NODE_ENV;
  const ASSET_PATH = NODE_ENV === 'production' ? '"${SUBDIRECTORY}"' : '/';
  const BASE_PATH = NODE_ENV === 'production' ? '"${SUBDIRECTORY}"' : '/';
  return ({
    entry: path.join(__dirname, 'src/App.tsx'),
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: ASSET_PATH,
      filename: '[name].[contenthash].js',
    },
    mode: NODE_ENV,
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: 7000,
      hot: true,
      historyApiFallback: true,
    },
    devtool: 'inline-cheap-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
      chunkIds: 'deterministic',
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\\\/]node_modules[\\\\/]/,
            maxSize: 240000,
            chunks: 'all',
          },
          common: {
            test: /[\\\\/]src[\\\\/]/,
            maxSize: 240000,
            chunks: 'all',
          },
        },
      },
    },
    performance: {
      hints: NODE_ENV === 'production' ? 'warning' : false,
      maxEntrypointSize: 500000,
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: '"${APP_TITLE}"',
        template: 'index.html',
        favicon: path.join(__dirname, 'favicon.png'),
      }),
      new webpack.DefinePlugin({
        BASE_PATH: JSON.stringify(BASE_PATH),
      }),
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash].css',
      }),
      new CopyPlugin({
        patterns: [
          { from: '.htaccess', to: '' },
        ],
      }),
    ],
  });
};"> ./webpack.config.js

# ---Punto de entrada de la aplicacion---
mkdir src
echo "import React from 'react';
import { createRoot } from 'react-dom/client';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import withStyle from './wrappers/withStyle';
import { withLocalization } from './wrappers/withLocalization';
import RoutedApp from './RoutedApp';
// @imports

const RoutedAppWithLocalization = withLocalization(RoutedApp);
const RoutedAppWithStyle = withStyle(RoutedAppWithLocalization);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement as Element);

root.render(
  <React.StrictMode>
    <RoutedAppWithStyle />
  </React.StrictMode>,
);" > ./src/App.tsx
echo "import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import HomePage from './views/HomePage';
import PageNotFound from './views/PageNotFound';
// @imports

declare global {
  const BASE_PATH: string;
}

const RoutedApp = () => {
  const basepath = BASE_PATH;
  const notFoundPath = '/404';
  return (
    <BrowserRouter basename={basepath}>
      {/* navbar */}
      <Routes>
        <Route path=\"/\" element={<HomePage />} />
        <Route path={notFoundPath} element={<PageNotFound />} />
        <Route path=\"*\" element={<Navigate to={notFoundPath} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutedApp;" > ./src/RoutedApp.tsx
mkdir src/components
mkdir src/views
echo "import React from 'react';
import { LocalizationContext } from '../wrappers/withLocalization';

const HomePage = () => {
  const messages = React.useContext(LocalizationContext);
  return (
    <h1>{messages.homepage.helloWorld}</h1>
  );
};

export default HomePage;" > ./src/views/HomePage.tsx
echo "import React from 'react';
import { LocalizationContext } from '../wrappers/withLocalization';

const PageNotFound = () => {
  const messages = React.useContext(LocalizationContext);
  return (
    <h1>{messages.pageNotFound.pageNotFound}</h1>
  );
};

export default PageNotFound;" > ./src/views/PageNotFound.tsx
echo "<!DOCTYPE html>
<html>

<head>
	<meta charset=\"utf-8\" />
	<meta name=\"viewport\" content=\"minimum-scale=1, initial-scale=1, width=device-width\">
	<title>
		<%= htmlWebpackPlugin.options.title %>
	</title>
</head>

<body>
	<div id=\"root\"></div>
</body>

</html>" >> ./index.html
mkdir src/wrappers
echo "import React from 'react';

const withStyle = (BaseApp: React.ComponentType) => () => (
  <BaseApp />
);

export default withStyle;" > ./src/wrappers/withStyle.tsx
echo "import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';

export interface IStrings extends LocalizedStringsMethods {
  example: string;
  homepage: {
    helloWorld: string,
  },
  pageNotFound: {
    pageNotFound: string,
  },
  navBar: {
    account: string,
    signIn: string,
    signUp: string,
    logout: string,
    greeting: string,
  },
}

const messages: IStrings = new LocalizedStrings({
  en: {
    example: 'Example',
    homepage: {
      helloWorld: 'Hello World',
    },
    pageNotFound: {
      pageNotFound: 'Page Not Found',
    },
    navBar: {
      account: 'Account',
      signIn: 'Log in',
      signUp: 'Sign Up',
      logout: 'Logout',
      greeting: 'Hello',
    },
  },
  es: {
    example: 'Ejemplo',
    homepage: {
      helloWorld: 'Hola Mundo',
    },
    pageNotFound: {
      pageNotFound: 'Página no encontrada',
    },
    navBar: {
      account: 'Cuenta',
      signIn: 'Ingresar',
      signUp: 'Registrarse',
      logout: 'Cerrar Sesión',
      greeting: 'Hola',
    },
  },
});

export default messages;" > ./src/wrappers/messages.ts
echo "import React from 'react';
import messages from './messages';

export const LocalizationContext = React.createContext(messages);

export const withLocalization = (BaseApp: React.ComponentType) => () => (
  <LocalizationContext.Provider value={messages}>
    <BaseApp />
  </LocalizationContext.Provider>
);" > ./src/wrappers/withLocalization.tsx

echo '{
    "extends": [
        "airbnb",
        "airbnb-typescript"
    ],
    "parserOptions": {
        "project": "./tsconfig.json"
    },
    "env": {
        "browser": true
    },
    "rules": {
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                "js": "never",
                "jsx": "never",
                "ts": "never",
                "tsx": "never"
            }
        ],
        "no-underscore-dangle": [
            "error",
            {
                "allow": [
                    "_id",
                    "_metadata"
                ]
            }
        ],
        "react/function-component-definition": [
            2,
            {
                "namedComponents": "arrow-function",
                "unnamedComponents": "arrow-function"
            }
        ]
    }
}' > ./.eslintrc.json
echo "declare module '*.png';
declare module '*.jpg';" > ./index.d.ts
echo '{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react"
  },
  "include": [
    "src", "index.d.ts"
  ]
}' > ./tsconfig.json
echo 'RewriteEngine On
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
RewriteRule ^ - [L]

# Fallback all other routes to index.html
RewriteRule ^ /'${SUBDIRECTORY}'index.html [L]' >> ./.htaccess
open http://localhost:7000/
npm run serve 
