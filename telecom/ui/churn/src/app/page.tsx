'use client';

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  
  let user: string|null = null

  try{
    user = localStorage.getItem('session')
  }catch(error){
    console.log(error)
  }

  return (
    <div className={`d-flex flex-column`}>
      <div className={`${styles.indexBody} d-flex flex-row align-items-center justify-content-between`}>
        <div className="d-flex text-start lead flex-column">
          {
            user == null? 
            <>
              <span>Home of High Speed Network</span>
              <Link href={'/join'} className="btn btn-danger p-2 mx-1 my-1 w-25 rounded">Signup</Link>
            </>
            :
            <>
              <span>
                Hello, {user}
                <br />
                Let's take a quick survey,
              
                It won't be long
              </span>
              <Link href={'/predict'} className="btn btn-danger p-2 mx-1 my-1 w-25 rounded">Predict</Link>
            </>
          }
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <Image src="/net-abs.png" className="img-fluid" height={500} width={500} alt="Netwrok Abstract"/>
        </div>
      </div>
    </div>
  );
}
