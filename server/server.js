const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3002
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    server.get('/', (req, res) => {
      return app.render(req, res, '/home', req.query)
    })

    server.get('/home', (req, res) => {
      return app.render(req, res, '/home', req.query)
    })

    server.get('/test', (req, res) => {
      return app.render(req, res, '/test', req.query)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`server started on http://localhost:${port}`)
    })
  })