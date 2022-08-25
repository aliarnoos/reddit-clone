function AddPost() {
    return ( 
        <>
          <form action="POST">
            <input type="text" name="title" placeholder="Title" />
            <input type="url" name="url" placeholder="Link" />
            <textarea name="Text" placeholder="Text(optional)"></textarea>
          </form>
        </>
     );
}

export default AddPost;