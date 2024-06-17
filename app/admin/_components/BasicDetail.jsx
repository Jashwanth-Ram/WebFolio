import { Camera, Link, MapPin } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../../utils';
import { userInfo } from '../../../utils/schema';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { UserDetailContext } from '../../_context/UserDetailContext';

import { getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../../utils/firebaseConfig';
import Image from 'next/image';
import { TwicImg, TwicPicture } from '@twicpics/components/react';
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext';


const BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/jash-startups.appspot.com/o/'


function BasicDetail() {

    let timeoutid;
    const {user} = useUser();

    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const{updatePreview,setUpdatePreview}= useContext(PreviewUpdateContext);


    const[selectedOption,setselectedOption] = useState();
    const[profileImage,setProfileImage] = useState(); 

    useEffect(()=>
    {
        userDetail&&setProfileImage(userDetail?.profileImage)
    },[userDetail])



    const onInputChange = (event,fieldName)=>
    {
        clearTimeout(timeoutid);
        timeoutid = setTimeout(async ()=>{

            // update db with given username 
            const res = await db.update(userInfo)
            .set({ 
                [fieldName] : event.target.value
            }).where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress))

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

    const handleFileUpload =(event)=>
    {
        const file = event.target.files[0];

        const fileName = Date.now().toString()+'.'+file.type.split('/')[1];
        console.log(fileName)


        const storageRef = ref(storage, fileName);
        

       uploadBytes(storageRef, file).then( async (snapshot) => {
        console.log('Uploaded a blob or file!');

        const result = await db.update(userInfo).set(
            {
                profileImage:fileName+"?alt=media"
            }).where(eq(userInfo.email,user?.primaryEmailAddress.emailAddress))
            if(result)
            {
                setProfileImage(fileName+"?alt=media")
                toast.success('Saved!',{
                    position:'top-right'
                })
                setUpdatePreview(updatePreview+1);

            }
            },(e)=>console.log(e));
    }

  return (
    <div className='p-7 rounded-lg bg-gray-800 my-7'>

        <div className='flex gap-6 items-center'>
            {profileImage?
            <label htmlFor='file-input' className='cursor-pointer'>

            {/* <Image src={BASE_URL+profileImage}  width={40}
               height={50} alt='profileImage'/> */}

            <TwicPicture src={profileImage} className='w-[50px] h-[50px] rounded-full'></TwicPicture>

            { /* <TwicImg src={profileImage}/> */}

            </label>
        :<div>

        <label htmlFor='file-input'>
        <Camera className='p-3 h-12 w-12 cursor-pointer bg-gray-600 rounded-full'/>
        </label>
    
        </div> }
        <input type='file' id='file-input' style={{display:'none'}}
        accept='image/png, image/gif, image/jpeg'
        onChange={handleFileUpload}
        />

        <input type="text" placeholder="Username" defaultValue={userDetail?.name} 
        onChange={(event)=>onInputChange(event,'name')} 
        className="input input-bordered input-accent w-full " 
        />
        </div>

        <textarea className="textarea textarea-primary mt-3 w-full" 
        placeholder="Start writing about yourself"
        defaultValue={userDetail?.bio}
        onChange={(event)=>onInputChange(event,'bio')} 

        ></textarea> 

        <div>
            <div className='flex gap-3 mt-6'>

            <MapPin className={`h-12 w-12  text-lime-500 p-3  cursor-pointer rounded-md hover:bg-gray-600
            ${selectedOption=='location' && 'bg-gray-600'}
            `}
             onClick={()=>setselectedOption('location')} />


            <Link className={`h-12 w-12  text-blue-500 p-3 cursor-pointer rounded-md hover:bg-gray-600
            ${selectedOption=='url' && 'bg-gray-600'}
            `}

             onClick={()=>setselectedOption('url')} />

            </div>
            {
            selectedOption=='location'?
            <div className='mt-2'>

            <label className="input input-bordered flex items-center gap-2">
                <MapPin/>
             <input type="text" 
             onChange={(event)=>onInputChange(event,'location')}
              className="grow" placeholder="Location"
              key={1}
              defaultValue={userDetail?.location}
              />
            </label>

            </div>:selectedOption=='url'?
             <div className='mt-2'>
             <label className="input input-bordered flex items-center gap-2">
                 <Link/>
              <input type="text"        
               onChange={(event)=>onInputChange(event,'url')} 
               className="grow" placeholder="Url" 
               key={2}
              defaultValue={userDetail?.url} />
             </label>
             </div>:null
             }

        </div>

    </div>
  )
}

export default BasicDetail;