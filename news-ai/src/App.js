import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Layout from "./navLayout";
import SubscribeModal from "./components/SubscribeModal";
import Content from "./components/content";
import LoginModal from "./components/LoginModal";
import Footer from "./components/Footer";
import UserProfile from "./components/user-profiles";




import { useEffect, useState } from "react";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [topNews, setTopNews] = useState([]);
  const [nationalNews, setNationalNews] = useState([]);
  const [businessNews, setBusinessNews] = useState([]);
  const [worldNews, setWorldNews] = useState([]);
  const [techNews, setTechNews] = useState([]);
  const [sportsNews, setSportsNews] = useState([]);
  const [scienceNews, setScienceNews] = useState([]);
  const [healthNews, setHealthNews] = useState([]);
  const [entertainmentNews, setEntertainmentNews] = useState([]);
  const [openedSubscribe, setOpenedSubscribe] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openUserProfile, setOpenUserProfile] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setUserEmail(window.sessionStorage.getItem("email"));


  }, []);

  function loginOrLogout() {
    if (userEmail) {
      handleLogout();
    } else {
      setOpenLogin(!openLogin);
      setOpenedSubscribe(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      setUserEmail("");
      window.sessionStorage.removeItem("email");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <div className="App">

      {/* { user profile} */}
      {userEmail ? <div className="user-profile" onClick={() => { setOpenUserProfile(!openUserProfile) }}></div> : null}

      {openUserProfile ? <UserProfile userEmail={userEmail} setOpenUserProfile={setOpenUserProfile} /> : null}


      {/* Login Modal */}
      {openLogin && !userEmail ? (
        <LoginModal
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          setOpenLogin={setOpenLogin}
        />
      ) : null}


      {/* Subscribe Modal */}
      {openedSubscribe ? (
        <SubscribeModal
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          setOpenLogin={setOpenLogin}
          setOpenedSubscribe={setOpenedSubscribe}
        />
      ) : null}

      <header className="d-flex  container-fluid justify-content-around align-items-center flex-wrap">
        {/* First Row */}

        <div className="text-light">

          <h1 id="home">RapidRecap</h1>
        </div>

{/* search bar */}
        {/* <div className="grid-item">
          <input type="text" placeholder="Search..." className="search-bar" />
        </div> */}



        <div className="m-2">

          <button onClick={loginOrLogout} className="btns">
            {userEmail ? "Logout" : "Login"}
          </button>


          {/* Subscribe Button */}
          <button className="btns"
            onClick={() => {
              setOpenedSubscribe(!openedSubscribe);
              setOpenLogin(false);
            }}
          >Subscribe
          </button>

        </div>

      </header>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <Content
                  setNewsList={setTopNews}
                  newsList={topNews}
                  topic={["india", "world", "sports", "entertainment"]}
                />
              }
            />
            <Route
              path="NATIONAL"
              element={
                <Content
                  setNewsList={setNationalNews}
                  newsList={nationalNews}
                  topic={["india"]}
                />
              }
            />
            <Route
              path="BUSINESS"
              element={
                <Content
                  setNewsList={setBusinessNews}
                  newsList={businessNews}
                  topic={["business"]}
                />
              }
            />
            <Route
              path="WORLD"
              element={
                <Content
                  setNewsList={setWorldNews}
                  newsList={worldNews}
                  topic={["world"]}
                />
              }
            />
            <Route
              path="TECHNOLOGY"
              element={
                <Content
                  setNewsList={setTechNews}
                  newsList={techNews}
                  topic={["technology"]}
                />
              }
            />
            <Route
              path="SPORTS"
              element={
                <Content
                  setNewsList={setSportsNews}
                  newsList={sportsNews}
                  topic={["sports"]}
                />
              }
            />
            <Route
              path="SCIENCE"
              element={
                <Content
                  setNewsList={setScienceNews}
                  newsList={scienceNews}
                  topic={["science"]}
                />
              }
            />
            <Route
              path="HEALTH"
              element={
                <Content
                  setNewsList={setHealthNews}
                  newsList={healthNews}
                  topic={["health"]}
                />
              }
            />
            <Route
              path="ENTERTAINMENT"
              element={
                <Content
                  setNewsList={setEntertainmentNews}
                  newsList={entertainmentNews}
                  topic={["entertainment"]}
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>


      <Footer />

      
    </div>
  );
}

export default App;
