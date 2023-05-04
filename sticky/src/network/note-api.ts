import { Interface } from "readline"
import { Note } from "../models/note"
import { User } from "../models/user"

async function fetchdata(input:RequestInfo, init?: RequestInit){
    const res = await fetch(input, init)
    if(res.ok){
        return res
    }else{
        const errorBody = await res.json()
        const errorMessage = errorBody.error
        throw Error(errorMessage)
    }
}


export async function getLoggedInUser(): Promise<User>{
    const response = await fetchdata("/api/users", {method: "GET"})
    return response.json()
}

export interface SignUpCredentials{
    username:string,
    email: string,
    password: string,

}

export async function signUp(credentials: SignUpCredentials):Promise<User>{
    const res = await fetchdata("/api/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    })
    return res.json()
}

export interface LoginCredentials{
    username:string,
    password: string,

}
export async function login(credentials: LoginCredentials):Promise<User>{
    const res = await fetchdata("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    })
    return res.json()
}

export async function logout(){
    await fetchdata("/api/users/logout", {method:"POST"})
}



export async function fetchNotes():Promise<Note[]>{
    const response = await fetchdata('http://localhost:5000/api/notes',{method:"GET"})
    return response.json()
}


export interface NoteInput{
    title: string,
    text?: string
}
export async function createNote(note: NoteInput): Promise<Note>{
    const res = await fetchdata('http://localhost:5000/api/notes',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note),
    })
    return res.json()
}

export async function updateNotes(noteId: string, noteInput:NoteInput):Promise<Note> {
    const res= await fetchdata("/api/notes/" + noteId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(noteInput)
    })
    return res.json()
}
export async function deleteNotes(noteId: string){
    await fetchdata("/api/notes/" + noteId, {method: "DELETE"})
}