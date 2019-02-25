import { mount } from "@fly/fetch/mount";
import staticServer from "@fly/static";
import { ssr } from "./ssr";

const mounts = mount({
  "/static/": staticServer({ root: "/" }),
  "/": ssr
});

fly.http.respondWith(mounts);
