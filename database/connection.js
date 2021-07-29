var knex = require('knex')({
      client: 'mysql2',
      connection: {
      host : '127.0.0.1',
      user : 'fernando',
      password : 'Hertz94773195',
      database : 'apiusers'
    }

  });

module.exports = knex