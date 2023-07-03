const randomUUID = require('crypto').randomUUID
const express = require("express");
const path = require('path')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 8080

const app = express()
app.use(express.json())


const notes = {}

if(process.env.PROD) {
  app.use(express.static(path.resolve(__dirname, '../build/')))
}

app.get('/api/notes', (req, res) => {
  res.send(JSON.stringify(notes))
})

app.post('/api/notes', (req, res) => {
  const { title, content } = req.body
  const note = {
    id: randomUUID(),
    title,
    content
  }
  notes[note.id] = note

  res.status(201).json(note)
})

app.put('/api/notes', (req, res) => {
  const { id, title, content } = req.body
  if(notes[id] === undefined) {
    res.status(404)
    return
  }

  notes[id] = { id, title, content }
  res.status(200).json(notes[id])
})

app.delete('/api/notes', (req, res) => {
  const { id } = req.body
  if(notes[id] === undefined) {
    res.status(404)
    return
  }

  const note = notes[id]
  delete notes[id]
  res.status(200).json(note)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})