import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Post } from "../RootState";

export function Index() {
  const [items, setItems] = useState<Post[]>([]);

  const updateItem = async () => {
    const data = await fetch("/api/recent-posts").then(res => res.json());
    setItems(data.recent);
  };

  useEffect(() => {
    updateItem();
  }, []);

  return (
    <div>
      <h1>Index</h1>
      <div>
        <AddNewItemForm onCreate={updateItem} />
      </div>
      {items.map(i => {
        return (
          <div key={i.id}>
            <Link to={`/post/${i.id}`}>
              {i.title}: {i.id}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function createPostDraft(): Post {
  return {
    ownerId: "dummy",
    id: "id-" + Math.random().toString(),
    title: "",
    body: ""
  };
}

function AddNewItemForm(props: { onCreate: (newPost: Post) => void }) {
  const [item, setItem] = useState(createPostDraft());
  return (
    <>
      <div>Title</div>
      <textarea
        style={{ width: "80vw" }}
        placeholder="title"
        value={item.title}
        onChange={ev => {
          setItem({ ...item, title: ev.target.value });
        }}
      />
      <div>Body</div>
      <textarea
        style={{ width: "80vw", height: "35vh" }}
        placeholder="body"
        value={item.body}
        onChange={ev => {
          setItem({ ...item, body: ev.target.value });
        }}
      />
      <div>
        <button
          onClick={async () => {
            console.log("add");

            const res = await axios.post("/api/add-item", item);

            props.onCreate(res.data.newPost);

            // reset
            setItem(createPostDraft());
          }}
        >
          add
        </button>
      </div>
    </>
  );
}
