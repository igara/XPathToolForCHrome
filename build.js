var fs = require("fs-extra");

// lib下をクリア
fs.removeSync("plugin/js/lib");
fs.mkdirsSync("plugin/js/lib");

// ライブラリコピー
fs.mkdirsSync("plugin/js/lib/jquery");
fs.createReadStream("node_modules/jquery/dist/jquery.min.js")
    .pipe(fs.createWriteStream("plugin/js/lib/jquery/jquery.min.js"));