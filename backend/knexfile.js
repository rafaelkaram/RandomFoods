// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    version: '12.1',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '0795',
      database : 'aula_js'
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
      user : 'postgres',
      password : '0795',
      database : 'aula_js'
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
      user : 'postgres',
      password : '0795',
      database : 'aula_js'
    },
    migrations: {
      directory: './src/database/migrations'
    }
  }

};
