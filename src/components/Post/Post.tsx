import { useContext, useState } from "react";
import { userContext } from "../../App";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../AddPost/AddPost";
import { Link, useNavigate } from "react-router-dom";
import "./post.css";
type postInfo = {
  title: string;
  url: string;
  text: string;
  user: string;
  id: string;
  handleDel: () => void;
  votes: number;
  time: any;
  fetchPostInfo: () => void;
  selected: boolean;
};
function Post({
  title,
  url,
  text,
  user,
  handleDel,
  votes,
  time,
  id,
  fetchPostInfo,
  selected,
}: postInfo) {
  const userName = useContext(userContext);
  const date = new Date(time).toLocaleString();

  const upVote = (id: string) => {
    let docRef = doc(db, "posts", id);
    if (localStorage.getItem(`upvoted${id}`) === "true") {
      updateDoc(docRef, {
        votes: votes - 1,
      });
      localStorage.setItem(`upvoted${id}`, "false");
    } else if (!(localStorage.getItem(`upvoted${id}`) === "true")) {
      updateDoc(docRef, {
        votes: votes + 1,
      });
      localStorage.setItem(`upvoted${id}`, "true");
      localStorage.setItem(`downvoted${id}`, "false");
    }
  };

  const downVote = (id: string) => {
    let docRef = doc(db, "posts", id);
    if (localStorage.getItem(`downvoted${id}`) === "true") {
      updateDoc(docRef, {
        votes: votes + 1,
      });
      localStorage.setItem(`downvoted${id}`, "false");
    } else if (!(localStorage.getItem(`downvoted${id}`) === "true")) {
      updateDoc(docRef, {
        votes: votes - 1,
      });
      localStorage.setItem(`downvoted${id}`, "true");
      localStorage.setItem(`upvoted${id}`, "false");
    }
  };
  const navigate = useNavigate();
  const goToComment = () => {
    navigate(`/PostPage/${id}`);
  };
  return (
    <div className={"post-box"}>
      <div className="vote-sec">
        <button onClick={() => upVote(id)}>
          <img
            src={
              localStorage.getItem(`upvoted${id}`) === "true"
                ? "/imgs/up-voted-icon.svg"
                : "/imgs/up-icon.svg"
            }
            alt="up vote"
          />
        </button>
        <h3>{votes}</h3>
        <button onClick={() => downVote(id)}>
          <img
            src={
              localStorage.getItem(`downvoted${id}`) === "true"
                ? "/imgs/down-voted-icon.svg"
                : "/imgs/down-icon.svg"
            }
            alt="down vote"
          />
        </button>
      </div>
      <div
        className={selected ? "post post-selected" : "post"}
        onClick={fetchPostInfo}
      >
        {selected ? (
          <div>
            {" "}
            <span>Posted by {user} on </span>
            <span>{date}</span>
            <h3>{title}</h3>
            {url !== "" ? (
              <img src={url} alt={"post"} className={"post-photo"} />
            ) : (
              ""
            )}
            <p>{text}</p>
          </div>
        ) : (
          <Link to={`/PostPage/${id}`}>
            <span>Posted by {user} on </span>
            <span>{date}</span>
            <h3>{title}</h3>
            {url !== "" ? (
              <img src={url} alt={"post"} className={"post-photo"} />
            ) : (
              ""
            )}
            <p>{text}</p>
          </Link>
        )}

        <div className="post-btns">
          {userName === user ? (
            <button onClick={handleDel}>
              <img src="/imgs/del-icon.svg" alt="delete icon" /> Delete
            </button>
          ) : (
            ""
          )}
          {userName && !selected ? (
            <button onClick={goToComment}>
              <img src="/imgs/comment-icon.svg" alt="delete icon" /> Comment
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
