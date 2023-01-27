import './Login.css'

const Login = () => {
  const google = () => {
    window.open("http://localhost:3080/auth/google", "_self");
  };

  const ecole42Auth = () => {
    window.open("http://localhost:3080/auth/42", "_self");
  };
  
  const github = () => {
    window.open("http://localhost:3080/auth/github", "_self");
  };
  
  return (
    <div className="login">
      <div className="wrapper">
        <div className="left">Choose your Login Method</div>
        <div className="center">
          <div className="line" />
        </div>
        <div className="right">
          <div className="loginButton google" onClick={google}>
            <img src={require('../../assets/google.png')} alt="" className="icon" />
            Google
          </div>
  
          <div className="loginButton github" onClick={github}>
            <img src={require('../../assets/github.png')} alt="" className="icon" />
            Github
          </div>
          
          <div className="loginButton ecole" onClick={ecole42Auth}>
            <img src={require('../../assets/ecole42.png')} alt="" className="icon" />
            Ecole 42
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
