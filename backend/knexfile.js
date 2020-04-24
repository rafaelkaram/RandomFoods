// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    version: '12.1',
    connection: {
      host : '127.0.0.1',
      user : 'random_foods',
      password : 'random_foods',
      database : 'random_foods'
    },
    migrations: {
      directory: './src/database/migrations'
    }
  },

  homolog: {
    client: 'pg',
    version: '12.1',
    connection: {
      host : '127.0.0.1',
      user : 'random_foods',
      password : 'random_foods',
      database : 'random_foods'
    },
    migrations: {
      directory: './src/database/migrations'
    }
  },

  production: {
    client: 'pg',
    version: '12.1',
    connection: {
      host : '127.0.0.1',
      user : 'random_foods',
      password : 'random_foods',
      database : 'random_foods'
    },
    migrations: {
      directory: './src/database/migrations'
    }
  }

};
