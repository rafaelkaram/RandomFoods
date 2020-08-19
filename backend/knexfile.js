// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    version: '12.1',
    connection: {
      host : 'tcctads.c97xz2y9jkrb.sa-east-1.rds.amazonaws.com',
      user : 'postgres',
      password : 'abc123**',
      database : 'rf_dev'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    }
  },

  homolog: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/db.sqlite'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    }
  },

  production: {
    client: 'pg',
    version: '12.1',
    connection: {
      host : 'tcctads.c97xz2y9jkrb.sa-east-1.rds.amazonaws.com',
      user : 'random_foods',
      password : 'abc123**',
      database : 'random_foods'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    }
  }

};