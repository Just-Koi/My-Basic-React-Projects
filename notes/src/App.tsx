
import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes, Navigate } from "react-router"
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import { Note } from "./Note";
import { EditNote } from "./EditNote";

export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  body: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  body: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

const App = () =>{
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  }, [notes, tags])

  const onDeleteNote = (id: string) => {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id);
    })
  }

  const onUpdateNote = (id: string, { tags, ...data}: NoteData) => {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return {...note, ...data, tagIds: tags.map(tag => tag.id)}
        } else {
          return note
        }
      }
    })
  }

  const onCreateNote = ({ tags, ...data}: NoteData){
    setNotes(prevNotes => {
      return [...prevNotes, 
        {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}
      ]
    })
  }

  const addTag = (tag: Tag) => {
    setTags(prev => [...prev, tag])
  }

  const deleteTag = (id: string) => {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  const updateTags = (id: string, label: string) => {
    setTags(prevTags => { 
    return prevTags.map(tag => {
      if (tag.id === id) {
        return {...tag, label}
      } else {
        return tag
      }
    })
    })

  return (
  <Container className="mx-2">
    <Routes>
      <Route path="/" element={<NoteList notes={notesWithTags} availableTags={tags} onUpdateTag={updateTag} onDeleteTag={deleteTag}/>} />
      <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />} />
      <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
        <Route index element={<Note onDelete={onDeleteNote}/>} />
        <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Container>
  );
}

export default App

