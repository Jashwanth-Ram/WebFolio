// Provider.js
"use client";
import React, { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from './_context/UserDetailContext';
import { db } from '../utils';
import { userInfo } from '../utils/schema';

function Provider({ children }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    if (user) {
      GetUserDetails();
    }
  }, [user]);

  const GetUserDetails = async () => {
    const result = await db.select().from(userInfo)
      .where(eq(userInfo.email, user?.primaryEmailAddress.emailAddress));

    console.log('Fetched userDetail:', result);
    setUserDetail(result[0]);
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Provider;

