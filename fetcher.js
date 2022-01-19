const request = require('request');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2);

request(args[0], (error, response, body) => {
  fs.writeFile(args[1], body, { flag: 'wx' }, err => {
    if (response.statusCode !== 200) {
      console.log("URL is invalid. Check command line URL and try again.");
      rl.close();
      return;
    }
    if (err.code === "ENOENT") {
      console.log("Local file path is invalid. Check command line file path and try again.");
      rl.close();
      return;
    } else if (err.code === 'EEXIST') {
      rl.question("File already exists, would you like to overwrite?(y/n)", (answer) => {
        if (answer === "y") {
          fs.writeFile(args[1], body, () => {
            console.log(`File overwritten!. Downloaded and saved ${body.length} bytes to ${args[1]}.`);
            rl.close();
          });
        } else if (answer === "n") {
          console.log(`${args[0]} will not be downloaded. Goodbye!`);
          rl.close();
        }
      });
      return;
    } else if (error === null) {
      console.log(`Downloaded and saved ${body.length} bytes to ${args[1]}.`);
      rl.close();
    }
  });
});
