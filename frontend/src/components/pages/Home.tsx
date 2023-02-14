const Home = () => {
  return (
    <div className='baseCard'>
        <h1>Why?</h1>
        <h2>Thanks to this website, you will play Ping-Pong with others</h2>
        <img
          className="image"
          src={require('../../assets/pongScreen.png')}
          alt="HTML"
          width="405"
          height="255"
        />

    </div>
  );
};

export default Home;
