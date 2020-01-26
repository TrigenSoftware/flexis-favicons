import {
	external
} from '@trigen/scripts-plugin-rollup/helpers';
import tslint from 'rollup-plugin-tslint';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import shebang from 'rollup-plugin-add-shebang';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import browsers from 'browserslist-config-trigen/browsers';
import pkg from './package.json';

const babelConfig = {
	extensions: [
		...DEFAULT_EXTENSIONS,
		'ts',
		'tsx'
	],
	runtimeHelpers: true
};

function getPlugins(forBrowsers = false) {
	return [
		tslint({
			exclude:    ['**/*.json', 'node_modules/**'],
			throwError: true
		}),
		commonjs(),
		typescript(),
		babel(forBrowsers ? {
			...babelConfig,
			presets:        [
				['babel-preset-trigen', {
					targets: {
						browsers
					}
				}]
			]
		} : babelConfig)
	];
}

export default [{
	input:    'src/index.ts',
	plugins:  getPlugins(),
	external: external(pkg, true),
	output:   {
		file:      pkg.main,
		format:    'cjs',
		exports:   'named',
		sourcemap: 'inline'
	}
}, {
	input:    'src/core.ts',
	plugins:  getPlugins(true),
	external: external(pkg, true),
	output:   {
		file:      'lib/core.js',
		format:    'es',
		sourcemap: 'inline'
	}
}, {
	input:    'src/cli.ts',
	plugins:  [
		...getPlugins(),
		shebang()
	],
	external: () => true,
	output:   {
		file:      'lib/cli.js',
		format:    'cjs',
		exports:   'named',
		sourcemap: 'inline'
	}
}, {
	input:    'src/stream.ts',
	plugins:  getPlugins(),
	external: () => true,
	output:   {
		file:      'lib/stream.js',
		format:    'cjs',
		exports:   'named',
		sourcemap: 'inline'
	}
}];
