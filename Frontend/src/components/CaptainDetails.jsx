// CaptainDetails Component
// This component fetches captain data from context and displays the captain's name,
// profile image, earnings, and key performance stats such as hours online.
// It's styled using Tailwind CSS and relies on CaptainDataContext for data access.

import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'

const CaptainDetails = () => {

    // Accessing the captain data from the shared CaptainDataContext using React's useContext hook
    const { captain } = useContext(CaptainDataContext)

    return (
        <div>
              {/* Top section displaying the captain's profile image, name, and earnings */}
            <div className='flex items-center justify-between'>     
                {/* Captain's profile image and full name */}
                <div className='flex items-center justify-start gap-3 ml-6'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                </div>
                  {/* Captain's earnings */}
                <div>
                    <h4 className='text-xl font-semibold mr-10'>₹295.20</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
             {/* Stats section with background, padding and spacing */}
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                  {/* Hours online - first stat */}
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                 {/* Speed stat - second stat */}
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                   {/* Rides or tasks completed - third stat */}
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>10.2</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>

            </div>
        </div>
    )
}

export default CaptainDetails