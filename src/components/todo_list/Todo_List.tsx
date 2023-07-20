import { useState, useEffect } from 'react';
import { getUsers } from '../service/data';
import { v4 as uuidv4 } from 'uuid';
import SyncLoader from "react-spinners/ClipLoader";

import Navbar from './navbar/Navbar';
import List from './list/List';
import Notices from './notices/Notices';

const Todo_List = () => {
    interface User  {
        _id: string ,
        name : string ,
        email: string ,
        password: string ,
        age: number ,
        gender: string ,
        file: string ,
        isLoggedIn : boolean ,
        todo_list : Array<{
            id: string ,
            task: string ,
            Iscompleted : boolean
        }>
    }

    interface task {
        id: string ,
        task: string ,
        Iscompleted : boolean
    }

    const [user, setuser] = useState<Array<User>>([]);
    const [task, settask] = useState<string>("");
    const [Tasks_To_Edit, setTasks_To_Edit] = useState<Array<task>> ([]);
    const [messageByAdd, setmessageByAdd] = useState (false);
    const [messageByRemove, setmessageByRemove] = useState(false);
    const [messageByEditedTask, setmessageByEditedTask] = useState(false);


    useEffect(() => {
        getUsers().then((result) => {
            for(let i = 0; i < result.length ; i++){
                if(result[i].isLoggedIn){
                    setuser([result[i]]);
                }
            }
        })
    }, [])

    function handleSubmit (event: React.FormEvent<HTMLFormElement>) : void {
        event.preventDefault();
        const url : string = `${process.env.REACT_APP_BACKEND_API}/api/update/${user[0]._id}`;
        const new_task : task = {
            id : uuidv4(),
            task: task,
            Iscompleted : false
        }
        let newList : Array<User> = user;
        newList[0].todo_list.push(new_task);
        const new_todo_list : { todo_list : Array<task> } = {
            todo_list : newList[0].todo_list
        }

        fetch(url, {
            method: 'PATCH',
            headers: {'Content-type' : 'application/json'},
            body : JSON.stringify(new_todo_list)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error to send the request");
              }
            return response.json();
        })
        .then(result => {
            console.log(result + " has been added a new task");      
        })
        .catch(err => console.error(err)); 

        setmessageByAdd(true);
            setTimeout(() => {
                setmessageByAdd(false);
            },3000)
    }

    function remove ( TaskId: string ) : void{
        let new_todo_list : Array<{
            id: string ,
            task: string ,
            Iscompleted : boolean
        }> = [];
        const url : string = `${process.env.REACT_APP_BACKEND_API}/api/update/${user[0]._id}`;

        for(let i = 0 ; i < user[0].todo_list.length; i++ ){ 
            if(user[0].todo_list[i].id === TaskId){
                new_todo_list = user[0].todo_list.splice(i,1);
            }
        }

        const todo_list : { todo_list : Array<task> } = {
            todo_list : new_todo_list
        }

        fetch(url, {
            method: 'PATCH',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(todo_list)
        })
        .then(response => response.json())
        .then(result => {
            console.log("The task has been removed and TodoList has been updated");
        })
        .catch(err => console.error(err));  

        setmessageByRemove(true);
        setTimeout(() => {
        setmessageByRemove(false);
        },3000)
    }

    function taskCompleted (taskId: string) : void{
        let new_todo_list : Array<{
            id: string ,
            task: string ,
            Iscompleted : boolean
        }> = [];

        const url : string = `${process.env.REACT_APP_BACKEND_API}/api/update/${user[0]._id}`;

        for(let i = 0 ; i < user[0].todo_list.length; i++ ){ 
            if(user[0].todo_list[i].id === taskId && user[0].todo_list[i].Iscompleted === false){
                let Task : task = user[0].todo_list[i];
                Task["Iscompleted"] = true;
                new_todo_list = user[0].todo_list.splice(i,1, Task);
            }
        }

        const todo_list : { todo_list : Array<task> } = {
            todo_list : new_todo_list
        }

        fetch(url, {
            method: 'PATCH',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(todo_list)
        })
        .then(response => response.json())
        .then(result => console.log("The task has been completed and updated"))
        .catch(err => console.error(err)); 
    }

    function updateTask (taskId : string) : void {
        let new_todo_list : Array<{
            id: string ,
            task: string ,
            Iscompleted : boolean
        }> = user[0].todo_list;

        const url : string = `${process.env.REACT_APP_BACKEND_API}/api/update/${user[0]._id}`;


        for(let i = 0 ; i < user[0].todo_list.length; i++ ){ 
            if(user[0].todo_list[i].id === taskId){
                let Task : task = user[0].todo_list[i];
                Task.task = taskToReplace(taskId);
                Task.Iscompleted = false;
                new_todo_list.splice(i,1, Task);
                removeTaskToEdit(taskId);
            }
        }

        const todo_list : { todo_list : Array<task> } = {
            todo_list : new_todo_list
        }

        fetch(url, {
            method: 'PATCH',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(todo_list)
        })
        .then(response => response.json())
        .then(result => {
            console.log("The task has been updated")
        })
        .catch(err => console.error(err)); 

        setmessageByEditedTask(true);
        setTimeout(() => {
        setmessageByEditedTask(false);
        },3000)    
    
    }

    function taskToReplace( taskId : string) : string{
        let Task : string = "";
        for(let i = 0; i < Tasks_To_Edit.length; i++){
            if(Tasks_To_Edit[i].id === taskId){
                Task = Tasks_To_Edit[i].task;
            }
        }       
        return Task;
    }

    function removeTaskToEdit(taskId: string ) : void{
        let new_Tasks_To_Edit : Array<task> = [];

        for(let i = 0; i < Tasks_To_Edit.length; i++){
            if(Tasks_To_Edit[i].id === taskId){
                new_Tasks_To_Edit = Tasks_To_Edit.splice(i,1);
                setTasks_To_Edit(new_Tasks_To_Edit);
            }
        }
    }

    function edit (taskId : string) : void{
        for(let i = 0 ; i < user[0].todo_list.length; i++ ){ 
            if(user[0].todo_list[i].id === taskId){
                let Task : task = user[0].todo_list[i];
                setTasks_To_Edit([Task, ...Tasks_To_Edit]);
            }
        }       
    }

    function isToEdit ( taskId : string ) : boolean{
        let edit : boolean = false;
        for(let i = 0; i < Tasks_To_Edit.length ; i++){
            if(Tasks_To_Edit[i].id === taskId){
                edit = true;
            }
        }
        return edit;
    }   


    return (
        <div className="w-full h-screen flex justify-center items-center bg-slate-300">
            {
                user.length === 0 
                ?
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-sans text-center break-all">Please, wait while the data is uploading</h1>
                    <SyncLoader
                    color="#36d7b7"
                    size={50}
                />
                </div> 
                :
                <div className="w-full h-screen flex flex-col items-center">
                    <Navbar user={user} />
                        <div className="w-9/12 mt-5 p-4 bg-white rounded shadow-lg shadow-gray-500/50">
                            <div role="presentation" className="w-full flex flex-col justify-center items-center">
                                <h1 className="text-2xl font-sans text-center font-bold break-all">Welcome {user[0].name}</h1>
                                <img src={user[0].file === "" ? "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" :
                                    user[0].file} alt="profile_image" className="h-40 w-48  sm:h-48 sm:w-40 rounded mx-auto" /> 
                            </div>
                            <form className="w-full mt-5" onSubmit={(e) => handleSubmit(e)}>
                                <input type="text" className="w-full text-center text-lg p-3 rounded outline-cyan-500" placeholder="Write your task..." 
                                    onChange={(e) => settask(e.target.value)} />
                                <button type="submit" className="w-full p-2 mt-3  rounded bg-blue-600 hover:bg-blue-500">Add task</button>
                            </form>
                            <Notices messageByAdd={messageByAdd} messageByRemove={messageByRemove} messageByEditedTask={messageByEditedTask} />
                            <List user={user} remove={remove} taskCompleted={taskCompleted} updateTask={updateTask} isToEdit={isToEdit} edit={edit}
                                Tasks_To_Edit = {Tasks_To_Edit} setTasks_To_Edit={setTasks_To_Edit}  />
                        </div>
                </div>
            }
            
        </div>
    )
}

export default Todo_List;