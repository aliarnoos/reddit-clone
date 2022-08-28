import Post from "../components/Post/Post";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../components/AddPost/AddPost";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../App";
import "./post-page.css";

type props = {
  postInfo: any;
  postDel: () => void;
};
function PostPage({ postInfo, postDel }: props) {
  let navigate = useNavigate();
  function postDelete(id: string) {
    const docRef = doc(db, "posts", id);
    deleteDoc(docRef);
    navigate("/");
  }
  const userName = useContext(userContext);

  return (
    <div className="post-info">
      <Post
        title={postInfo.title}
        url={postInfo.url}
        text={postInfo.text}
        user={postInfo.user}
        key={postInfo.id}
        id={postInfo.id}
        votes={postInfo.votes}
        time={postInfo.time}
        selected={true}
        handleDel={() => postDelete(postInfo.id)}
        fetchPostInfo={() => "data"}
      />
      <div className="comment">
        <span>comment as {userName}</span>
        <textarea
          name="comment"
          placeholder="What are your thoughts?"
        ></textarea>
        <button>Comment</button>
      </div>
    </div>
  );
}

export default PostPage;
