import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUsers } from '../service/data';
import { SHA256 } from 'crypto-js';

import { FaArrowRight } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BiUser } from "react-icons/bi";


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


const Login = ( ) => {
    const navigate = useNavigate();
    const [email, setemail] = useState("");
    const [emailError, setemailError] = useState(false);
    const [password, setpassword] = useState("");
    const [passwordError, setpasswordError] = useState(false);
    const [activeButton, setactiveButton] = useState(false);

    const [users, setusers] = useState<Array<User>>([]);


    function result () : void {
        const emailRegex : RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordRegex : RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if(emailRegex.test(email) && passwordRegex.test(password)){
           setactiveButton(true);
        }
    }

    useEffect(() => {
        result();
        getUsers().then(result => {
            setusers(result);
        })
        
    },[result])

    function handleSubmit ( event: React.FormEvent<HTMLFormElement> ) : void {
        event.preventDefault();
    }

    function checkEmail () : boolean{
        const emailRegex : RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if ( email === " " || !emailRegex.test(email)){
            setemailError(true);
        }
        else{
            setemailError(false);
        }
        return emailError;
    }

    function checkPassword () : boolean{
        const passwordRegex : RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if ( password === "" || !passwordRegex.test(password)) {
            setpasswordError(true);
        } 
        else{
            setpasswordError(false);
        }  
        return passwordError;
    }

    function validateUser() : boolean {
        const data : {isLoggedIn : boolean} = {
            isLoggedIn : true
        }

        let isValidate : boolean = false;

        for (let i = 0; i < users.length; i++){
            let password_crypto : string =  SHA256(password).toString();
            if(users[i].email === email && users[i].password === password_crypto
                && users[i].isLoggedIn === false){
                    console.log("hola");
                Allow_Access(users[i]._id);
                
                let url : string = `todoapp-backend-production.up.railway.app/api/update/${users[i]._id}`;

                fetch(url,{
                    method: 'PATCH',
                    headers: {'Content-type' : 'application/json'},
                    body: JSON.stringify(data)
                  })
                  .then(response => response.json())
                .then(result => {
                console.log(result + " has been updated");
                })
                .catch(err => {
                console.log("The data hasn't been update")
                })


                isValidate = true;
            }
        }
        return isValidate;
    }

    function Allow_Access( _id : string ) : void{
        const data : {isLoggedIn : boolean} = {
            isLoggedIn : false
        }

        console.log("hola");
        let url : string = `todoapp-backend-production.up.railway.app/api/update/${_id}`;
        fetch(url,{
            method: 'PATCH',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(data)
          })
          .then(response => response.json())
        .then(result => {
        console.log(result + " has been updated");
        })
        .catch(err => {
        console.log("The data hasn't been update")
        })
    }

    function SingIn (e :React.MouseEvent<HTMLButtonElement, MouseEvent>) : void{
        //preventDefault for avoid "Form submission cancelled because the form is not connected"
        e.preventDefault();
        if(activeButton && validateUser()){
            
            navigate("/Todo_list");
        }
    }




    

    return (
        <div className="w-full h-screen  flex justify-center bg-slate-300">
            <div className="w-1/2  h-4/6  flex flex-col items-center bg-white rounded-md mt-10 p-5 shadow-lg shadow-gray-400">
            <h1 className="text-center text-3xl font-mono font-medium tracking-wider">Welcome</h1>
            <form className="w-full mt-5 flex flex-col" onSubmit={(e) => handleSubmit(e)}>
                <div className="flex justify-around flex-wrap mb-4 flex-col sm:text-left text-center">
                    <label htmlFor="user_email" className="text-xl md:m-0 flex items-center flex-wrap flex-col sm:flex-row">
                       <HiOutlineMail className="text-2xl text-gray-500 mr-3 my-3 sm:my-0" /> Enter your email:</label>
                    <input type="email" className="mt-2 p-1.5 rounded outline-blue-600 w-full" id="user_email" 
                    onBlur={() => checkEmail()}
                    onChange={(e) => setemail(e.target.value)}  />
                    {
                        emailError ?
                        <span className="text-sans text-red-500">Please enter a valid email adress</span>
                        :
                        ""
                    }
                </div>

                <div className=" flex justify-around flex-wrap flex-col sm:text-left text-center">
                    <label htmlFor="email_password" className="text-xl md:m-0 flex items-center flex-col sm:flex-row">
                        <BiUser className="text-2xl text-gray-500 mr-3 my-3 sm:my-0" /> Enter your password:</label>
                    <input type="password" className="mt-2 p-1.5 rounded border-none outline-blue-600 w-full" id="email_password"
                     onChange={(e) => setpassword(e.target.value)}
                     onBlur={() => checkPassword()} />
                    
                    {
                        passwordError ?
                        <span className="text-sans text-red-500"> Your password must have minimum 8 characters, at least one letter and one number.</span>
                        :
                        ""
                    }
                
                </div>
                <div className="flex flex-col mt-14" role="buttons">
                    <button type="submit" disabled={!activeButton} 
                        onClick={(e) => SingIn(e)}
                        className={activeButton ? "flex justify-center items-center w-full rounded-lg mx-auto text-lg p-2 mb-3 bg-blue-600 hover:bg-blue-700 font-sans font-medium text-white tracking-wider"
                            : "flex justify-center items-center w-full rounded-lg mx-auto text-lg p-2 mb-3 bg-gray-400 font-sans font-medium text-white tracking-wider"}
                        
                        >Sing in
                        <FaArrowRight className="ml-3"/> </button>
                    <Link to="/Register" className="text-center">
                        <p className="font-sans">Are you a new user? <span className="text-blue-500 hover:text-blue-700" >Sing up</span> </p>
                    </Link>
                
                </div>

            </form>
        </div>
        </div>
    )
}

export default Login;