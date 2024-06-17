import React, { useContext, useEffect, useState } from 'react'

import BasicDetail from './BasicDetail'
import AddProject from './AddProject'
import ProjectListEdit from './ProjectListEdit'


import { db } from '../../../utils'
import { project, userInfo } from '../../../utils/schema'
import { asc, desc, eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import { toast } from 'react-toastify'
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext'


function FormContent() {

  const {user} = useUser();
  const [projectList,setProjectList]= useState([]);


  useEffect(()=>{
    user&&getProjectList();
  },[user])

  
  const getProjectList = async ()=> 
    {
      // used to retrieve projects from db ordered by id 
      const result = await db.select().from(project)
      .where(eq(project.emailRef,user?.primaryEmailAddress.emailAddress))
      .orderBy(asc(project.order))

      console.log(result);
      setProjectList(result);
    }

   


  return (
    <div className='py-12 px-6 overflow-auto'>
      <h1 className='text-4xl my-1 text-lime-400  font-mono'>WebFolio </h1>
      <h2 className='text-3xl text-lime-200 font-normal'>Start Designing Your Portfolio Page </h2>
      <BasicDetail/>
      <hr className='my-5'></hr>
      <AddProject/>
      <ProjectListEdit projectList={projectList} refreshData={getProjectList}/>

    </div>
  )
}

export default FormContent;