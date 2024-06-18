import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RollbackOutlined } from "@ant-design/icons";
import { Button, Tag, Table } from "antd";
import axios from "axios";

const Pages = () => {
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
  const [data, setData] = useState({});
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      let res = await axios.get(`https://dummyjson.com/posts/${id}`);
      let res1 = res.data;
      setData(res1);
      console.log("Post data: ", res1);

      let res2 = await axios.get(`https://dummyjson.com/posts?limit=150`);
      let x = res2.data.posts.filter((f) => {
        return f.userId === res1.userId && f.id !== res1.id;
      });
      setUserData(x);
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <>
      <Button
        onClick={() => {
          navigate("/");
        }}
      >
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

        {data.tags &&
          data.tags.map((tag) => {
            return (
              <Tag color={categoryColors[tag]} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}

        <p style={{ fontFamily: "sans-serif" }}>{data.body}</p>
        <span> Number of Reactions: {data.reactions}</span>
        <p>User id: {data.userId}</p>

        {userData.length > 0 ? (
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
                dataSource={userData}
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

export default Pages;
