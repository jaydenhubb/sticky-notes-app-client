import { useState, useEffect } from 'react';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import styles from './styles/NotesPage.module.css'
import stylesUtils from './styles/util.module.css'
import * as NotesApi from './network/note-api'
import AddNotes from './components/AddNotes';
import {FaPlus} from "react-icons/fa"
import styleUtil from "./styles/util.module.css"

function App() {

  const [notes, setNotes] = useState<NoteModel[]>([])
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null)
  const [notesLoading, setNotesLoading] = useState(true)
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false)

  useEffect(()=>{
    async function loadNotes(){
      try{
        setShowNotesLoadingError(false)
        setNotesLoading(true)
        const notes = await NotesApi.fetchNotes()
        setNotes(notes)

      }catch(err){
        console.error(err)
        setShowNotesLoadingError(true)
      }finally{
        setNotesLoading(false)
      }

    }
    loadNotes()
  },[])

  const deleteNote = async (note: NoteModel)=>{
    try {
      await NotesApi.deleteNotes(note._id)
      setNotes(notes.filter(existnotes=>existnotes._id !== note._id))
    } catch (error) {
      console.error(error)
      alert(error)
    }
  }

  const  notesGrid =  <Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
  {notes.map((note)=>(
    <Col key={note._id}>
      <Note 
      onNoteClick={setNoteToEdit}
      note={note} 
      className={styles.note}
      onDeleteNote={deleteNote}
      />
    </Col>
  ))}
  </Row>

  return (
    <Container className={styles.notesPage}>
      <Button 
      className={`mb-4 ${stylesUtils.blockCenter} ${styleUtil.flexCenter}`}
      onClick={()=>setShowNoteModal(true)}>
        <FaPlus/>
        Add New Note
      </Button>
      {
        notesLoading && <Spinner animation='border' variant='primary'/>
      }
      {
        showNotesLoadingError && <p>Something went wrong. Please refresh the page</p>
      }
      {
        !notesLoading&& !showNotesLoadingError && 
        <>
          {
            notes.length > 0 ? notesGrid : <p>You dont have any note yet</p>
          }
        </>
      }
      {
        showNoteModal && <AddNotes 
        onDismiss ={()=>setShowNoteModal(false)}
        onSaveNote={(note)=>{
          setNotes([...notes, note])
          setShowNoteModal(false) 
        }}
        />
      }
      {noteToEdit && <AddNotes
      noteToEdit={noteToEdit}
      onDismiss={()=>setNoteToEdit(null)}  
      onSaveNote={(updatedNote)=>{
        setNotes(notes.map(existNote => existNote._id === updatedNote._id ? updatedNote : existNote ))
        setNoteToEdit(null)
      }}
      />
    }
    </Container>
  );
}

export default App;
 