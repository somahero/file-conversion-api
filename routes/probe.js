var express = require('express')
const ffmpeg = require('fluent-ffmpeg');

const logger = require('../utils/logger.js');
const utils = require('../utils/utils.js');

var router = express.Router();

//probe input file and return metadata

/**
 * @swagger
 * /probe:
 *   post:
 *     summary: Retrieve a metadata.
 *     description: Retrieve a metadata from the uploaded file.
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Retrieve a metadata.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 streams:
 *                  type: array
 *                 format:
 *                  type: object
 *                 chapters:
 *                  type: object
 */


router.post('/', function (req, res,next) {

    let savedFile = res.locals.savedFile;
    logger.debug(`Probing ${savedFile}`);
    
    //ffmpeg processing...
    var ffmpegCommand = ffmpeg(savedFile)
    
    ffmpegCommand.ffprobe(function(err, metadata) {
        if (err)
        {
            next(err);            
        }
        else
        {
            utils.deleteFile(savedFile);        
            res.status(200).send(metadata);
        }
    
    });

});

module.exports = router