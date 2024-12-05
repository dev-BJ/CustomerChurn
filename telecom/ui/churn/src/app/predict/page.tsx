'use client';

import Form from 'next/form'
import { FormEvent, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './predict.module.css'
import Link from 'next/link';



export default function Page(){

    let [isError, setError]=useState<string|null>(null)
    let [isResult, setResult] = useState<{ churn: string } |null> (null)
    let user_v: string|null = null
    let pwd_v: string|null = null
    let path: string|null = 'http://127.0.0.1:5000/predict'
    let route = useRouter()
    let survey: any = {}
    let user: string | null = null;
    
    try {
        user = localStorage.getItem('session')
    } catch (err) {
        console.error(err)
    }

    const send_survey = async (e: FormEvent<HTMLFormElement>)=>{

        e.preventDefault()

        if(!user) route.push("/")

        for(let i: number=0; i < 16; i++){

            if((e.currentTarget[i] as HTMLFormElement).value == 'yes' || (e.currentTarget[i] as HTMLFormElement).value == 'Yes')
            {
                survey[(e.currentTarget[i] as HTMLFormElement).name] = [1]
            }
            else if ((e.currentTarget[i] as HTMLFormElement).value !== 'no' || (e.currentTarget[i] as HTMLFormElement).value == 'No')
            {
                survey[(e.currentTarget[i] as HTMLFormElement).name] = [0];
            }
            else
            {
                survey[(e.currentTarget[i] as HTMLFormElement).name] = [
                  Number((e.currentTarget[i] as HTMLFormElement).value),
                ];
            }
        }

        // user_v = e.currentTarget[0].value
        // pwd_v = e.currentTarget[1].value

        // console.log(survey)
        // console.log(pwd.length)

        if(Object.keys(survey).length == 16)
        {
            axios({
                url:path,
                method:'post',
                data: survey,
                responseType:'json',
                headers:{
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type':'application/json' 
                }
            }).then(res =>{
                if(res.status == 200){
                    console.log(res.data)
                    if(res.data != 'error')
                    {
                        setResult(res.data)
                    }
                    // route.push('/')
                }
            }).catch(err =>{
                // setError(err)
                console.log(err)
            }).finally(()=>{
                setError(null)
            })
        }else{
            setError('Input not complete')
        }
    }

    return(
        <div className={`d-flex my-3 justify-content-center align-items-center`} >
           <div className='d-flex card w-100 h-auto shadow-lg bg-transparent' style={{maxHeight: '100%'}}>
           <h4 className='text text-black text-center my-3 mb-1 card-title d-flex justify-content-center align-items-center'>
            {
                !isResult ? <span className='w-25 text-white mx-auto my-auto fw-bolder'>Fill the fields below</span> : <span className='w-25 text-white mx-auto my-auto fw-bolder'>Survey Result</span>
            }
            </h4>
           <hr/>
            {
                !isResult ?
            <>
            <Form action='http://127.0.0.1:5000/login' className='col my-2 card-body' onSubmit={send_survey} formMethod='POST'>
                {/* start of row */}
                <div className='row'>
                    {/* start of first column */}
                    <div className='mb-2 mx-2 col w-75'>
                        {/* col 1 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='acc_len' className='form-label text-white'>How long have you open your account?</label> 
                            <input name='acc_len' type='number' id='acc_len' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 2 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='int_plan' className='form-label text-white'>Do you use an international plan? (Yes / No)</label>
                            <input name='intl_plan' type='text' id='int_plan' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 3 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='vmail_msg' className='form-label text-white'>How many voicemail massages do you get?</label> 
                            <input name='vmail_msg' type='number' id='vmail_msg' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 4 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='day_min' className='form-label text-white'>How many minutes do you make calls during the day?</label>
                            <input name='day_min' type='munber' id='day_min' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 5 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='day_calls' className='form-label text-white'>How many calls do you make during the day?</label> 
                            <input name='day_calls' type='number' id='day_calls' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 6 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='day_charge' className='form-label text-white'>How much are you charged for day calls?</label>
                            <input name='day_charge' type='number' id='day_charge' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 7 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='eve_min' className='form-label text-white'>How many minutes do you make calls during the evening?</label> 
                            <input name='eve_min' type='number' id='eve_min' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 8 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='eve_calls' className='form-label text-white'>How many calls do you make during the evening?</label>
                            <input name='eve_calls' type='number' id='eve_calls' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                    </div>
                    {/* end of first column */}

                    {/* start of second column */}
                    <div className='mb-2 mx-2 col w-75'>
                        {/* col 1 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='eve_charge' className='form-label text-white'>How much are you charged for evening calls?</label> 
                            <input name='eve_charge' type='number' id='eve_charge' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 2 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='night_min' className='form-label text-white'>How many minutes do you make calls during the night?</label>
                            <input name='night_min' type='number' id='night_min' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 3 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='night_calls' className='form-label text-white'>How many calls do you make during the night?</label> 
                            <input name='night_calls' type='number' id='night_calls' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 4 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='night_charge' className='form-label text-white'>How much are you charged for night calls?</label>
                            <input name='night_charge' type='number' id='night_charge' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 5 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='intl_min' className='form-label text-white'>What is the duration of international calls you make?</label> 
                            <input name='intl_min' type='number' id='intl_min' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 6 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='intl_calls' className='form-label text-white'>How many international calls do you make?</label>
                            <input name='intl_calls' type='number' id='intl_calls' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 7 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='intl_charge' className='form-label text-white'>How much are you charged for international calls</label> 
                            <input name='intl_charge' type='number' id='intl_charge' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                        {/* col 8 */}
                        <div className='mb-2 mx-2 col'>
                            <label htmlFor='cus_calls' className='form-label text-white'>How often you do call our customer service agents?</label>
                            <input name='cus_calls' type='number' id='cus_calls' required className='form-control form-control-md bg-white bg-opacity-50 bg-gradient'></input>
                        </div>
                    </div>
                    {/* end of second column */}
                </div>
                {/* end of row */}
                <div className='col mb-2'>
                 <button type='submit' className='btn btn-danger'>Sumbit Survey</button>
                </div>
            </Form>
            </>
            :
            <>
                {
                    !isResult?.churn ? 
                    <div className='d-flex align-items-start flex-column'>
                        <h1 className='mx-2 text-white'>WoW!</h1>
                        <p className='mx-1 text-white'>The survey result shows that you enjoy our services and we would do our best to make sure you stay</p>
                        <Link href={'#'} className="p-2 mx-3 my-3 bg-white bg-gradient bg-opacity-50 rounded" onClick={()=>{setResult(null)}}>Take the survey again</Link>
                    </div> 
                    :
                    <div className='d-flex align-items-start flex-column'>
                        <h3 className='mx-2 text-white'>We appreciate you being with us so far...</h3>
                        <p className='mx-1 text-white'>But the survey shows that you might have not been enjoying our services and we would love to you see stay with</p>
                        <Link href={'#'} className="p-2 mx-3 my-3 bg-white bg-gradient bg-opacity-50 rounded" onClick={()=>{setResult(null)}}>Take the survey again</Link>
                    </div>
                }
            </>
            }

            {isError && <div className='text-danger'>{isError}</div>}
           </div>
        </div>
    )
}