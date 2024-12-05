'use client';

import Form from 'next/form'
import styles from './join.module.css'
import { FormEvent, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Page(){
    
    let user_v: string|null = null
    let email_v: string|null = null
    let pwd_v: string|null = null
    let v_code: string | null = null
    let user: string|null = null;
    let path: string|null = 'http://127.0.0.1:5000/join'
    let mailPath: string|null = 'http://127.0.0.1:5000/mail'
    const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let [isError, setError] = useState<string | null>(null);
    let route = useRouter()
    
    try {
        user = localStorage.getItem('session')
    } catch (err) {
        console.error(err)
    }

    if (user) {
      route.push("/");
    }

    const err_handle = (err?: any) => {
        console.log(err)
    }

    const mail_fn = (res: {data: {state: string}})=> {
        
        if(res.data.state == 'sent')
        {
            localStorage.setItem('code', v_code!)
            route.push('../verify')
        }
    }

    const join_fn = (res: { data: { state: string, email: string } }) => {
      // console.log('join_fn', res)
      if (res.data.state == "saved") {
        let code_v: string = "";
        for (let i: number = 0; i < 4; i++) {
          code_v += Math.round(Math.random() * 9).toString();
        }
        v_code = code_v;
        // console.log(v_code)
        axios({
          url: mailPath,
          method: "POST",
          data: {
            code: v_code,
            email: res.data.email,
          },
          responseType: "json",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
          .then(mail_fn)
          .catch(err_handle);
      } else if (res.data.state == "exists") {
        setError("User exists");
        // redirect('/login')
      }
    };

    const auth = async (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        user_v = (e.currentTarget[0] as HTMLFormElement).value
        email_v = (e.currentTarget[1] as HTMLFormElement).value
        pwd_v = (e.currentTarget[2] as HTMLFormElement).value

        // console.log(user_v!.length)
        
        if(user_v!.length <= 3  || pwd_v!.length <= 3)
        {
            setError('Input too short')
        }
        else if(!emailPattern.test(email_v!))
        {
            setError('Wrong email format')
        }
        else
        {
            setError(null)
            axios({
                url: path,
                method: 'POST',
                data:{
                    user: user_v,
                    pwd: pwd_v,
                    email: email_v
                },
                responseType:'json',
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            }).then(join_fn).catch(err_handle)
        }


    }

    return(
        <div className={`d-flex my-5 justify-content-center align-items-center`} >

           <div className='my-2 mx-2 w-25 card shadow-lg bg-transparent'>
           <h4 className='text text-black h-100 text-center my-2 card-title d-flex justify-content-center align-items-center'>
            <span className='w-25 text-white'>Sign UP</span>
            </h4>
           <hr/>
           <Form action='127.0.0.1:5000/login' className='col my-2 card-body' onSubmit={auth} formMethod='POST'>
                <div className='mb-2 mx-2 col'>
                    <label htmlFor='user' className='form-label text-white'>
                        Username
                    </label> 
                    <input name='user' id='user' type='text' required className='form-control form-control-sm bg-white bg-opacity-50 bg-gradient'></input>
                </div>
                <div className='mb-2 mx-2 col'>
                    <label htmlFor='email' className='form-label text-white'>
                        Email
                    </label> 
                    <input name='email' id='email' type='email' required className='form-control form-control-sm bg-white bg-opacity-50 bg-gradient'></input>
                </div>
                <div className='mb-2 mx-2 col'>
                    <label htmlFor='pwd' className='form-label text-white'>
                        Password
                    </label>
                    <input name='pwd' id='pwd' type='password' required className='form-control form-control-sm bg-white bg-opacity-50 bg-gradient'></input>
                </div>
                <div className='col mb-1'>
                 <button type='submit' className='btn btn-danger'>Sign Up</button>
                </div>
            </Form>
            {isError && <div className='text-danger'>{isError}</div>}
           </div>
        </div>
    )
}