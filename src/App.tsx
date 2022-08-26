import NavBar from "./components/NavBar/NavBar";
import './App.css'
import AddPost from "./components/AddPost/AddPost";
import { useState } from "react";
import Borad from "./components/Board/Board";

interface IState {
  Post : boolean
}
function App() {
  const [postStatus, setPostStatus] = useState<any>(false)
  const addPost = () => {
    setPostStatus(true)
  }
  return (
    <div className="App">
      <NavBar/>
      <div className="main">
          {!postStatus ? <button className="add-post" onClick={addPost}>Add Post</button>
           : <AddPost setPostStatus={setPostStatus}/> }
           <Borad/>
      </div>
    </div>
  );
}

export default App;
