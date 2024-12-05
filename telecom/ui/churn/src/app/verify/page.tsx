'use client';

import Form from 'next/form'
import styles from './login.module.css'
import { FormEvent, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Page(){

    let path: string|null = 'http://127.0.0.1:5000/verify'
    let code_v: string|null = null
    let v_code: string|null = null
    let route = useRouter()

    let [isError, setError] = useState<string | null>(null)
    
    if(!v_code) route.push("../join"); 

    // const pop_last = (res: object)=>{
    //     if(res.status == 200){
    //         redirect('/join')
    //     }
    // }
    try{
        v_code = localStorage.getItem('code')
        if(!v_code)
        {
            axios({
                url: path,
                method:'get',
                responseType:'json',
                headers:{
                    'Access-Control-Allow-Origin':'*', 
                }
            }).then(res =>{
                if(res.status == 200){
                    route.push('../join')
                }
            })
        }
    }catch(error){
        console.log(error)
    }

    const auth = async (e: FormEvent<HTMLFormElement>)=>{

        e.preventDefault()

        code_v = (e.currentTarget[0] as HTMLFormElement).value

        // console.log(code_v)

        if(code_v!.length <= 3)
        {
            setError('Input too short')
        }
        else if(v_code!.localeCompare(code_v!) != 0)
        {
            setError('Incorrect code')
        }
        else
        {
            setError(null)
            axios({
                url:path,
                method:'post',
                responseType:'json',
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type':'application/x-www-form-urlencoded' 
                }
            }).then(res =>{
                if(res.status == 200){
                    localStorage.removeItem('code')
                    localStorage.setItem('session', res.data.user)
                    route.push('/')
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
        <div className={`d-flex my-5 h-100 justify-content-center align-items-center`} >

           <div className='my-3 mx-3 w-25 card shadow-lg bg-transparent'>
           <h4 className='text text-black h-100 text-center my-3 mb-1 card-title d-flex justify-content-center align-items-center'>
            <span className='w-25 text-white mx-auto my-auto fw-bolder'>Verify</span>
            </h4>
           <hr/>
           <Form action='http://127.0.0.1:5000/login' className='col my-2 card-body' onSubmit={auth} formMethod='POST'>
                <div className='mb-2 mx-2 col'>
                    <label htmlFor='vcode' className='form-label text-white'>
                        Check your mail for code
                    </label> 
                    <input name='vcode' type='text' id='vcode' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
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