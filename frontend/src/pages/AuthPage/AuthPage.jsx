import './AuthPage.css';

function AuthPage(){
    return(
        <div className="auth-page">
            <div className='auth-container'>
                <div className='auth-selection-container'>
                    <button className='auth-selection-button auth-selection-button-selected'>Sign In</button>
                    <button className='auth-selection-button'>Sign Up</button>
                </div>
                <div className='auth-text-container'>
                    <h1>Welcome Back!</h1>
                </div>
                <div className='auth-input-container'>
                    <label htmlFor="" className='auth-input-label'>Username</label>
                    <input type="text" className='auth-input' placeholder='super_cool_username123'/>
                    <label htmlFor="" className='auth-input-label'>Password</label>
                    <input type="password" className='auth-input' placeholder='•••••••••'/>
                </div>
                <button className='auth-submit-button'>Sign In</button>
            </div>
        </div>
    );
}

export default AuthPage;