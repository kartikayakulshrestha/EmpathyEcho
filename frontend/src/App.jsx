import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Pagination,Flex,Input } from 'antd';
import Tablee from "./components/Table"
function App() {
  const [data, setdata] = useState([]);
  const [filter, setFilter] = useState("");
  const [tagging, setTagging] = useState({});
  const [currentpage,setcurrentpage]=useState(1)
  const [pagelimit,setpagelimit] = useState(10)
  const [totalpage,settotalpage] = useState(15)
  const [total,settotal]=useState(0)

  //for deBouncing issues in searching
  const [loading,setloading]=useState(false)

  async function fetcher() {
    
    
    
    let res = await axios.get(`https://dummyjson.com/posts?skip=${(currentpage-1)*pagelimit}&limit=${pagelimit}`);
    settotal(res.data.total)
    setdata(res.data.posts);
    if(localStorage.getItem("tags")){
      setTagging(JSON.parse(localStorage.getItem("tags")))
    }else{
      
      let x = JSON.stringify(tagging)
      localStorage.setItem("tags",x)
    }
    const storedPageNumber = localStorage.getItem("currentpage");

    if (storedPageNumber == null) {
      
      localStorage.setItem("currentpage", currentpage);
    } else {
      
      setcurrentpage(parseInt(storedPageNumber));
    }
    console.log(currentpage)
    const pagelimitl = localStorage.getItem("pagelimit");

    if (pagelimitl == null) {
      
      localStorage.setItem("pagelimit", pagelimit);
    } else {
      
      setpagelimit(parseInt(pagelimitl));
    }
    const totalpagel=localStorage.getItem("totalpage")
    if(totalpagel==null){
      localStorage.setItem("totalpage", totalpage);
    }
    else {
      
      settotalpage(parseInt(totalpagel));
    }
    const filterl=localStorage.getItem("filter")
    if(filterl==null || filterl===""){
      localStorage.setItem("filter", filter);
    }
    else {
      setFilter(filterl)
      let res = await axios.get("https://dummyjson.com/posts?limit=150");
      let filteredData = res.data.posts.filter((f) =>
      f.body.toLowerCase().includes(filterl.toLowerCase())
    );
    setdata(filteredData);
    }
    
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
    localStorage.setItem("tags",JSON.stringify(uniqueTags))
  }

  useEffect(() => {
    fetcher();
    if(localStorage.getItem("tags")===null){
      tagsCollector()
    }
    
  }, [currentpage,pagelimit]);
  useEffect(()=>{
    if(filter===""){
      fetcher()
    }
  },[filter])
  
  async function handleTagChange(key) {
    let updatedTagging = { ...tagging }; 
    (updatedTagging[key]===false)?updatedTagging[key] = true:updatedTagging[key] = false 
    setTagging(updatedTagging); 
    localStorage.setItem("tags",JSON.stringify(updatedTagging))
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
  function negetive(){
    let x =currentpage-1
    setcurrentpage(x)
    localStorage.setItem("currentpage",x)
  }
  function postive(){
    let x =currentpage+1
    setcurrentpage(x)
    localStorage.setItem("currentpage",x)
  }
  function changeVals(e){
    const newPageLimit = parseInt(e.target.value);
  setpagelimit(newPageLimit);
    localStorage.setItem("pagelimit",newPageLimit)
  const totalPages = Math.ceil(total / newPageLimit);
  settotalpage(int(totalPages));
    localStorage.setItem("totalpage",totalPages)
  }
  async function handleFilterChangee(event) {
    console.log(event)
    let value = event.target.value
    setFilter(value);
    localStorage.setItem("filter",value)
    
    if(loading===false){
      setloading(true)
      
    try {
      
        let res = await axios.get("https://dummyjson.com/posts?limit=150");
        let filteredData = res.data.posts.filter((f) =>
        f.body.toLowerCase().includes(value.toLowerCase())
        );
        setdata(filteredData);
      
      
    
    
    } catch (error) {
      alert('check your connection')
    }
    setloading(false)
    }
    
  }

  function changeValse(currentPage, pageSize){
    console.log(currentPage, pageSize)

    setcurrentpage(currentPage)
    const totalPages = Number(Math.ceil(total / pageSize));
    settotalpage(totalPages);
    setpagelimit(pageSize)
    console.log(pagelimit, totalpage,currentpage)
    localStorage.setItem("currentpage",currentPage)
    
    
    localStorage.setItem("totalpage",totalPages)
    
    localStorage.setItem("pagelimit",pageSize)
  }
  
  
  return (
    <>
    
      <div className="">
        
         <h1 style={{ fontFamily: 'Roboto, sans-serif', textAlign:"center" }}>EmpathyEcho</h1>
        
        <div style={{ width:"100%" ,fontFamily: 'Roboto, sans-serif' }}>
          <Flex wrap="wrap" gap="small" justify="center" >
          Tags Filter:
          {Object.entries(tagging).map(([tag, value]) => (
            <div key={tag}>
              
              
              <input
                type="checkbox"
                name={tag}
                checked={value}
                onChange={() => handleTagChange(tag)}
              />
              <label htmlFor={tag} style={{fontFamily: 'Roboto, sans-serif', marginLeft: '0.5rem' }}> {tag[0].toUpperCase()}{tag.slice(1)}</label>
            </div>
          ))}
          <br />
          <Input type="text"
          value={filter}
          onChange={(e) => handleFilterChangee(e)}
          placeholder="Search"
          style={{width:"50vw",}}/>
          </Flex>
        </div>
        <p style={{textAlign:"end",fontFamily: 'Roboto, sans-serif' }}>Page:{currentpage}/{totalpage}</p>
        
        
        <div style={{overflowX: "auto",whiteSpace: "nowrap",maxWidth: "100%"}}>
        <Tablee data={data}/>
        </div>
        <button onClick={()=>{negetive()} } disabled={currentpage<1?true:false}>Back</button>
        {currentpage}
        <button onClick={()=>{postive()}} disabled={currentpage>=totalpage-1?true:false}>Next</button>
        <Flex wrap="wrap" gap="small" justify="center" >
        <Pagination defaultCurrent={currentpage}  showSizeChanger={true} current={currentpage} total={total}  pageSizeOptions={[7,10,15,20]} onChange={(currentPage, pageSize)=>{changeValse(currentPage, pageSize)}}/>

        </Flex>
     </div>
    </>
  );
}

export default App;
