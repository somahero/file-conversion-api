const express = require('express')

const router = express.Router()

//route to handle file upload in all POST requests
//file is saved to res.locals.savedFile and can be used in subsequent routes.
router.use(function (req, res,next) {
    res.header('Access-Control-Allow-Methods', 'GET');
    next();
});

/**
 * @swagger
 * /healthz:
 *   get:
 *     summary: Retrieve a service state.
 *     description: Retrieve a service state. 
 *     responses:
 *       200:
 *         description: Service health information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: unixtimestamp
 *                   description: Uptime.
 *                   example: 0
 *                 message:
 *                   type: string
 *                   description: Service state.
 *                   example: Ok
 *                 date:
 *                   type: datetime
 *                   description: Actual server date.
 *                   example: 2022-03-30T08:11:16.444Z
 */

router.get('/', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
      }
    
      res.status(200).send(data);
  });
  

module.exports = router;