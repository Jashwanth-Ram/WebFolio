import { TwicPicture } from '@twicpics/components/react'
import { eq } from 'drizzle-orm';
import { GripVertical, Image, LineChart, Link, SquareStack, Trash2 } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { ProjectClicks, project } from '../../../utils/schema';
import { db } from '../../../utils';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../utils/firebaseConfig';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import Swal from 'sweetalert2';
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext';


function ProjectListEdit({projectList,refreshData})
 {

    const [selectedOption,setselectedOption] = useState();
    const [projectListData,setProjectListData] = useState([]);
    const{updatePreview,setUpdatePreview}  = useContext(PreviewUpdateContext);


    useEffect(()=>
    {
        projectList&&setProjectListData(projectList)

    },[projectList])

    let timeoutid;

    const onInputChange = (value,fieldName,projectId)=>
        {
            clearTimeout(timeoutid);
            timeoutid = setTimeout(async ()=>{
    
                // update db with given username 
                const res = await db.update(project)
                .set({ 
                    [fieldName] : value
                }).where(eq(project.id,projectId))
    
                if(res)
                {
                    toast.success('Saved!',{
                        position:'top-right'
                    })
                    setUpdatePreview(updatePreview+1);
                }
                else
                {
                    toast.error('Error!',{
                        position:'top-right'
                    })
                }
            },1000)    
        }

    const handleFileUploadForProject =(event,projectId,fieldName)=>
            {
                const file = event.target.files[0];
                console.log("In project")
        
                const fileName = Date.now().toString()+'.'+file.type.split('/')[1];
                console.log(fileName)
        
        
                const storageRef = ref(storage, fileName);
                
        
               uploadBytes(storageRef, file).then( async (snapshot) => {
                console.log('Uploaded a blob or file!');
        
                const result = await db.update(project).set(
                    {
                        [fieldName]:fileName+"?alt=media"
                    }).where(eq(project.id,projectId))

                    console.log('result',result)
                    if(result)
                    {
                        refreshData()
                        toast.success('Saved!',{
                            position:'top-right'
                        })
                        setUpdatePreview(updatePreview+1);


                    }
                    },(e)=>console.log(e));
        } 

   {/*} const onProjectDelete = (projectId)=>
        {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then( async (result) => {
                if (result.isConfirmed) {

                    const result = await db.delete(project).where(eq(project.id,projectId))
                    
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                  });
                  refreshData();
                  toast.error('Deleted!',{
                    position:'top-right'
                })
                setUpdatePreview(updatePreview+1);

                }
              });
        }*/}

        const onProjectDelete = (projectId) => {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // First, delete the related entries in projectClicks
                    const deleteClicksResult = await db.delete(ProjectClicks).where(eq(ProjectClicks.projectRef, projectId));
        
                    if (deleteClicksResult) {
                        // If successful, proceed to delete the project
                        const deleteProjectResult = await db.delete(project).where(eq(project.id, projectId));
        
                        if (deleteProjectResult) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                            refreshData();
                            toast.error('Deleted!', {
                                position: 'top-right'
                            });
                            setUpdatePreview(updatePreview + 1);
                        } else {
                            toast.error('Error deleting project!', {
                                position: 'top-right'
                            });
                        }
                    } else {
                        toast.error('Error deleting project clicks!', {
                            position: 'top-right'
                        });
                    }
                }
            });
        }
        

        const handleOnDragEnd =async (result)=>
            {
                if(!result.destination) return;

                const newList =Array.from(projectListData);
                const [reorderList] = newList.splice(result.source.index,1);
                newList.splice(result.destination.index,0,reorderList);
                setProjectListData(newList);
                console.log(newList)
                console.log(result)

                const result1  = await db.update(project)
                .set({
                    order:result?.destination.index
                }).where(eq(project.order,result.source.index))
                .where(eq(project.id,result?.draggableId));
                if(result)
                    {
                        setUpdatePreview(updatePreview+1);

                    }
                console.log(result1);
            }

  return (
     
    <div className='mt-10'>
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='droppable'>
                {
                    (provided)=>(
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                               { projectListData.map((project,index)=>(

            <Draggable draggableId={(project.id).toString()} index={index}>
                {(provided)=>(

                       <div key={project.id} ref={provided.innerRef} {...provided.draggableProps}
                        className='my-7 bg-gray-800 p-5 rounded-lg flex items-center gap-4' >
                            <div {...provided.dragHandleProps}>
                            <GripVertical />
                            </div>
                            <div className='flex flex-col w-full'>
                       <div className='flex items-center gap-3'>
                       <label htmlFor={'project-file-input'+index} className='cursor-pointer'>
           
                      <TwicPicture src={project.logo} className='w-[50px] h-[50px] rounded-full'></TwicPicture>
                      </label>
                      <input type='file' id={'project-file-input'+index} style={{display:'none'}}
                   accept='image/png, image/gif, image/jpeg'
                   onChange={(event)=>handleFileUploadForProject(event,project.id,'logo')}
                   />
                      <input type="text" placeholder="Project / Profile name"
                      defaultValue={project.name}
                       className="input input-bordered w-full my-3 " 
                       onChange={(event)=>onInputChange(event.target.value,'name',project.id)}
                       />
           
                      </div>
           
                      <input type="text" placeholder="Description"
                       className="input input-bordered w-full text-sm"
                       defaultValue={project.desc}
                       onChange={(event)=>onInputChange(event.target.value,'desc',project.id)}
                       />
           
                       <div>
                       <div key={index} className='flex gap-3 mt-6 items-center justify-between' >
           
                       <div  className='flex gap-3 mt-3'>
           
                       <Link className={`h-12 w-12  text-blue-500 p-3 cursor-pointer rounded-md hover:bg-gray-600
                       ${selectedOption=='url'+index && 'bg-gray-600'}
                       `}
                       onClick={()=>setselectedOption('url'+index)} />
           
                       <SquareStack key={index} className={`h-12 w-12  text-yellow-500 p-3 cursor-pointer rounded-md hover:bg-gray-600
                       ${selectedOption=='category'+index && 'bg-gray-600'}
                       `}
                       onClick={()=>setselectedOption('category'+index)} />
           
           
           
                       <Image key={index} className={`h-12 w-12  text-teal-500 p-3 cursor-pointer rounded-md hover:bg-gray-600
                       ${selectedOption=='banner'+index && 'bg-gray-600'}
                       `}
                       onClick={()=>setselectedOption('banner'+index)} />
           
                       <LineChart key={index} className={`h-12 w-12  text-purple-500 p-3 cursor-pointer rounded-md hover:bg-gray-600
                       ${selectedOption=='linechart'+index && 'bg-gray-600'}
                       `}
                       onClick={()=>setselectedOption('linechart'+index)} />
           
           
                 
                           
           
           
                       </div>
           
           
           
                       <div className='flex gap-3 items-center'>
           
                           <button className='btn btn-outline btn-error btn-sm' onClick={()=>onProjectDelete(project.id)}><Trash2/></button>
                       <input type="checkbox"
                              className="toggle toggle-success"
                              onChange={(event)=>onInputChange(event.target.checked,'active',project.id)}
                              defaultChecked ={project.active}
                         />
           
                       </div>
           
           
           
           
                       </div>
                       {
                       selectedOption=='url'+index?
           
                       <div className='mt-2'>
           
                       <label className="input input-bordered flex items-center gap-2">
                           <Link/>
                        <input type="text" 
                        onChange={(event)=>onInputChange(event.target.value,'url',project.id)}
                         className="grow" placeholder="Url"
                         defaultValue={project?.url}
                         />
                       </label>
           
                       </div>
                       :
                       
                       selectedOption=='category'+index?
                        <div className='mt-2'>
                      {/*  <label className="input input-bordered flex items-center gap-2"> */}
                       
           
                       <label className='my-2'>Category</label>
                           {/* <SquareStack/>*/}
           
                           <select className="select select-bordered w-full" onChange={(event)=>onInputChange(event.target.value,'category',project.id)} 
                           >
                               <option disabled selected>{project.category}</option>
                               <option>📸 Instagram</option>
                               <option>📘 FaceBook</option>
                               <option>🔗 LinkedIn</option>
                               <option>🐙 GitHub</option>
                               <option>🌐 Web App</option>
                               <option>🤖 AI</option>
                               <option>📱 Mobile App</option>
                               <option>🎨 Design Tool</option>
                               <option>📚 Educational</option>
                               <option>💼 Services</option>
                               <option>💻 Technology</option>
           
                               </select>
                               {/* </label> */}
                        </div> :
           
                  selectedOption=='banner'+index?
                       
                   <div className='mt-2'>
           
           
                       <label>Add Banner</label>
           
                   <label className=" flex items-center gap-2 cursor-pointer" htmlFor={'project-banner-file-input'+index}> 
           
                       <TwicPicture 
                       src={project?.banner}
                       className='w-[100px] rounded-md'>
                           </TwicPicture>
                   </label>
           
                           <input type="file"   id={'project-banner-file-input'+index}
                           onChange={(event)=>handleFileUploadForProject(event,project.id,'banner')}
                           accept='image/png, image/gif, image/jpeg'
                           style={{display:'none'}}
           
           
                           />
           
                           </div>:
                           selectedOption=='linechart'+index?
                       
                           <div className='mt-2 flex justify-between items-center border p-3 rounded-lg'>
                               <label>Show Project Visitors Graph</label>
           
                               <input type="checkbox"
                              className="toggle toggle-success"
                              onChange={(event)=>onInputChange(event.target.checked,'showGraph',project.id)}
                              defaultChecked ={project.showGraph}
                         />
           
           
           
                   
                           </div> : null}
           
                   </div>
           
           
                       </div>
                       </div>
                )}
            </Draggable>
                   ))}

                        </div>
                    )
                }
        </Droppable>
        </DragDropContext>

    </div>
  )
}

export default ProjectListEdit