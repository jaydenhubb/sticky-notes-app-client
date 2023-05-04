import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {Note} from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/note-api";
import * as NotesApi from "../network/note-api"
import TextInput from "./form/TextInput";
interface AddNoteProps {
  noteToEdit?: Note,  
  onDismiss: () => void;
  onSaveNote: (note:Note) => void
}

const AddNotes = ({ onDismiss, onSaveNote, noteToEdit }: AddNoteProps) => {
    const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || ""
        }
    })

    async function onSubmit(input:NoteInput){
        try {
            let noteResponse: Note
            if(noteToEdit){
                noteResponse = await NotesApi.updateNotes(noteToEdit._id, input)
            }else{
                noteResponse = await NotesApi.createNote(input)
            }
            onSaveNote(noteResponse )
        } catch (error) {
            console.log(error);
            alert(error)
        }
    }
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{
            noteToEdit ? "Edit note": "Add note"
            }</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addNote" onSubmit={handleSubmit(onSubmit)}>
          <TextInput 
          label="Title"
          name="title"
          type="text"
          placeholder="title"
          register= {register}
          registerOptions={{required: "Required"}}
          error= {errors.title}
          />
          {/* <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control 
            type="text" 
            placeholder="Title" 
            isInvalid={!!errors.title}
            {...register("title", {required: "required"})} />
            <Form.Control.Feedback type="invalid">
                {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group> */}
          <TextInput
          name="text"
          label="Text"
          as="textarea"
          placeholder="Text"
          register= {register}
          />
          {/* <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <Form.Control 
            as="textarea" 
            rows={5} 
            placeholder="Text"
            {...register("text")} />
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
        type="submit"
        form="addNote"
        disabled={isSubmitting}>
        
            Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNotes;
