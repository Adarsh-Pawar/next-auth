import { useRef, useState } from "react";
import {signIn} from "next-auth/react"
import classes from "./auth-form.module.css";
import { useRouter } from "next/navigation";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef()
  const passwordRef = useRef()
  const router = useRouter()
  

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
    emailRef.current.value = ""
    passwordRef.current.value = ""
  }

  async function createUser(email,password){
    const response  = await fetch("api/auth/signup", {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });

    const data = await response.json()
    
    if(!response.ok){
      alert(data.message || "Something went wrong!")
      return
    }

    return data
  }

   const submitHandler = async (event) => {
    event.preventDefault()
    const email = emailRef.current.value
    const password = passwordRef.current.value
    if (isLogin) {
      const result = await signIn("credentials", {
        email:email,
        password:password,
        redirect:false,
      })
      if(result.error){
        alert(result.error)
        return
      }
      alert("Logged in successfully!")
      router.replace("/")
    } else {
      try{
        const result = await createUser(email,password)
        alert(result.message)
      }
      catch(error){
        console.log(error)
      }
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={(e) => {e.preventDefault()}}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailRef} required autoComplete="on"/>
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" ref={passwordRef} required autoComplete="on"/>
        </div>
        <div className={classes.actions}>
          <button onClick={submitHandler}>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
