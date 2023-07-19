interface Props{
    messageByAdd : boolean,
    messageByRemove : boolean,
    messageByEditedTask : boolean
}

const Notices = ({messageByAdd, messageByRemove, messageByEditedTask} : Props) => {
    return (
        <div role="Notices" className="w-full">    
            {
                messageByAdd ? <div className="bg-green-500 text-center my-3 p-3 font-bold font-sans tracking-wider" >Task Added</div> : ""
            }
            {
                messageByRemove ? <div className="bg-red-500 text-center my-3 p-3 font-bold font-sans tracking-wider" >Task removed</div> : ""
            }
            {
                messageByEditedTask ? <div className="bg-blue-500 text-center my-3 p-3 font-bold font-sans tracking-wider" >Task edited</div> : ""
            }
        </div>
    )
}

export default Notices;