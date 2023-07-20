import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";

interface Props {
    user :  Array<
    {
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
    }>
}

const Navbar = ({user} : Props) => {

    const navigate = useNavigate();

    function Logout () : void{
        const url : string = `${process.env.REACT_APP_BACKEND_API}/api/update/${user[0]._id}`;
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
        console.log("isLoggedIn has been uploaded ");
        })
        .catch(err => {
        console.log("Couldn't been uploaded isLoggedIn")
        })

        navigate('/');
    }

    return (
        <nav className="w-full h-10 flex bg-gray-500 items-center justify-between px-5">
                <p className="font-sans text-lg font-bold">TodoApp</p>
                <div role="buttons" className="flex">
                    <BiUser className="text-2xl text-stone-50 hover:text-zinc-500 mr-3 cursor-pointer"
                        onClick={() => navigate('/Profile')} />
                    <button className="hover:text-red-500 text-red-600" onClick={() => Logout()}>
                        <BiLogOut className="text-2xl" />
                    </button>
                </div>
        </nav>
    )
}

export default Navbar;