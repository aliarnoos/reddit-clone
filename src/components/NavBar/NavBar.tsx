import "./nav.css";
import { app } from "../../Firebase";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

export const auth = getAuth(app);

type user = {
  userStatus: boolean;
  accountInfo: string;
  signInWithGoogle: () => void;
  signOutGoogle: () => void;
};

function NavBar({
  userStatus,
  accountInfo,
  signInWithGoogle,
  signOutGoogle,
}: user) {
  return (
    <nav>
      <Link to={"/"}>
        <img src="/imgs/reddit-logo.png" alt="logo" />
      </Link>
      <div className="account">
        <div className="profile">
          {userStatus ? <img src="/imgs/profile.png" alt="profile" /> : ""}
          <div className="user-sign">
            <h4>{accountInfo}</h4>
            {userStatus ? <h5 onClick={signOutGoogle}>Sign Out</h5> : ""}
          </div>
        </div>
        <div>
          {!userStatus ? (
            <button
              onClick={signInWithGoogle}
              className="login-with-google-btn"
            >
              {" "}
              Sign in
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
