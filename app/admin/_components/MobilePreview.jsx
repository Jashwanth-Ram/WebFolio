"use client"
import React, { useContext } from 'react'
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext';
import { userInfo } from '../../../utils/schema';


function MobilePreview() {

  const{updatePreview,setUpdatePreview}= useContext(PreviewUpdateContext);




  return (
    <div  className='p-5  md:fixed'>
        <div className='border-[13px] lg:w-[330px] xl:w-[350px] w-full border-black
        max-h-[650px]
        h-screen rounded-[40px] m-2 shadow-md shadow-primary'>
        
          <iframe title='Profile'
          src={process.env.NEXT_PUBLIC_BASE_URL+userInfo.username}
          key={updatePreview}
          width="100%"
          height="100%"
          className='rounded-[25px]'
          />

        </div> 


    </div>
  )
}

export default MobilePreview