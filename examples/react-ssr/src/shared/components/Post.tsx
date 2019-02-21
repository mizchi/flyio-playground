import { RouteComponentProps } from "react-router";
import { useEffect } from "react";
import { Post } from "../RootState";
import React from "react";
import { Link } from "react-router-dom";
import { useRootState, useDispatch } from "../App";
import { setPost } from "../reducer";

// -- /item/:id

export function Post(props: RouteComponentProps<{ id: string }>) {
  const id = props.match.params.id;

  const rootState = useRootState();
  const dispatch = useDispatch();
  const post = rootState.resources.posts[id];

  useEffect(() => {
    (async () => {
      if (post == null) {
        const data = await fetch(`/api/post/${id}`).then(res => res.json());
        dispatch(setPost(data.post));
      }
    })();
  }, []);

  if (post) {
    console.log(post);
    return (
      <div>
        <div style={{ minHeight: "50vh" }}>
          <h2>Title: {post.title}</h2>
          <div>{post.body}</div>
        </div>
        <hr />
        <Link to="/">Top</Link>
      </div>
    );
  } else {
    return <div>Post:{id} not found</div>;
  }
}
