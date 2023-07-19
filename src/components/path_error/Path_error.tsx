import { BiError } from "react-icons/bi";

const Path_error = () => {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="flex flex-col items-center flex-wrap">
                <BiError className="text-7xl text-red-600 mb-3" />
                <h1 className="text-7xl text-red-600 text-center break-all">Path 404</h1>
                
            </div>
        </div>
    )
}

export default Path_error;
