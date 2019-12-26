module.exports = function(app, config, router) {
    const path = require('path');
    const mime = require('mime');
    const fs = require('fs');
    const Jimp = require('jimp');

    function getFiles (dir){
        let files_ = [];
        let files = fs.readdirSync(dir);
        files.forEach((filename, key) => {
            if (fs.statSync(dir + '/' + filename).isFile()){
                files_.push(filename);
            }
        });
        return files_;
    }

    async function createPreview(bigfile, smallfile, width=400, height=400){
        const image = await Jimp.read(bigfile);
        try {
            image.cover(width, height).quality(81).write(smallfile);
            return true;
        } catch (ex) {
            console.log("can`t resize image");
            return false;
        }
    }

    router.get('/files/:filename', async function (req, res, next) {
        let filename = req.params.filename;
        if (req.params.filename === "random") {
            let filesName = getFiles('./files/' + req.query.module + '/');
            filename = filesName[filesName.length * Math.random() << 0];
        }


        let bigfile = './files/' + req.query.module + '/' + filename;
        if (!filename || !req.query.module || !(fs.existsSync(bigfile))) {
            res.status(404);
            res.send('error');
        }

        let file = './files/' + req.query.module + '/' + (req.query.preview ? "preview/" : "") + filename;
        if (req.query.preview && !(fs.existsSync(file))) {
            let result = await createPreview(bigfile, file);
            if (!result) {
                res.status(404);
                res.send('error');
            }
        }

        let mimeType = mime.getType(file);

        res.setHeader('Content-type', mimeType);
        if (req.query.download) {
            res.download(file);
        } else {
            let fileStream = fs.createReadStream(file);
            fileStream.pipe(res);
        }
    });

    return router;
};