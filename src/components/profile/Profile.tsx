import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiLogOut } from "react-icons/bi";
import { getUsers } from '../service/data';
import SyncLoader from "react-spinners/ClipLoader";


const Profile = () => {
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

    const navigate = useNavigate();
    const [user, setuser] = useState<Array<User>>([]);
    const [id, setid] = useState("");

    useEffect(() => {
        getUsers().then(result => {
            for(let i = 0; i < result.length ; i++){
                if(result[i].isLoggedIn){
                    console.log(result[i]);
                    setuser([result[i]]);
                    setid(result[i]._id);
                }
            }
        }
        )
    },[])

    function Logout () : void{
        const url : string = `todoapp-backend-production.up.railway.app/api/update/${id}`;
        const data : {isLoggedIn : boolean} = {
            isLoggedIn : false
        }
        fetch(url, {
            method : 'PATCH',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
        console.log("isLoggedIn has been updated");
        })
        .catch(err => {
        console.log("isLoggedIn hasn't been updated")
        })

        navigate('/');
    }

    return (
        <div className="w-full h-screen flex flex-col bg-slate-300">
            <nav className="w-full h-10 flex bg-gray-500 items-center justify-between px-5">
                <p className="font-sans text-lg">Welcome <span className="font-bold">User</span></p>
                <button className="hover:text-red-500 text-red-600" onClick={() => Logout()}>
                    <BiLogOut className="text-2xl" />
                </button>
            </nav>
            {
                user.length === 0 
                ?
                <div className="w-full h-full flex justify-center items-center">
                    <SyncLoader
                    color="#36d7b7"
                    size={50}
                />
                </div> 
                :
                <div className="w-full flex justify-center mt-10 ">
                <div className="w-3/6 shadow-lg shadow-gray-400 bg-white rounded ">
                    <h1 className="text-center text-2xl break-all">Profile</h1>
                        {
                            user.map((elem) => (
                                <div key={elem._id} role="info" className="w-full justify-center p-2">
                                    <img src={user[0].file === "" ? "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" :
                                    user[0].file} alt="profile_image" className="h-40 w-48  sm:h-56 sm:w-64 rounded mx-auto" />
                                    <div className="flex flex-col items-center">
                                        <p className="mb-2 flex flex-col sm:flex-row items-center text-center break-all">Name: <span className="font-bold ml-0 sm:ml-1">{elem.name}</span></p>
                                        <p className="mb-2 flex flex-col sm:flex-row items-center text-center break-all">email:<span className="font-bold ml-0 sm:ml-1 ">{elem.email}</span></p>
                                        <p className="mb-2 flex flex-col sm:flex-row items-center text-center break-all">Age: <span className="font-bold ml-0 sm:ml-1">{elem.age}</span></p>
                                        <p className="mb-2 flex flex-col sm:flex-row items-center text-center break-all">Gender: <span className="font-bold ml-0 sm:ml-1">{elem.gender}</span></p>
                                    </div>
                                    <div className="w-full flex justify-center mt-5">
                                        <button className="w-2/5 text-center bg-purple-500 p-3 rounded"
                                            onClick={() => navigate('/Todo_list')}>Back</button>
                                    </div>
                                </div>
                                
                                
                            ))
                        }                                    
                </div>
            </div>
            }
            
        </div>
    )
}

export default Profile;