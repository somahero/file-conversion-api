const express = require('express');
const app = express();
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const  { marked } = require('marked');

require('dotenv').config()

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Express API for file conversion with FFMPEG',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express. It retrieves data from File Conversion API.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'DiNG',
        url: 'https://ding.hu',
      },
    },
  };

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.js'],
 };

const swaggerSpec = swaggerJSDoc(options);

var pjson = require('./package.json');

const logger = require('./utils/logger.js');
const constants = require('./utils/constants.js');

fileSizeLimit = constants.fileSizeLimit;
timeout = process.env.TIME_OUT || 3600000;

// catch SIGINT and SIGTERM and exit
// Using a single function to handle multiple signals
function handle(signal) {
    logger.info(`Received ${signal}. Exiting...`);
    process.exit(1)
  }  
//SIGINT is typically CTRL-C
process.on('SIGINT', handle);
//SIGTERM is sent to terminate process, for example docker stop sends SIGTERM
process.on('SIGTERM', handle);

app.use(compression());

//routes to handle file upload for all POST methods
var upload = require('./routes/uploadfile.js');
app.use(upload);

//routes to convert audio/video/image files to mp3/mp4/jpg
var convert = require('./routes/convert.js');
app.use('/convert', convert);

//routes to extract images or audio from video
var extract = require('./routes/extract.js');
app.use('/video/extract', extract);

//routes to probe file info
var probe = require('./routes/probe.js');
app.use('/probe', probe);

//routes to service info
var service = require('./routes/service.js');
app.use('/healthz', service);

//routes toswagger UI
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));

const server = app.listen(constants.serverPort, function() {
    let host = server.address().address;
    let port = server.address().port;
    logger.info('Server started and listening http://'+host+':'+port)
});

server.on('connection', function(socket) {
    logger.debug(`new connection, timeout: ${timeout}`);
    socket.setTimeout(timeout);
    socket.server.timeout = timeout;
    server.keepAliveTimeout = timeout;
});

// readme
app.get('/', function(req, res) {
  var path = __dirname + '/README.md';
  fs.readFile(path, 'utf8', function(err, data) {
    if(err) {
      console.log(err);
    }
    res.send(marked(data.toString()));
  });
});

app.use(function(req, res, next) {
  res.status(404).send({error: 'route not found'});
});

//custom error handler to return text/plain and message only
app.use(function(err, req, res, next){
    let code = err.statusCode || 500;
    let message = err.message;
    res.writeHead(code, {'content-type' : 'text/plain'});
    res.end(`${err.message}\n`);
    
});