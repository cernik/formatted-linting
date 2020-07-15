#!/usr/bin/env node

const CLIEngine = require('eslint').CLIEngine;
const minimist = require('minimist');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const { exec, execSync } = require('child_process');

module.exports = (() => {
  const args = minimist(process.argv.slice(2));

  // Read a default eslint config
  let configPath = path.resolve(__dirname, '../.eslintrc.js');
  let baseConfig = require(configPath);

  // Check if the path to a client config was specified
  if (args.conf) {
    if (Array.isArray(args.conf)) {
      const error = chalk.bold.redBright(
        `> eslint requires a single config file`
      );

      return console.log(error);
    }

    try {
      configPath = path.resolve(process.cwd(), args.conf);
      baseConfig = require(configPath);
    } catch (error) {
      return console.log(error);
    }
  } else {
    // Check if a client app has .eslintrc.js in the root directory
    try {
      configPath = path.resolve(process.cwd(), '.eslintrc.js');
      baseConfig = require(configPath);
    } catch (error) {
      return console.log(error);
    }
  }

  console.log(`> eslint has loaded config from: ${configPath}`);

  const cli = new CLIEngine({ baseConfig });
  let filesDir = [];

  if (args.dir) {
    // Dir can be a string or an array, we do a preprocessing to always have an array
    filesDir = []
      .concat(args.dir)
      .map((item) => path.resolve(process.cwd(), item));
  } else {
    filesDir = ['./'];
  }

  console.log(`> eslint is checking the following dir: ${filesDir}`);

  const report = cli.executeOnFiles(filesDir);

  if (report.errorCount > 0 || report.warningCount > 0) {
    const formatter = cli.getFormatter();
    if (args.log) {
      console.log(formatter(report.results));
    }
    console.log(
      chalk.bold.redBright(`> eslint has found ${report.errorCount} error(s)`)
    );
    console.log(
      chalk.bold.redBright(
        `> eslint has found ${report.warningCount} warning(s)`
      )
    );
    const results = report.results.filter(
      (x) => x.errorCount || x.warningCount
    );

    if (args['write-raw']) {
      const fileName = `eslint-results-${
        report.errorCount + report.warningCount
      }-raw.json`;
      console.log(`> eslint is writing raw results into ${fileName}`);
      fs.writeFile(fileName, JSON.stringify(results), (err) => {
        if (err) {
          throw err;
        }
      });
    }

    if (args.write) {
      const fileName = `eslint-results-${
        report.errorCount + report.warningCount
      }.json`;
      console.log(`> eslint is writing results into ${fileName}`);
      fs.writeFile(
        fileName,
        JSON.stringify(
          results.reduce((acc, item) => {
            return item.messages.reduce(
              (acc2, message) => ({
                ...acc2,
                [message.ruleId]: (acc2[message.ruleId] || 0) + 1,
              }),
              acc
            );
          }, {})
        ),
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    }

    if (args['open-async'] || args.open) {
      const fn = args.open ? execSync : exec;
      const openMax = args['open-max'] || 20;
      const openAll = !!args['open-all'];

      fn(
        `${args.editor || 'code'} ${results.reduce((acc, item, index) => {
          if (openAll || index <= openMax) {
            return acc.concat(`${item.filePath} `);
          }
          return acc;
        }, '')}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
        }
      );
    }
    return;
  }

  console.log(chalk.bold.greenBright('> eslint finished without any errors!'));
})();
