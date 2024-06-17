"use client"
import React, { useContext, useEffect } from 'react'
import { db } from '../../utils'
import { useUser } from '@clerk/nextjs'
import { userInfo } from '../../utils/schema';
import { eq } from 'drizzle-orm';
import { UserDetailContext } from '../_context/UserDetailContext';
import { usePathname } from 'next/navigation';

function Provider({children}) {

  const USERNAME = usePathname().replace('/','');
  const {userDetail,setUserDetail} = useContext(UserDetailContext);

  useEffect(()=>
    {
        GetUserDetails();

    },[])

    const GetUserDetails =async()=>
      {
        const result = await db.query.userInfo.findMany({

          with:{
            project:true
          },
          where:eq(userInfo.username,USERNAME)

        })
        setUserDetail(result[0]);

      }
  return (
    <div data-theme={userDetail?.theme}>
        {children}
    </div>
  )
}

export default Provider