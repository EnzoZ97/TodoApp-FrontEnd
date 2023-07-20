import react, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { geturl_image } from './service/url_image';
import { getPassword } from './service/password';

import { HiOutlineMail } from "react-icons/hi";
import { BiUser } from "react-icons/bi";
import { GiAges } from "react-icons/gi";
import { BsImage } from "react-icons/bs";


const Register = () => {
    interface newUser  {
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
    const [name, setname] = useState("");
    const [nameError, setnameError] = useState(false);

    const [email, setemail] = useState("");
    const [emailError, setemailError] = useState(false);

    const [password, setpassword] = useState("");
    const [passwordError, setpasswordError] = useState(false);

    const [age, setage] = useState(0);
    const [ageError, setageError] = useState(false);

    const [gender, setgender] = useState("");
    const [genderError, setgenderError] = useState(false);

    const [file, setFile]  = useState<File | null>(null);
    const [ url , seturl ] = useState("");

    const[successMessage, setsuccessMessage] = useState(false);
    const[errorMessage, seterrorMessage] = useState(false);

    useEffect(() => {
        if(file){
            geturl_image(file as File).then(result => {
                seturl(result)
            })
        }
    }, [file]);

    function checkName () : boolean{
        //throw any symbols, only characters
        const nameRegex : RegExp = /^[a-zA-Z ]+$/i;
        if (name.length === 0 && !nameRegex.test(name)){
            setnameError(true);
        }
        else{
            setnameError(false);
        }
        return nameError;
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

    function checkAge () : boolean{
        if(age < 18){
            setageError(true);
        }
        else{
            setageError(false);
        }
        return ageError;
    }

    function checkGender () : boolean{
        if(gender.length === 0){
            setgenderError(true);
        }
        else{
            setgenderError(false);
        }
        return genderError;
    }

    function checkFile (e : react.ChangeEvent<HTMLInputElement>) : void{  
        const file = e.target.files?.[0];
        setFile(file || null);   
            
    } 

    function handleSubmit ( event: React.FormEvent<HTMLFormElement> ) : void {
        event.preventDefault();
    }

    function checkForm() : boolean{
        let isValid : boolean = false;
        if(!checkName() && !checkEmail() && !checkPassword() && !checkAge() && !checkGender() ){
            isValid = true;
        }
        else{
            isValid = false;
        }
        return isValid;
    }

    function SignUpNewUser () : void {
        geturl_image(file as File).then(result => {
            seturl(result)
        })
        const urlPost : string = `${process.env.REACT_APP_BACKEND_API}/api/create`;

        const user : newUser = {
            name : name,
            email : email,
            password : getPassword(password),
            age: age,
            gender: gender,
            file : url,
            isLoggedIn : false,
            todo_list : []
        }

        if(checkForm()){
            fetch(urlPost, {
                method: 'POST',
                headers: {'Content-type' : 'application/json'},
                body: JSON.stringify(user)
              })
              .then(response => response.json())
              .then(result => {
                console.log(result + "Has been sent");
                setsuccessMessage(true);
                setTimeout(() => {
                    setsuccessMessage(false);
                }, 4000);
              })
              .catch(err => {
                console.error(err);
                console.log("Couldn't send the data")
              })
        }
        else{
            seterrorMessage(true);
            setTimeout(() => {
                seterrorMessage(false);
            }, 4000);
            console.error("The form has not been fill out correctly");
        }
        
    }

    return (
        <div className="w-1/2  h-full flex flex-col items-center bg-white rounded-md mt-10 p-5 shadow-lg shadow-gray-400">
            <div className="w-full ">
                <button className="bg-red-500 py-2 px-4 rounded cursor-pointed hover:bg-red-400 "
                    onClick={() => navigate('/')}>Back</button>
            </div>
            <h1 className="text-center text-3xl font-mono font-medium tracking-wider">Create Account</h1>
            <form className="w-full h-full mt-5 flex flex-col" onSubmit={(e) => handleSubmit(e)}>
                <div role="user" className="flex justify-around flex-wrap mb-4 flex-col sm:text-left text-center">
                    <label className="text-gray-500 md:m-0 flex items-center flex-wrap flex-col sm:flex-row" htmlFor="name"> 
                    <BiUser className="text-2xl text-gray-500 mr-3 my-3 sm:my-0" /> your Full Name</label>
                    <input type="text" className="mt-2 p-1.5 rounded outline-blue-600 w-full" id="name"
                        onChange={(e) => setname(e.target.value)} />
                    {
                        nameError ?
                        <span className="text-sans text-red-500">Please enter a valid name</span>
                        :
                        ""
                    }
                </div>
                <div role="email" className="flex justify-around flex-wrap mb-4 flex-col sm:text-left text-center">
                    <label htmlFor="name" className="text-gray-500 md:m-0 flex items-center flex-wrap flex-col sm:flex-row">
                        <HiOutlineMail className="text-2xl text-gray-500 mr-3 my-3 sm:my-0" /> your Email</label>
                    <input type="email" className="mt-2 p-1.5 rounded outline-blue-600 w-full" id="email"
                        onChange={(e) => setemail(e.target.value)} />
                    {
                        emailError ?
                        <span className="text-sans text-red-500">Please enter a valid email adress</span>
                        :
                        ""
                    }
                </div>
                <div role="password" className=" flex justify-around flex-wrap mb-4 flex-col sm:text-left text-center">
                    <label htmlFor="email_password" className="text-gray-500 md:m-0 flex items-center flex-wrap flex-col sm:flex-row">
                        <BiUser className="text-2xl text-gray-500 mr-3 my-3 sm:my-0" /> Enter your password:</label>
                    <input type="password" className="mt-2 p-1.5 rounded border-none outline-blue-600 w-full" id="email_password"
                        onChange={(e) => setpassword(e.target.value)} />
                    {
                        passwordError ?
                        <span className="text-sans text-red-500">Your password must have minimum 8 characters, at least one letter and one number.</span>
                        :
                        ""
                    }
                </div>
                <div role="age" className="flex justify-around flex-wrap mb-4 flex-col sm:text-left text-center">
                    <label htmlFor="age" className="text-gray-500 md:m-0 flex items-center flex-wrap flex-col sm:flex-row">
                        <GiAges className="text-2xl text-gray-500 mr-3 my-3 sm:my-0" /> your Age</label>
                    <input type="number" className="mt-2 p-1.5 rounded outline-blue-600 w-full" id="age"
                        onChange={(e) => setage(parseInt(e.target.value))}/>
                    {
                        ageError ?
                        <span className="text-sans text-red-500">your age must be higher than 17</span>
                        :
                        ""
                    }
                </div>
                <div role="gender" className="flex  flex-wrap mb-4 flex-col ">
                    <p className="text-gray-500 mb-3 text-center sm:text-left">your Gender</p>
                    <div className="w-full flex justify-around">
                        <div className="flex items-center">
                            <input type="radio" id="male" name="gender" value="male" onChange={(e) => setgender(e.target.value)} />
                            <label htmlFor="male" className="flex items-center ml-3">Male</label>

                        </div>
                        <div className="flex items-center ">
                            <input type="radio" id="female"  name="gender" value="female" onChange={(e) => setgender(e.target.value)}/>
                            <label htmlFor="female" className="flex items-center ml-3">Female</label> 
                        </div>
                    </div>
                    {
                        genderError ?
                        <span className="text-sans text-red-500">You must choose a gender</span>
                        :
                        ""
                    }
                </div>
                <div role="image" className="flex justify-around flex-wrap mb-4 flex-col sm:text-left text-center">
                    <label htmlFor="image" className="text-gray-500 md:m-0 flex items-center flex-wrap flex-col sm:flex-row">
                        <BsImage className="text-2xl text-gray-500 mr-3 my-3 sm:my-0" /> your Profile Image</label>
                    <input type="file" id="image" className="mt-2 p-1.5 rounded outline-blue-600 w-full"
                        onChange={(e) => checkFile(e)}
                        name="image" />
                </div>

                <div role="alerts" className="mx-auto w-full flex flex-col">
                    {
                        successMessage ? <span className="p-3 bg-green-500 font-bold rounded text-center">User register successfully</span> : ""
                    }
                    {
                        errorMessage ? <span className="p-3 bg-red-500 font-bold rounded text-center">Fill out the form correctly</span> : ""
                    }
                    
                </div>

                <div className="flex flex-col mt-5" role="buttons">
                    <button type="submit" 
                        className="flex justify-center items-center w-full rounded-lg mx-auto text-lg p-2 mb-3 bg-blue-600 hover:bg-blue-700 font-sans font-medium text-white tracking-wider"
                        onClick={() => SignUpNewUser()}>
                            Sign up </button>
                
                </div>
            </form>
        </div>
    )
}

export default Register;