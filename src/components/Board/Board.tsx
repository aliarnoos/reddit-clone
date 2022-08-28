import { ReactNode, useContext } from "react";
import "./board.css";
import AddPost from "../AddPost/AddPost";
import { userContext } from "../../App";

type boardProps = {
  posts: ReactNode;
  isLoading: boolean;
  displayNewPosts: () => void;
  displayTopPosts: () => void;
};

function Borad({
  posts,
  isLoading,
  displayNewPosts,
  displayTopPosts,
}: boardProps) {
  const userName = useContext(userContext);

  return (
    <div className="board">
      {userName ? <AddPost /> : <h2>Sign in to post and comment</h2>}
      <div className="post-view">
        <button onClick={displayNewPosts}>
          <img src={"/imgs/new-icon.svg"} alt="new posts" />
          New
        </button>

        <button onClick={displayTopPosts}>
          <img src={"/imgs/top-icon.svg"} alt="top rank" />
          Top
        </button>
      </div>
      {isLoading ? <div className="lds-dual-ring"></div> : posts}
    </div>
  );
}

export default Borad;
