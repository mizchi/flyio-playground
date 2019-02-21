import React from "react";
import { Link } from "react-router-dom";
import { RootState } from "../RootState";

export const HEADER_LINKS: { name: string; path: string }[] = [
  {
    name: "Index",
    path: "/"
  },
  {
    name: "Hacker News",
    path: "/hn"
  },
  {
    name: "Counter",
    path: "/counter"
  }
];

export function Header(props: RootState) {
  return (
    <header suppressHydrationWarning={true}>
      <h1>SSR on fly.io playground</h1>
      <div>generated {props.timestamp}</div>
      {HEADER_LINKS.map(link => {
        return (
          <span key={link.path}>
            <Link to={link.path}>{link.name}</Link>
            |&nbsp;
          </span>
        );
      })}
    </header>
  );
}
