/**
 * File: UserLogin.jsx
 * Purpose: This component handles user authentication and login functionality for the ride-hailing application.
 * 
 * Features:
 * - Provides a login form with email and password fields
 * - Implements password visibility toggle
 * - Handles form submission and validation
 * - Manages user authentication state
 * - Integrates with the backend API for authentication
 * - Provides error handling and user feedback
 * - Uses context for user state management
 * 
 * Usage:
 * - Allows users to log in to their accounts
 * - Manages authentication tokens
 * - Redirects users to the home page after successful login
 * - Provides error messages for failed login attempts
 */

import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userData, setUserData] = useState({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };



  const submitHandler = async (e) => {
    console.log(import.meta.env.VITE_BASE_URL);
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    };

    // const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

    // if (response.status === 200) {
    //   const data = response.data
    //   setUser(data.user)
    //   localStorage.setItem('token', data.token)
    //   navigate('/home')
    // }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('userToken', data.token);
        //   navigate('/home');
        // }
        console.log('Login successful, navigating to home page');
        navigate('/home');
      } else {
        console.log('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Login Error:', error);
      if (error.response) {
        console.error('Data:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
        alert('Login failed. Please check your email and password.');
      } else if (error.request) {
        console.error('Request:', error.request);
        alert('No response from the server. Please try again.');
      } else {
        console.error('Error', error.message);
        alert('An error occurred. Please try again.');
      }
    }


    setEmail('')
    setPassword('')
  }

  return (

    <div>
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
      <div className="container flex">
      <div className='p-7 h-[625px] w-2/4 flex flex-col justify-between border-4 border-gray-600 rounded-xl mt-8 ml-32 shadow-2xl shadow-gray-800 transition-transform duration-300 transform hover:scale-105'>
        <div>
          <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

          <form onSubmit={submitHandler}>
            <h3 className='text-lg font-medium mb-2'>Enter Email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required type={isPasswordVisible ? 'text' : 'password'}
              placeholder='password'
            />
            <button onClick={togglePasswordVisibility} type="button">
              {isPasswordVisible ? (
                <>
                  <span>Hide Password</span>

                </>
              ) : (
                <>
                  <span>Show Password</span>
                </>
              )}
            </button>
            <button
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base  hover:bg-gray-500'
            >Login</button>

          </form>
          <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
        </div>
        <div>
          <Link
            to='/captain-login'
            className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 mt-[-40px] w-full text-lg placeholder:text-base'
          >Sign in as Captain</Link>
        </div>
      </div>

      <div className="right">
       
        <div className='mt-10 ml-5'><img src="https://vanshikacabs.com/wp-content/uploads/2022/05/outstation-taxi-services-in-agra.png" alt="" /> </div>
        
        <div className="ml-64 mt-[-50px]  animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-2xl text-black">Waiting for you ...</div>

      </div>
      </div>
    </div>
  )
}

export default UserLogin