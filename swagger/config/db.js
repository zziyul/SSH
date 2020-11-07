const mysql = require("mysql");
const logger = require('./logger');

const pool = mysql.createPool({
  user: 'root', // e.g. 'my-db-user'
  password: 'saltriver', // e.g. 'my-db-password'
  database: 'WEB_NOTE', // e.g. 'my-database'
  // If connecting via unix domain socket, specify the path
  //socketPath: `/cloudsql/tmpt-264307:asia-east1:tmpdb`
  // If connecting via TCP, enter the IP and port instead
  host: '34.64.255.159',
  port: 3306
});
//logger.info('Connection pool created.');

pool.on('acquire', function (connection) {
 logger.info(`Connection ${connection.threadId} acquired`);
});

pool.on('enqueue', function () {
  logger.info('Waiting for available connection slot');
});

pool.on('release', function (connection) {
 logger.info(`Connection ${connection.threadId} released`);
});


var getConnection = async function(callback){
  pool.getConnection(function(err, connection){
        callback(err, connection);
  });
};

module.exports = getConnection;
