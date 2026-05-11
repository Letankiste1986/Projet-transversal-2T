import style from './home.module.css';

function Home() {
    return (
        <div className={style.home}>
            <h1>Welcome to our website!</h1>
            <p>This is the home page of our project.</p>
        </div>
    );
}

export default Home;