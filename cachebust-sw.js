var random = require("randomstring");
var fs = require('fs');

var randomString = random.generate(10);

fs.appendFile('docs/sw.js', '// ' + randomString, (err) => {
  if (err) throw err;
  console.log('New service worker created!');
});
