import "./Profile.css";
import "./Login.css";

const LoginSuccess = () => {
  
  const ok = () => {
    window.open("http://localhost:3000/profile", "_self");
  };
  
  return (
    <>
      <div className="login">
        <div className="wrapper">
          <div className="left">You've been successfully logged in</div>

          <div className="right">
            <div className="loginButton logged" onClick={ok}>
              <img
                src={require("../../assets/pong.png")}
                alt=""
                className="icon"
              />
              Continue
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default LoginSuccess;