import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Button } from "antd";

function App() {
  const [data, setdata] = useState([]);
  const [filter, setFilter] = useState("");
  const [tagging, setTagging] = useState({});
  const [currentpage,setcurrentpage]=useState(0)
  const [pagelimit,setpagelimit] = useState(10)
  const [totalpage,settotalpage] = useState(15)
  const [total,settotal]=useState(0)

  async function fetcher() {
    let res = await axios.get(`https://dummyjson.com/posts?skip=${currentpage*pagelimit}&limit=${pagelimit}`);
    settotal(res.data.total)
    setdata(res.data.posts);
  }

  async function tagsCollector() {
    let res = await axios.get("https://dummyjson.com/posts?limit=150");
    const uniqueTags = {};

    res.data.posts.forEach((item) => {
      item.tags.forEach((tag) => {
        if (!uniqueTags.hasOwnProperty(tag)) {
          uniqueTags[tag] = false;
        }
      });
    });

    setTagging(uniqueTags);
  }

  useEffect(() => {
    fetcher();
    if (Object.keys(tagging).length === 0) {
      tagsCollector();
    }
  }, [currentpage]);

  async function handleTagChange(key) {
    let updatedTagging = { ...tagging }; 
    (updatedTagging[key]===false)?updatedTagging[key] = true:updatedTagging[key] = false 
    setTagging(updatedTagging); 
    let val = []
    Object.entries(updatedTagging).filter(([k,v])=>{
      if (v===true){
        val.push(k)
      }
    })
    handleFilterChange(val)
  }

  async function handleFilterChange(value) {
    if(value.length){
    let res = await axios.get("https://dummyjson.com/posts?limit=150");
    let filteredData = res.data.posts.filter(post => {
      return value.some(tag => post.tags.includes(tag));
    });
    setdata(filteredData)
  }else{
    let res = await axios.get("https://dummyjson.com/posts");
    setdata(res.data.posts);
  }
  }
  function changeVals(e){
    const newPageLimit = parseInt(e.target.value);
  setpagelimit(newPageLimit);
  const totalPages = Math.ceil(total / newPageLimit);
  settotalpage(totalPages);
  }
  async function handleFilterChangee(value) {
    setFilter(value);
    let res = await axios.get("https://dummyjson.com/posts?limit=150");
    let filteredData = res.data.posts.filter((f) =>
      f.body.toLowerCase().includes(value.toLowerCase())
    );
    setdata(filteredData);
  }
  return (
    <>
      <div className="">
        <input
          type="text"
          value={filter}
          onChange={(e) => handleFilterChangee(e.target.value)}
          placeholder="search"
        />
        
        <div style={{ display: "flex" }}>
          Tags Filter:
          {Object.entries(tagging).map(([tag, value]) => (
            <div key={tag}>
              
              <label htmlFor={tag}> {tag}</label>
              <input
                type="checkbox"
                name={tag}
                checked={value}
                onChange={() => handleTagChange(tag)}
              />
            </div>
          ))}
        </div>
        page:{currentpage+1}/{totalpage}
        <br />
        <lable htmlFor="itemsperpage">itemperpage</lable>
        <select
            id="itemsPerPage"
            value={pagelimit}
            onChange={(e) => {changeVals(e)}}
          >
            <option value={7}>7</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        <table className="">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Body</th>
              <th>Tags</th>
              <th>UserId</th>
              <th>Reactions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.title}</td>
                <td>{e.body}</td>
                <td>
                  {e.tags.map((tag) => (
                    <div key={tag}>{tag}</div>
                  ))}
                </td>
                <td>{e.userId}</td>
                <td>{e.reactions}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={()=>{setcurrentpage(currentpage-1)} } disabled={currentpage<1?true:false}>Back</button>
        {currentpage+1}
        <button onClick={()=>{setcurrentpage(currentpage+1)}} disabled={currentpage>=totalpage-1?true:false}>Next</button>

      </div>
    </>
  );
}

export default App;
