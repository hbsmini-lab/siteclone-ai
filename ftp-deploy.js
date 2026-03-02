const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();

const config = {
    user: "sibersit",
    password: "Hbs.4313413",
    host: "srvc08.trwww.com",
    port: 21,
    localRoot: __dirname + "/dist",
    remoteRoot: "/public_html",
    include: ["*", "**/*"],
    exclude: ["node_modules/**", ".git/**", ".env"],
    deleteRemote: false,
    forcePasv: true
};

console.log("FTP Deployment baslatiliyor...");
console.log("Sunucu: srvc08.trwww.com");
console.log("Hedef: /public_html");

ftpDeploy
    .deploy(config)
    .then(res => {
        console.log("Deployment tamamlandi!");
        console.log("Website: http://srvc08.trwww.com/~sibersit");
    })
    .catch(err => {
        console.error("Deployment hatasi:", err);
        process.exit(1);
    });

// Progress tracking
ftpDeploy.on("uploading", function(data) {
    console.log("Yukleniyor: " + data.filename + " (" + data.transferredFileCount + "/" + data.totalFilesCount + ")");
});

ftpDeploy.on("uploaded", function(data) {
    console.log("Yuklendi: " + data.filename);
});

ftpDeploy.on("log", function(data) {
    console.log("Log: " + data);
});
