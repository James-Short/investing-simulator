import { useState } from 'react';

import axios from 'axios';

import './AuthPage.css';

function AuthPage({ setSessionStatus }){
    const [selectedSignIn, setSelectedSignIn] = useState(true);
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    async function submitInfo(){
        if(usernameInput.length == 0 || passwordInput.length == 0){
            alert('Username and password fields must be filled in!');
            return
        }
        if(selectedSignIn){
            const res = await axios.post('http://localhost:8080/users/signIn',
                {username: usernameInput, password: passwordInput}, {withCredentials: true, validateStatus: () => true});
            if(res.status === 202){
                setSessionStatus('active');
            }
            else if(res.status === 401){
                alert('Username or password is incorrect!');
            }
        }
        else{
            const res = await axios.post('http://localhost:8080/users/createUser', 
                {username: usernameInput, password: passwordInput}, {withCredentials: true, validateStatus: () => true});
            if(res.status === 201){
                setSessionStatus('active');
            }
            if(res.status === 401){
                alert('Username or password is incorrect!');
            }
        }
    }

    return(
        <div className="auth-page">
            <div className='auth-container'>
                <div className='auth-selection-container'>
                    <button className={`auth-selection-button ${selectedSignIn ? 'auth-selection-button-selected' : ''}`} onClick={() => setSelectedSignIn(true)}>Sign In</button>
                    <button className={`auth-selection-button ${!selectedSignIn ? 'auth-selection-button-selected' : ''}`} onClick={() => setSelectedSignIn(false)}>Sign Up</button>
                </div>
                <div className='auth-text-container'>
                    <h1>{selectedSignIn ? 'Welcome Back!' : 'Start trading'}</h1>
                </div>
                <div className='auth-input-container'>
                    <label className='auth-input-label'>Username</label>
                    <input type="text" className='auth-input' placeholder='super_cool_username123' onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput}/>
                    <label className='auth-input-label'>Password</label>
                    <input type="password" className='auth-input' placeholder='•••••••••' onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}/>
                </div>
                <button className='auth-submit-button' onClick={() => submitInfo()}>{selectedSignIn ? 'Sign In' : 'Sign Up'}</button>
            </div>
        </div>
    );
}

export default AuthPage;