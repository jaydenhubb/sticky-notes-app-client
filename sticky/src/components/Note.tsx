import styles from '../styles/Note.module.css'
import { Card } from "react-bootstrap"
import {MdDelete} from "react-icons/md"
import { Note as NoteModel } from "../models/note"
import { formatDate } from '../utils/formatDate'
import styleUtil from "../styles/util.module.css"

interface NoteProps{
    note:NoteModel
    onNoteClick:(note: NoteModel)=>void
    className?: string
    onDeleteNote: (note:NoteModel)=>void
}

const Note = ({note, className, onDeleteNote, onNoteClick}:NoteProps) => {
    const {title, text, createdAt, updatedAt} = note

    let createdUpdatedText : string
    if(createdAt < updatedAt){
        createdUpdatedText = "updated: " +formatDate(updatedAt)
    }else{
        createdUpdatedText = "Created: " + formatDate(createdAt)
    }
  return (
    <Card className={`${styles.noteCard} ${className}`} onClick={()=>{onNoteClick(note)}}>
        <Card.Body>
            <Card.Title  className={styleUtil.flexCenter}>
                {title}
                <MdDelete 
                onClick={(e)=>{onDeleteNote(note)
                e.stopPropagation()
                }}
                className='text-muted ms-auto'/>
            </Card.Title>
            <Card.Text className={styles.cardText}>
                {text}
            </Card.Text>
        </Card.Body>
        <Card.Footer className='text-muted'>
            {createdUpdatedText}
        </Card.Footer>
    </Card>
  )
}

export default Note