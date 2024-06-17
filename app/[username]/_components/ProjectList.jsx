import { TwicPicture } from '@twicpics/components/react';
import React, { useContext, useEffect, useState } from 'react'
import { ProjectClicks, project, userInfo } from '../../../utils/schema';
import moment from 'moment/moment';
import { db } from '../../../utils';
import { eq, sql } from 'drizzle-orm';
import AnalyticChart from './AnalyticChart'
import { useUser } from '@clerk/nextjs';
import UserDetailInfo from './UserDetailInfo';


function ProjectList({xyz,projectList}) {


  const {user} = useUser();
  const[projectClickData,setProjectClickData] = useState([]);


  useEffect(()=>{
    user&&ProjectAnalyticData()
  },[user])

  const OnProjectClick = async (project)=>
    {
      const result = await db.insert(ProjectClicks)
      .values({
        month:moment().format('MMM'),
        projectRef:project.id,

      });
      window.open(project.url,'_blank')
    }

    const ProjectAnalyticData = async ()=>{
      const result = await db.select({
        totalClick:sql`count(${ProjectClicks.id})`.mapWith(Number),
        month:ProjectClicks.month,
        projectId:ProjectClicks.projectRef
      }).from(ProjectClicks)
      .rightJoin(project,eq(ProjectClicks.projectRef,project.id))
      .innerJoin(userInfo,eq(project.userRef,userInfo.id))
      .where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress))
      .groupBy(ProjectClicks.projectRef,ProjectClicks.month);
      setProjectClickData(result)
    }
    const GetProjectWiseAnalyticData = (projectId)=>
      {
        let resp = projectClickData?.filter((project)=>project.projectId==projectId)
        let result = [];
        result.push({
          month:'April',
          totalClick:0,
          projectId:0
        },
        {
          month:'May',
          totalClick:0,
          projectId:0
        })
  
        const finalResult = [...result,...resp]
        return finalResult;
  
      }
      console.log('ProjectList props:', projectList);

  
    
  return (
    <div className=' grid grid-cols-1 lg:grid-cols-2 gap-7 my-8'>
      {projectList?.map((project,index)=>(

          <div   onClick={()=>OnProjectClick(project)}  key={project.id} 
          className='border shadow-sm rounded-lg p-5 hover:scale-105 transition-all cursor-pointer hover:shadow-md'>

            <div className='flex gap-2 items-center w-full'>
            <TwicPicture src={project?.logo} className='w-[55px] h-[50px] rounded-full'/>
            <h2 className='font-bold text-lg justify-between w-full flex items-center'>{project?.name}
            <div className=" hidden md:block badge badge-accent text-xs font-mono">{project.category}</div>
            </h2>
            </div>
            <h2 className='text-base-content/80 text-xs lg:text-sm my-2'>{project.desc}</h2>
            {  project?.showGraph && <AnalyticChart data={GetProjectWiseAnalyticData(project.id)}/> }

            </div>
        ))}

    </div>
  )
}

export default ProjectList;