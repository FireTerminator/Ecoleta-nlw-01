require('dotenv').config();
import path from 'path';

module.exports = {
  client: 'pg',
  connection:{
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  },
  migrations:{
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  seeds:{
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
  }
}