import React from 'react'
import ThemeOptions from './_components/ThemeOptions'
import MobilePreview from '../_components/MobilePreview'

function Style() {


  
  return (
    <div className='h-screen'>
      <div className='p-5'>
        <div className='grid grid-cols-1 lg:grid-cols-3'>

          <div className='col-span-2'>
            <ThemeOptions />
          </div>

          <div>
            <MobilePreview />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Style