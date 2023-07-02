import React, { useState, ChangeEvent, FC, useEffect, useRef } from 'react'
import Note from './types/Note'
import styles from './App.module.css'
import LoadingSpinner from './LoadingSpinner.tsx'


let debounceTimeouts = {};
function debounce(func, time, id) {
  const context = this, args = arguments;
  if (debounceTimeouts[id]) {
    clearTimeout(debounceTimeouts[id]);
  }
  debounceTimeouts[id] = setTimeout(() => {
    func.apply(context, args);
    delete debounceTimeouts[id];
  }, time);
}

const App: FC = () => {
  const [notes, setNotes] = useState<{ [id: string]: Note }>({})
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [warning, setWarning] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      let response = await fetch('/api/notes')
      if (!response.ok) {
        throw new Error('Error fetching notes')
      }
      let json = await response.json()
      setNotes(json)
    })()
  }, [])

  const createNewNote = async (title, content) => {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })

    if (!response.ok) {
      throw new Error('Error creating new note')
    }

    return await response.json()
  }

  const updateNote = (note) => {
    debounce(async () => {
      const response = await fetch('/api/notes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      })

      if (!response.ok) {
        throw new Error('Error updating note')
      }
    }, 500, note.id)
  }

  const handleAddNote = async () => {
    setLoading(true)
    const newNote = await createNewNote("New note", "Add your new notes here")
    setNotes({ ...notes, [newNote.id]: newNote })
    setActiveNoteId(newNote.id)
    setLoading(false)
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredNotes = Object.values(notes).filter(note => note.content.includes(searchTerm))

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (activeNoteId !== null) {
      const newNote = { ...notes[activeNoteId], title: e.target.value }
      setNotes({ ...notes, [activeNoteId]: newNote })
      try {
        updateNote(newNote)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (activeNoteId !== null) {
      const newContent = e.target.value
      const newNote = { ...notes[activeNoteId], content: newContent }
      setNotes({ ...notes, [activeNoteId]: newNote })

      if (newContent.length < 20) {
        setWarning("Note must not be shorter than 20 characters - it will not be saved while this is true.")
      } else if (newContent.length > 300) {
        setWarning("Note must not be longer than 300 characters - it will not be saved while this is true.")
      } else {
        setWarning(null)
        try {
          updateNote(newNote)
        } catch (e) {
          console.error(e)
        }
      }
    }
  }

  const handleDeleteNote = () => {
    if (activeNoteId !== null) {
      (async () => {
        const response = await fetch('/api/notes', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: activeNoteId }),
        })

        if (!response.ok) {
          throw new Error('Error updating note')
        }

        delete notes[activeNoteId]
        setNotes(notes)
        setActiveNoteId(null)
      })()
    }
  }

  return (
    <div className={styles.app}>
      {loading ? <LoadingSpinner /> : null}
      {warning && <div className={styles.warning}>{warning}</div>}
      <div className={styles.sidebar}>
        <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
        <button onClick={handleAddNote}>New Note</button>
        {filteredNotes.map((note: Note) => (
          <div key={note.id} onClick={() => setActiveNoteId(note.id)}>
            {note.title || "(Note)"}
          </div>
        ))}
      </div>

      <div className={styles.main}>
        {activeNoteId && (
          <>
            <div className={styles.noteHeader}>
              <input
                type="text"
                placeholder="Title"
                value={notes[activeNoteId].title}
                onChange={handleTitleChange}
              />
              <button onClick={handleDeleteNote}>Delete</button>
            </div>
            <textarea
              placeholder="Content"
              value={notes[activeNoteId].content}
              onChange={handleContentChange}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default App
