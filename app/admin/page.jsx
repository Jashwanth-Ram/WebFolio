"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { db } from '../../utils'
import { userInfo } from '../../utils/schema'
import FormContent from './_components/FormContent';
import MobilePreview from './_components/MobilePreview';



function Admin() {

    const {user} = useUser();
    const router = useRouter();

    useEffect(
        ()=>
        {
            user&&CheckUser();
        },[user]
    )
    /**
     Used to check if user is in database or not
     if yes then user data will be fetched
     if no then user will be redirected to create page 
     */

    const CheckUser = async ()=>
    {

        const result = await db.select().from(userInfo)
        .where(eq(userInfo.email,user?.primaryEmailAddress?.emailAddress))
        
        if(result?.length==0)
        {
            router.replace('/create')

        }

    }


// dividing into two cols  - controller and preview
  return (
    <div className='p-5'>

        <div className='grid grid-cols-1 lg:grid-cols-3'>

            <div className='col-span-2'>
                <FormContent/>
            
            </div>

            <div>
                <MobilePreview/>

            </div>

        </div>


    </div>
  )
}

export default Admin;