import './post.css'
type postInfo = {
    title: string
    url: string
    text: string
    user: string
    handleDel: () => void
}
function Post({title, url, text, user, handleDel} : postInfo) {
    return ( 
        <div className="post">
            <span>By {user}</span>
            <h3>{title}</h3>
            <span>{url}</span>
            <p>{text}</p>
            <button onClick={handleDel}>Delete</button>
        </div>
     );
}

export default Post;