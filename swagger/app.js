"use strict"

var SwaggerExpress = require("swagger-express-mw")
var SwaggerUi = require("swagger-tools/middleware/swagger-ui")
var mysql = require("promise-mysql")
var app = require("express")()
var bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const secret = require("./config/secret")
// const file = require("./config/file")
const images = require('./config/file');

module.exports = app // for testing

// jwt 토큰 발행해주기
var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    jwt: function (req, authOrSecDef, scopesOrApiKey, cb) {
      console.log(scopesOrApiKey)
      try {
        let decoded = jwt.verify(scopesOrApiKey, req.app.get("jwt-secret"))
        req.decoded = decoded
        cb()
      } catch (e) {
        cb(new Error("access denied!!"))
      }
    },
  },
}

app.set("jwt-secret", secret.secretKey)

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit : "50mb" }));
app.use(bodyParser.urlencoded({ limit:"50mb", extended: false }));

app.listen(3000, function(){
  // console.log(file);
  // file().catch(console.error);
   // images.sendUploadToGCS();
  console.log("Express server listening on port 3000");
});

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err
  }

  // install middleware
  swaggerExpress.runner.swagger.host = "127.0.0.1:10010"
  app.use(SwaggerUi(swaggerExpress.runner.swagger))
  app.use(function (req, res, next) {
    if (req.file) {
      req.files = req.file
    } else {
      req.files = {}
    }
    next()
  })

  swaggerExpress.register(app)

  var port = process.env.PORT || 10010
  app.listen(port)
})

//
