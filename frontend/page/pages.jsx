import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RollbackOutlined } from "@ant-design/icons";
import { Button, Tag, Table } from "antd";
import axios from "axios";

const pages = () => {
  const categoryColors = {
    history: "volcano",
    american: "lime",
    crime: "green",
    french: "yellow",
    fiction: "red",
    english: "cyan",
    magical: "purple",
    mystery: "orange",
    love: "blue",
    classic: "magenta",
  };
  const columns = [
    {
      title: "S.no",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_, { title, id }) => {
        return (
          <>
            <a href={`/${id}`}>{title}</a>
          </>
        );
      },
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
      render: (_, { body }) => {
        return <>{body.slice(0, 90)}...</>;
      },
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
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
      title: "Reaction",
      dataIndex: "reactions",
      key: "reactions",
    },
  ];
  const { id } = useParams();
  const [data, setdata] = useState({});
  const [userdata, setuserdata] = useState([]);
  const navigate = useNavigate();
  async function fetch() {
    try {
      let res = await axios.get(`https://dummyjson.com/posts/${id}`);
      let res1 = res.data;
      setdata(res1);
      console.log(data);
      let res2 = await axios.get(`https://dummyjson.com/posts?limit=150`);

      let x = res2.data.posts.filter((f) => {
        //console.log(f.userId,data.userId)
        return f.userId === res.data.userId && f.id !== res.data.id;
      });
      setuserdata(x);
    } catch (error) {
      return navigate("/");
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          navigate("/");
        }}
      >
        {" "}
        <RollbackOutlined style={{ color: "black" }} size={60} />
      </Button>
      <div
        style={{
          margin: "50px 50px ",
        }}
      >
        <h1 style={{ fontFamily: "Roboto, sans-serif", textAlign: "center" }}>
          EmpathyEcho
        </h1>

        <h1>{data.title}</h1>

        {data.title &&
          Object.values(data.tags).map((tag) => {
            return (
              <Tag color={categoryColors[tag]} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}

        <p style={{ fontFamily: "sans-serif" }}>{data.body}</p>
        {console.log(userdata)}

        <span> Number of Reactions: {data.reactions}</span>
        <p>User id:{data.userId}</p>

        {userdata.length > 0 ? (
          <>
            <h3>Some more Articles of User Id {data.userId}</h3>
            <div
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              <Table
                dataSource={userdata}
                columns={columns}
                rowKey="id"
                pagination={false}
              />
            </div>
          </>
        ) : (
          <h3>There are no more Articles of this User Id</h3>
        )}
      </div>
    </>
  );
};

export default pages;
