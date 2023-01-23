import './Login.css'

const Login = () => {
  const google = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  const ecole42Auth = () => {
    window.open("http://localhost:5000/auth/42", "_self");
  };
  
  const github = () => {
    window.open("http://localhost:5000/auth/github", "_self");
  };
  
  return (
    <div className="login">
      <h1 className="loginTitle">Choose Login Method</h1>
      <div className="wrapper">
        <div className="left">
          <div className="loginButton google" onClick={google}>
            <img src={require('../../assets/google.png')} alt="" className="icon" />
            Google
          </div>
  
          <div className="loginButton github" onClick={github}>
            <img src={require('../../assets/github.png')} alt="" className="icon" />
            Github
          </div>
          
        </div>
        <div className="center">
          <div className="line" />
          <div className="or">OR</div>
        </div>
        <div className="right">
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
