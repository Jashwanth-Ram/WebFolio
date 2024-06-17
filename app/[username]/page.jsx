"use client"
import React, { useContext } from 'react'
import  UserDetailInfo from './_components/UserDetailInfo'
import  ProjectList from './_components/ProjectList'
import { UserDetailContext } from '../_context/UserDetailContext'

function UserPage() {

  const{userDetail,setUserDetail }  = useContext(UserDetailContext);
  if (!userDetail) {
    return <div>Loading...</div>;
  }
  console.log('UserPage userDetail:', userDetail);

  return (
    <div className='p-3 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-5 '>

    <div>
      <UserDetailInfo userDetail={userDetail}/>
    </div>

    <div className='md:col-span-2'>
      <ProjectList projectList = {userDetail.project}/>
    </div>

    </div>
  )
}

export default UserPage