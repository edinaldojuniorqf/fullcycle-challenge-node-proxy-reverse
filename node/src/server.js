const express = require('express')
const mysql = require('mysql')
const faker = require('faker')
const { promisify } = require('util')

const port = 3000
const app = express()

const conn = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
})

conn.query(`
  CREATE TABLE IF NOT EXISTS people(
    name VARCHAR(255) NOT NULL
  )
`)

app.get('/', async (req, res) => {
  try {
    await promisify(conn.query).bind(conn)(`
      INSERT INTO people (name) VALUES ('${faker.name.findName()}')
    `)

    const result = await promisify(conn.query).bind(conn)(`
      SELECT * FROM people
    `)

    const names = result.map(item => item.name)

    res.send(`
      <h1>Full Cycle Rocks!</h1>
      <br>
      ${names.join('<br>')}
    `)
  } catch (err) {
    console.err(err)
  }
})

app.listen(port, () => {
  console.log(`Server running in port ${port}`)
})