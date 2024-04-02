import { useRef } from 'react';
import classes from './profile-form.module.css';

function ProfileForm() {

  const newPassRef = useRef()
  const oldPassRef = useRef()


  const changeHandler = async (e) => {
    e.preventDefault()
    const newPassword = newPassRef.current.value
    const oldPassword = oldPassRef.current.value

    try{
      const response = await fetch('api/auth/change-pass',{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          newPassword:newPassword,
          oldPassword:oldPassword
        })
      })
      const result = await response.json()
      if(response.ok)
      {
        alert(result.message)
        newPassRef.current.value = ''
        oldPassRef.current.value = ''
      }
      else{
        alert(result.message)
      }
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <form className={classes.form} onSubmit={(e)=>{e.preventDefault()}}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' autoComplete='on' ref={newPassRef}/>
      </div>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input type='password' id='old-password' autoComplete='on' ref={oldPassRef}/>
      </div>
      <div className={classes.action}>
        <button onClick={changeHandler}>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
