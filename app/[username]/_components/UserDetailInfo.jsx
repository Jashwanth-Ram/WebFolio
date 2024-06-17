"use client"
import { TwicImg } from '@twicpics/components/react'
import { MapPin, Share } from 'lucide-react'
import React from 'react'

function UserDetailInfo({userDetail}) {

  const handle  =()=>
    {
      window.open(process.env.NEXT_PUBLIC_BASE_URL+userDetail.username)
    }

  
  return userDetail?.name &&  (
    <div className='flex flex-col md:justify-center  md:h-screen'>
        <div className='w-full flex items-center justify-between'>
            <div className='flex md:flex-col items-center md:items-start gap-4'>
                <TwicImg src={userDetail?.profileImage} 
                className='w-[90px] h-[90px] md:w-[130px] md:h-[130px] rounded-full'
                />
                <div className='flex flex-col gap-4 mt-3'>
                    <h2 className='font-bold text-lg md:text-2xl'>{userDetail?.name}</h2>
                    <h2 className='flex gap-2 items-center text-gray-500'><MapPin/>{userDetail?.location}</h2>
                    <div>
                  <button onClick={()=>handle()} className='md:hidden btn btn-primary btn-sm'> <Share className='h-3 w-3'/>Share</button>
                </div>
                </div>
          
            </div>
        </div>
        <h2 className='my-7 '>{userDetail.bio}</h2>
        <div className='flex gap-2'>
        <input type="text" placeholder="Add your Email" className="input input-bordered w-full max-w-xs" />
        <button className="btn btn-primary">Subscribe</button>

        </div>

    </div>
  )
}

export default UserDetailInfo