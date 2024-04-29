import React from 'react'
import {  Table, Tag } from 'antd';
const Tablee = (props) => {
  
const categoryColors = {
  "history": "volcano",    
  "american": "lime", 
  "crime": "green",
  "french": "yellow",
  "fiction": "red",
  "english": "cyan",
  "magical":"purple",
  "mystery": "orange",
  "love": "blue",
  "classic": "magenta"
};
  const columns = [
    {
      title: 'S.no',
      dataIndex: 'id',
      key: 'id',
      
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render:(_,{title,id})=>{
        return  <>
        <a href={`/${id}`}>{title}</a>
        </>
      }
    },
    {
      title: 'Body',
      dataIndex: 'body',
      key: 'body',
      render:(_,{body})=>{
        return  <>
        {body.slice(0,90)}...
        </>
      }
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            
            
            
            return (
              <Tag color={categoryColors[tag]} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
      
    },
    {
      title: 'Reaction',
      dataIndex: 'reactions',
      key: 'reactions',
    },
    
  ];
  return (
    <div>
      <Table dataSource={props.data} columns={columns} rowKey="id" pagination={false}/>
      
    </div>
  )
}

export default Tablee
