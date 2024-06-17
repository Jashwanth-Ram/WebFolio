import { useUser } from '@clerk/nextjs';
import { Link } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { UserDetailContext } from '../../_context/UserDetailContext';
import { toast } from 'react-toastify';
import { db } from '../../../utils';
import { project } from '../../../utils/schema';
import { PreviewUpdateContext } from '../../_context/PreviewUpdateContext';

function AddProject() {

    const [openUrlInput, setOpenUrlInput] = useState(false);
    const {user} = useUser();
    const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const [loading,setLoading] = useState(false);
    const{updatePreview,setUpdatePreview}  = useContext(PreviewUpdateContext);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
 
        const result = await db.insert(project)
        .values(
            {
                url:e.target[0].value,
                emailRef:user?.primaryEmailAddress.emailAddress,
                userRef:userDetail?.id
            }
        )
        setOpenUrlInput(false)
        if(result)
        {
            setLoading(false);
            toast.success(' New Project / Profile Created! Refresh the page ',{
                position:'top-right'
            })
            setUpdatePreview(updatePreview+1)

        }
        else
        {
            setLoading(false);
        }
        

    }
    return (
        <div>


            {!openUrlInput ?
                <button onClick={()=>setOpenUrlInput(true)} className="btn btn-outline btn-secondary w-full">+ Add New Project / Social Profile</button>

                :
                <form onSubmit={handleSubmit} className='p-3 rounded-lg bg-gray-800 my-3'>
                    <label className="input input-bordered flex items-center gap-2">
                        <Link />
                        <input type="url" defaultValue={'https://'} className="grow" placeholder="Project / Profile URL" />
                    </label>
                    <button disabled={loading} type="submit" className="btn btn-outline btn-secondary w-full mt-3">+ Add New Project / Social Profile</button>
                </form>}



        </div>
    )
}

export default AddProject