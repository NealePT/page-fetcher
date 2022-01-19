const request = require('request');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2);

request(args[0], (error, response, body) => {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

  fs.writeFile(args[1], body, { flag: 'wx' }, err => {
    if (err.code === 'EEXIST') {
      rl.question("File already exists, would you like to overwrite?(y/n)", (answer) => {
        if (answer === "y") {
          fs.writeFile(args[1], body, () => {
            console.log(`File overwritten!. Downloaded and saved ${body.length} bytes to ${args[1]}`);
          });
        } else if (answer === "n") {
          console.log(`${args[0]} will not be downloaded. Goodbye.`);
        }
        rl.close();

      });

    }
    return;
  });
  console.log(`Downloaded and saved ${body.length} bytes to ${args[1]}`);
});
