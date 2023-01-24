require('agilite-utils/dotenv').config()

const Express = require('express')
const Path = require('path')
const HTTP = require('http')
const Compression = require('compression')

const app = Express()
app.use(Compression())

// Serve the files out of ./build as our main files
app.use('/', Express.static(Path.join(__dirname, '/build')))
app.get('/', (req, res) => {
  res.sendFile(Path.join(__dirname, '/build/index.html'))
})

// Server Setup
const port = process.env.PORT || 80
const server = HTTP.createServer(app)
server.listen(port, () => {
  console.log(`${process.env.REACT_APP_NAME} (${process.env.REACT_APP_VERSION}) listening on Port - ${port}`)
})
