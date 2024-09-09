


import Sidebar from '../components/Sidebar'
import ClassesTable from '../components/classesComponents/ClassesTable'



const Classes = () => {

  return (
    <div className='flex font-almarai'>
       <div className="basis-[15%] h-[100vh]  border">
            <Sidebar/>
        </div>
       <div>
        <ClassesTable/>
       </div>
    </div>
  )
}

export default Classes