var express = require('express')
const ffmpeg = require('fluent-ffmpeg');

const constants = require('../utils/constants.js');
const logger = require('../utils/logger.js')
const utils = require('../utils/utils.js')

var router = express.Router()


//routes for /convert
//adds conversion type and format to res.locals. to be used in final post function

/**
 * @swagger
 * /convert/audio/to/mp3:
 *   post:
 *     summary: wav to mp3 converter.
 *     description: Converting wav audio file to mp3 file.
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
 *         description: Converted mp3 audio file
 *         content:
 *          audio/mp3: 
 *            schema:
 *              type: string
 *              format: binary
 */

router.post('/audio/to/mp3', function (req, res,next) {

    res.locals.conversion="audio";
    res.locals.format="mp3";
    return convert(req,res,next);
});

/**
 * @swagger
 * /convert/audio/to/wav:
 *   post:
 *     summary: mp3 to wav converter.
 *     description: Converting mp3 audio file to wav file.
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
 *         description: Converted wav audio file
 *         content:
 *          audio/wav: 
 *            schema:
 *              type: string
 *              format: binary
 */


router.post('/audio/to/wav', function (req, res,next) {

    res.locals.conversion="audio";
    res.locals.format="wav";
    return convert(req,res,next);
});

/**
 * @swagger
 * /convert/video/to/mp4:
 *   post:
 *     summary: mov/avi/webm to mp4 converter.
 *     description: Converting AVI/MOV/WEBM video file to mp4 video file.
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
 *         description: Converted mp4 video file
 *         content:
 *          video/mp4: 
 *            schema:
 *              type: string
 *              format: binary
 */


router.post('/video/to/mp4', function (req, res,next) {

    res.locals.conversion="video";
    res.locals.format="mp4";
    return convert(req,res,next);
});

/**
 * @swagger
 * /convert/gif/to/mp4:
 *   post:
 *     summary: gif to mp4 converter.
 *     description: Converting GIF animation file to to mp4 video file.
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
 *         description: Converted mp4 video file
 *         content:
 *          video/mp4: 
 *            schema:
 *              type: string
 *              format: binary
 */


router.post('/gif/to/mp4', function (req, res,next) {

    res.locals.conversion="gif";
    res.locals.format="mp4";
    return convert(req,res,next);
});

/**
 * @swagger
 * /convert/image/to/jpg:
 *   post:
 *     summary: image to png converter.
 *     description: Converting image file to to jpg file.
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
 *         description: Converted image to jpg
 *         content:
 *          audio/wav: 
 *            schema:
 *              type: string
 *              format: binary
 */

router.post('/image/to/jpg', function (req, res,next) {

    res.locals.conversion="image";
    res.locals.format="jpg";
    return convert(req,res,next);
});

// convert audio or video or image to mp3 or mp4 or jpg
function convert(req,res,next) {
    let format = res.locals.format;
    let conversion = res.locals.conversion;
    logger.debug(`path: ${req.path}, conversion: ${conversion}, format: ${format}`);

    let ffmpegParams ={
        extension: format
    };
    if (conversion == "image")
    {
        ffmpegParams.outputOptions= ['-pix_fmt yuv422p'];
    }
    if (conversion == "audio")
    {
        if (format === "mp3")
        {
            ffmpegParams.outputOptions=['-codec:a libmp3lame' ];
        }
        if (format === "wav")
        {
            ffmpegParams.outputOptions=['-codec:a pcm_s16le' ];
        }
    }
    if (conversion == "video")
    {
        ffmpegParams.outputOptions=[
            '-codec:v libx264',
            '-profile:v high',
            '-crf 23',
            '-preset ultrafast',
            '-b:v 500k',
            '-maxrate 500k',
            '-bufsize 1000k',
            '-vf scale=-2:640',
            '-threads 8',
            '-codec:a libfdk_aac',
            '-b:a 128k',
        ];
    }

    if (conversion == "gif")
    {
        ffmpegParams.outputOptions=[
            '-pix_fmt yuv420p',
     
        ];
    }

    let savedFile = res.locals.savedFile;
    let outputFile = savedFile + '-output.' + ffmpegParams.extension;
    logger.debug(`begin conversion from ${savedFile} to ${outputFile}`)

    //ffmpeg processing... converting file...
    let ffmpegConvertCommand = ffmpeg(savedFile);
    ffmpegConvertCommand
            .renice(constants.defaultFFMPEGProcessPriority)
            .outputOptions(ffmpegParams.outputOptions)
            .on('error', function(err) {
                logger.error(`${err}`);
                utils.deleteFile(savedFile);
                res.writeHead(500, {'Connection': 'close'});
                res.end(JSON.stringify({error: `${err}`}));
            })
            .on('end', function() {
                utils.deleteFile(savedFile);
                return utils.downloadFile(outputFile,null,req,res,next);
            })
            .save(outputFile);
        
}

module.exports = router