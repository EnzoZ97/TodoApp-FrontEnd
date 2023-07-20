import { useState } from 'react';
import { BsFillTrashFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { AiFillCheckCircle } from "react-icons/ai";

interface User  {
    _id: string,
    name : string,
    email: string,
    password: string,
    age: number,
    gender: string,
    file: string,
    isLoggedIn : boolean,
    todo_list : Array<{
        id: string,
        task: string,
        Iscompleted : boolean
    }>
}

interface task {
    id: string ,
    task: string ,
    Iscompleted : boolean
}
interface Props {
    user : Array<User>,
    remove(TaskId : string) : void,
    taskCompleted (taskId: string) : void,
    updateTask (taskId : string) : void,
    isToEdit ( taskId : string ) : boolean,
    edit (taskId : string) : void,
    Tasks_To_Edit : task[]
}

const List = ({user, remove, taskCompleted, updateTask, edit, isToEdit, Tasks_To_Edit} : Props) => {
  
    function addNewTask (value : string, id : string) : void {
        let belongs : boolean = Tasks_To_Edit.some((elem) => elem.id === id);
        if(belongs){
            for(let i = 0; i < Tasks_To_Edit.length; i++){
                if(Tasks_To_Edit[i].id === id){
                    Tasks_To_Edit[i].task = value;
                }
            }
        }
    }



    return (
        <div className="w-full mt-5 flex flex-col items-center">
            <div role="task" className="w-full flex flex-col rounded mb-3 flex justify-between items-center">
            {
                user[0].todo_list.map((elem) => (
                    <div role="task" key={elem.id} className="w-full flex flex-col sm:flex-row bg-purple-500 rounded p-1 mb-3 flex justify-between items-center">
                        <div role="leftSide" className="mb-3 sm:mb-0">
                            {
                                isToEdit(elem.id)
                                ?
                                <div role="icon-to-update-new-task">
                                    <AiFillCheckCircle className={"text-green-400 hover:text-green-500 cursor-pointer sm:text-2xl text-4xl"}
                                        onClick={() => updateTask(elem.id)} />  
                                </div>
                                :
                                <div role="icons-to-complete-or-edit-task">
                                    <AiFillCheckCircle className={elem.Iscompleted ? "text-gray-500 sm:text-2xl text-4xl" : "text-green-400 hover:text-green-500 cursor-pointer sm:text-2xl text-4xl"} 
                                        onClick={() => !elem.Iscompleted ? taskCompleted(elem.id) : ''} />
                                    <FiEdit className="mt-3 text-blue-400 hover:text-blue-500 cursor-pointer sm:text-2xl text-4xl"
                                        onClick={() => edit(elem.id)} />
                                </div>
                            } 
                        </div>

                        <div role="middle" className="w-full sm:w-3/5">
                            {
                                isToEdit(elem.id)
                                ? 
                                <input type="text" placeholder="write your new task" className="w-full text-center rounded outline-cyan-500 p-2"
                                    onChange={(e) => addNewTask(e.target.value, elem.id)} />
                                :
                                <p className={elem.Iscompleted ? "text-center line-through text-gray-500 text-xl break-all" : "text-center text-xl break-all"}  >{elem.task}</p>
                            }              
                        </div>
                        <div role="rightSide" className="mt-3 sm:mt-0">
                            <BsFillTrashFill className="text-red-500 hover:text-red-600 cursor-pointer sm:text-2xl text-4xl"
                                onClick={() => remove(elem.id)} />
                        </div>
                    </div>
                ))
}
            </div>
        </div>
    )
}

export default List;