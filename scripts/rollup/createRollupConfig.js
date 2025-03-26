import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

/**
 *
 * @returns {import("rollup").RollupOptions}
 */
export function createRollupConfig(options, callback) {
  const name = options.name;
  // A file with the extension ".mjs" will always be treated as ESM, even when pkg.type is "commonjs" (the default)
  // https://nodejs.org/docs/latest/api/packages.html#packages_determining_module_system
  const extName = options.format === 'esm' ? 'mjs' : 'js';
  const outputName = 'dist/' + [name, options.format, extName].join('.');

  const config = {
    input: options.input,
    output: {
      file: outputName,
      format: options.format,
      name: 'SchemaForm',
      sourcemap: false,
      exports: 'named',
    },
    external: ['react', 'react/jsx-runtime', 'react-hook-form'],
    plugins: [
      typescript({
        tsconfig: options.tsconfig,
        clean: true,
        exclude: ['**/__tests__', '**/*.test.ts', '**/__typetest__'],
      }),
      options.format === 'umd' &&
      commonjs({
        include: /\/node_modules\//,
      }),
      options.format !== 'esm' &&
      terser({
        output: { comments: false },
        compress: {
          drop_console: true,
        },
      }),
    ].filter(Boolean),
  };

  return callback ? callback(config) : config;
}