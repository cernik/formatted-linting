# formatted-linting

The `formatted-linting` module is based on [CLIEngine API](https://eslint.org/docs/developer-guide/nodejs-api#cliengine) and extends the [ESLint](https://github.com/eslint/eslint) tool in order to print additional information during the linting process.

![formatted-linting](./formatted-linting.png)

This is a sample project from ["How to format ESLint output"](https://medium.com/@alena_khineika/how-to-format-eslint-output-cfaef4262204) blogpost, therefore it won't be published at npm.

To run it locally use npm package linking mechanism:

```
cd ~/projects/formatted-linting              # go into the package directory
npm link                                     # creates global link
cd ~/projects/linter-consumer                # go into some other package directory.
npm link /Users/alena/www/formatted-linting  # link-install the package
```

## Usage

The following command lints all files that have `.js` or `.json` extension:

```
formatted-linting --dir ./ --ext .json --ext .js
```

## API

The `formatted-linting` module provides the following API:

```
formatted-linting --dir <value> --ext <value> --conf <value>
```

Where:

- `--dir` is a directory to traverse for files,
- `--ext` specifies an extension that should be checked by the linter,
- `--conf` is a path to a client `.eslintrc.js` file.

You can specify as much `--dir` or `--ext` options as you like, but it should be only one `--conf` options.

If the path to a config file was not specified and there is no `.eslintrc.js` file in the root directory of the client app, the default config file will be used.

More available options:

- `--log` ia a flag to log into console, default: false
- `--write` is a flag to log formatted data into a json file with a name like `eslint-results-9999.json, default: false
- `--write-raw` is a flag to log raw data into a json file with a name like `eslint-results-9999-raw.json, default: false
- `--open` or `--open-async` is a flag to open founded files with VSCode, default: false
- `--open-max` specifies how many files to open, default: 20
- `--open-all` specifies to open all founed files in editor, default: false
- `--editor` specifies editor to open, default: code for VSCode

The default configuration is:

```
module.exports = {
  extends: 'eslint-config-standard',
  env: { node: true },
  rules: {
    "semi": "off",
    "space-before-function-paren": "off"
  },
  plugins: ['json']
};
```

The `formatted-linting` by default extends a configuration called [`eslint-config-standard`](https://github.com/standard/eslint-config-standard). It also setts a `node` environment and switches off `semi` and `space-before-function-paren` rules, that is enabled by default in `eslint-config-standard`. The `eslint-plugin-json` allows to lint JSON files.

## License

[MIT](https://tldrlegal.com/license/mit-license)
