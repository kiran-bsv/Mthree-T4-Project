/**
 * File: Start.jsx
 * Purpose: This is the landing page component for the ride-hailing application.
 * 
 * Features:
 * - Displays the main navigation bar with Uber branding
 * - Shows a welcome section with a large illustration
 * - Provides a "Get Started" button that links to the login page
 * - Implements responsive design for different screen sizes
 * - Includes a footer with copyright information
 * 
 * Usage:
 * - Serves as the entry point for new users
 * - Provides navigation to the login page
 * - Displays the application's branding and main features
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div class="w-full">
      <nav class="bg-black border-gray-200 dark:bg-black-900 mt-0 pt-0 w-full h-12">
        <div class="w-full flex flex-wrap items-center justify-between mx-auto pt-2 ">
          <a href="https://uber.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="data:image/png;base64,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" class="h-8" alt="Flowbite Logo" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">Uber</span>
          </a>
          <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div class="hidden w-full mr-6 md:block md:w-auto" id="navbar-default">
            <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border  rounded-lg bg-black md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-black dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a href="#" class="block py-2 px-3 text-white rounded-sm md:bg-transparent md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
              </li>
              <li>
                <a href="#" class="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a>
              </li>
              <li>
                <a href="#" class="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Services</a>
              </li>
              <li>
                <a href="#" class="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Pricing</a>
              </li>
              <li>
                <a href="#" class="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>


      <div className='flex'>
        <div className="containerLeft w-1/2 relative pt-2 pl-2  flex flex-col " >

          {/* <img className='absolute top-0 left-4 w-20 bg-black z-10 ' src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417" alt="" /> */}
          <img className='shadow-2xl shadow-gray-800  flex w-3/4 h-[600px] mt-10 ml-12 h-full' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_1152,w_1152/v1683919251/assets/42/a29147-e043-42f9-8544-ecfffe0532e9/original/travel-ilustra.png" alt="" />
        </div>

        <div className="conatinerRight flex shadow-2xl shadow-gray-800 w-2/6 rounded-xl ml-[150px] pt-48 mt-36 ml-12   h-[300px]  transition-transform duration-300 transform hover:scale-110" >
          <div className='bg-white h-10 '>
            <h5 className='text-[30px] font-semibold flex mt-[-100px] ml-[90px]'>Get Started with Uber
              
            </h5>
            <Link to='/login' className='flex items-center justify-center w-46 bg-black text-white py-3 rounded-xl ml-[100px] mr-5 mt-5 hover:bg-gray-500 '>Continue</Link>
            <div className='w-14 ml-4 animate-linearMove bg-transparent'><img src="https://www.svgrepo.com/show/19338/taxi.svg" alt="" />
              </div>
          </div>
        </div>
      </div>

      <div className="footer text-center mt-10 font-thin">
        copyright@TeamIndia
      </div>





      {/* <div className='mt-1 h-3/5 w-full bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-4 flex justify-between flex-col w-full'>
         <div className='bg-white pb-8 py-4 px-4'>
          <h5 className='text-[30px] font-semibold flex '>Get Started with Uber 
            <div className='w-14 ml-4 animate-linearMove'><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAACUCAMAAABVwGAvAAAAZlBMVEX///8AAAC4uLjp6ek8PDzm5uYzMzO9vb1xcXH5+fn19fXx8fH8/PwWFhZ7e3vi4uLOzs4tLS1sbGyoqKjb29tERESysrJkZGTHx8eLi4uUlJTU1NQPDw+goKBOTk6EhIQiIiJbW1tv9L26AAAEZklEQVR4nO2a57ayOhCGCVU6SBEsKPd/kx8BtinUKCZnrTPPr710A6+TyWQKmgYAAAAAAAAAAAAAAAAAAAAA/zv86no6PUsrUC1kjuSJRi6Oai1THiEiRJ5qOSzuGTGkhmpFDFfEcfkv2c/h1SFUq9ZE8NqpPGSpVvXmNqMOPVSrejPxPEyhWtWby5w8W7WqN+acPBxeTpXiDRzr2aNMF+R1XHJ12rzMvC8rGwgrVeqcZktbv8KK7PfYI66jUaKu3qkOoZsCdeVudegpX91tc08QWle2Ove0Xx1qfdnyEgF1qJUem8/boghn2epcEXUoky2vEpInfWfsjcg9V9nqtEhA3VO68TSBsPJUkFLtlhc+5NtOxHrhWUFC9dzWRQTKP3IzAXkKSvLZynEZ6SV5uK2JRrb/iThfRytZXixmvpfshHl/Kt8jOyvwV2rbGaRvjpvQ8kbSDw9dSJ78dvhNYH2ZpMq1jG2+r0/i/eGlpK972uYmdnNA+zKuzXRPRZnG5Jpg56Zv4uXn7ue21D2jiagLdoek4gh9M13vKdSDcB1glw5FZiP0cDhwKdgcMH3YYwzK83Cf12Z7VlYx04ZxsV+bXze3gh2ZaUaiSt+ZSdhbxObkI20c5BTf7t9teSY1YcPqXryUeXmD/b72v9muPKF5UA6k410+Sa4W5GkurgeLL/1vbWukjkEnyg4+B/XJHZbkaV6/P76Lf/5aB5dJVHp1M7PURXmaF32vb+3spdPQPOT1jszu3IEAT0ya70qVldASkj2bvxAeROtTshTHvZkvdN3Rbex/1Ac3YVu6Kx0X8sPFukaL3ItIuHCJoyJ9pcXzyp+/d5LmVQLd3g1OwrvZuyW5ryUv7kbUzOBAecj8rHTxCu4+1ND0SHnI/Cxac15oU3dJiLywaGbTnCIaaGcVFQVVPnzWrvZs5pZ0jvyWd3Zyw7DyjP3XjrsfDHiTAWya5V2GnVekpV0ualjDos1CZ3n+uO4RCQwVZ8LL+xtuEQoSy42/Iz78SJ4WE/e70tVZxNhzCIcGZ6XE8zFezrpwa1DXBH/S58+ZTVy9ScP7yzy9czXfsoxkKJvwoeFVF/tlRv3XLasvHGA3Ud/fyp9marf98DpjfugH5FWVkEStIgUdXu34T1Ltcr4wj4294a/marqIEkTvex1AQFmoW6WcCMK+tt0oLMfMagDnz37/1+kgeWS3desR0G6F14cP5BPjBexOafwxxTxIHlXKVVx2aBrbI4i6Mx7ji/rY/DxK3kA9FF4t8+xye3bI/yR8ThrF4fLcFo91fTZkdKbJN+QlfMLWBbw+bB8rT/OySOPldZ/EL3sNfPhz64+LpNROf9Hvd1l5V9wOWsflz5CX1kdS6ycjbHYOvC+xZMcAPx0OM67W7LMAE4w+Pcx2QptvWlPOQ2/d82/brB5x9P0v+JGXUn4+YPLGOGGKvD2sj6G9ljD+8svoXFdiixRU9TnKpL9wAgAAAAAAAAAAAAAAAAAAAACq+AcsFjhLCcpOnQAAAABJRU5ErkJggg==" alt="" />
            </div>
          </h5>
          <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5 hover:bg-gray-500 '>Continue</Link>
        </div>
      </div> */}
    </div>
  )
}

export default Start

