import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { geturl_image } from '../service/url_image';

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
    const [id, setid] = useState<string>("");
    const [thereIsImage, setthereIsImage] = useState<boolean>(false);
    const [file, setFile]  = useState<File | null>(null);
    const [ url , seturl ] = useState("");


    
    useEffect(() => {
        getUsers().then(result => {
            for(let i = 0; i < result.length ; i++){
                if(result[i].isLoggedIn){
                    setuser([result[i]]);
                    setid(result[i]._id);
                    if(result[i].file === ""){
                        setthereIsImage(true);
                    }
                    else{
                        setthereIsImage(false);
                    }
                }
            }
        }
        )
    },[])

    function Logout () : void{
        const url : string = `${process.env.REACT_APP_BACKEND_API}/api/update/${id}`;
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

    async function getImage (file: File | null) {
        const url : string = await geturl_image(file as File);
        seturl(url);
    };

    async function checkFile (e : React.ChangeEvent<HTMLInputElement>) : Promise<void>{  
        const file = e.target.files?.[0];
        setFile(file || null);   
        await getImage(file as File);
    } 

    
    

     function updateImage() : void {
        console.log("este es la url de la imagen: " + url);
        const newImage : { file : string } = {
            file : url
        };
        const urlPost : string = `${process.env.REACT_APP_BACKEND_API}/api/update/${user[0]._id}`;

        fetch(urlPost, {
            method: 'PATCH',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(newImage)
          })
          .then(response => response.json())
          .then(result => {
            console.log("Has been sent");
            window.location.reload();
          })
          .catch(err => {
            console.error(err);
            console.log("Couldn't send the data")
          })
          
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
                                    user[0].file} alt="profile_image" className="h-40 w-48  sm:h-56 sm:w-64 rounded mx-auto mb-1" />
                                    {
                                        thereIsImage 
                                        ?
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-sky-500 text-center">There's a problem with upload the image, plase try again upload a image and wait 3 seconds before to do click</p>
                                            <input type="file" id="image" className="mt-2 p-1.5 rounded outline-blue-600 w-full"
                                            onChange={(e) => checkFile(e)}
                                            name="image" />
                                            <button type="submit" className="sm:w-3/5 w-full rounded-lg mx-auto text-lg p-2 mb-3 bg-blue-600 hover:bg-blue-700 font-sans font-medium text-white tracking-wider"
                                                 onClick={() => updateImage()}>Update Image</button>
                                        </div>
                                        :
                                        ""
                                    }
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