import url from "url";
import pathToRegexp, { Key } from "path-to-regexp";

type NonPromise<T> = T extends Promise<infer R> ? R : T;

type RouteAction<Params, ActionResult> = (
  params: Params & { url: string }
) => (req: Request) => Promise<ActionResult>;

type Route<Params, ActionResult = Request> = {
  original: string;
  expr: RegExp;
  keys: Key[];
  action: RouteAction<Params & { url: string }, ActionResult>;
};

type RouterOption<ActionResult> = {
  postAction?: (t: NonPromise<ActionResult>) => Promise<Response>;
};

export class Router<ActionResult = Response> {
  routes: Route<any, ActionResult>[] = [];
  private _options: RouterOption<ActionResult>;

  constructor(options: RouterOption<ActionResult> = {}) {
    this._options = options;
  }

  add<Params>(pathExpr: string, action: RouteAction<Params, ActionResult>) {
    const keys: Key[] = [];
    const expr = pathToRegexp(pathExpr, keys);
    this.routes.push({ original: pathExpr, expr, keys, action });
  }

  async run(req: Request): Promise<Request | void> {
    const pathname = url.parse(req.url).pathname as string;
    for (const route of this.routes) {
      const match = route.expr.exec(pathname);
      if (match instanceof Array) {
        const actionResult: ActionResult = await this._execAction(
          req,
          match,
          route
        );
        return this._options.postAction
          ? this._options.postAction(actionResult as any)
          : (actionResult as any);
      }
    }
    return;
  }

  async _execAction<Params>(
    req: Request,
    matched: RegExpExecArray,
    route: Route<Params, ActionResult>
  ): Promise<ActionResult> {
    const params: any = route.keys.reduce(
      (acc, key, index) => {
        return {
          ...acc,
          [key.name]: matched[index + 1]
        };
      },
      { url: matched[0] }
    );
    return route.action(params)(req);
  }
}
