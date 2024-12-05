'use client';

import Form from 'next/form'
import styles from './login.module.css'
import { FormEvent, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';



export default function Page(){

    let [isError, setError] = useState <string|null> (null)
    let user_v: string|null = null
    let pwd_v: string|null = null
    let path: string|null = 'http://127.0.0.1:5000/login'
    let route: AppRouterInstance = useRouter()
    let user: string|null = null

    const auth = async (e: FormEvent<HTMLFormElement>)=>{

        e.preventDefault()

        try {
            user = localStorage.getItem('session')
        } catch (err) {
            console.error(err)
        }

        if(user) route.push("/");

        user_v = (e.currentTarget[0] as HTMLFormElement).value
        pwd_v = (e.currentTarget[1] as HTMLFormElement).value;

        console.log(pwd_v)

        if(user_v!.length <= 3 || pwd_v!.length <= 3){
            setError('Input too short')
        }else{
            setError(null)
            axios({
                url:path,
                method:'post',
                data:{
                    user: user_v,
                    pwd: pwd_v
                },
                responseType:'json',
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type':'application/x-www-form-urlencoded' 
                }
            }).then(res =>{
                if(res.status == 200){
                    console.log(res.data)
                    if(res.data.state == true)
                    {
                        localStorage.setItem('session', res.data.user)
                        route.push('/')
                    }else
                    {
                        setError("User doesn't exist")
                    }
                }
            }).catch(err =>{
                setError(err)
                console.log(err)
            }).finally(()=>{
                setError(null)
            })
        }
        
    }

    return(
        <div className={`d-flex my-5 h-auto justify-content-center align-items-center`} >

           <div className='my-3 mx-3 w-25 card shadow-lg bg-transparent'>
           <h4 className='text text-black h-100 text-center my-3 mb-1 card-title d-flex justify-content-center align-items-center'>
            <span className='w-25 text-white mx-auto my-auto fw-bolder'>Login</span>
            </h4>
           <hr/>
           <Form action='http://127.0.0.1:5000/login' className='col my-2 card-body' onSubmit={auth} formMethod='POST'>
                <div className='mb-2 mx-2 col'>
                    <label htmlFor='user' className='form-label text-white'>
                        Username
                    </label> 
                    <input name='user' type='text' id='user' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                </div>
                <div className='mb-2 mx-2 col'>
                    <label htmlFor='pwd' className='form-label text-white'>
                        Password
                    </label>
                    <input name='pwd' type='password' id='pwd' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                </div>
                <div className='col mb-2'>
                 <button type='submit' className='btn btn-danger'>Login</button>
                </div>
            </Form>
            {isError && <div className='text-danger'>{isError}</div>}
           </div>
        </div>
    )
}