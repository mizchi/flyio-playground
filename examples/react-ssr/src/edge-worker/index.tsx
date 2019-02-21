import { mount } from "@fly/fetch/mount";
import staticServer from "@fly/static";
import { ssr } from "./ssr";
import { api } from "./api";

const mounts = mount({
  "/static/": staticServer({ root: "/" }),
  "/api/": api,
  "/": ssr
});

fly.http.respondWith(mounts);
