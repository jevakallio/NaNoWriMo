const fs = require("fs");
const normalizedPath = require("path").join(__dirname, "chapters");
const pattern = /[a-zA-Z0-9_\u0392-\u03c9\u00c0-\u00ff\u0600-\u06ff]+|[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;

// for whatever reason, the nanowrimo website
// reports lower numbers -- probably a different
// algo for defining what a word is. i don't really care, i'll
// just err on the side of caution and cut a little of the
// total count (based on the nanowrimo.org estimate after)
// 5 chapters.
const nanoAdjustment = 0.965;
const wordCount = function(data) {
  var m = data.match(pattern);
  var count = 0;
  if (!m) {
    return 0;
  }
  for (var i = 0; i < m.length; i++) {
    if (m[i].charCodeAt(0) >= 0x4e00) {
      count += m[i].length;
    } else {
      count += 1;
    }
  }
  return count;
};

let total = 0;

fs.readdirSync(normalizedPath).forEach(file => {
  if (file && !file.startsWith("00-")) {
    const contents = fs.readFileSync("./chapters/" + file, {
      encoding: "utf8"
    });
    const count = Math.floor(wordCount(contents) * nanoAdjustment);
    total += count;

    console.log(file, count);
  }
});

console.log("total: ", total);
console.log("% of goal: ", ((total / 50000) * 100).toFixed(1));
