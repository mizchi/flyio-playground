import axios from "axios";

export class RpcRegistory {
  funcMap: {
    [id: string]: (input: any) => Promise<any>;
  } = {};
  register<T, U>(name: string, action: (t: T) => Promise<U>) {
    if (typeof fly === "object") {
      this.funcMap[name] = action;
      return async (data: T) => {
        return action(data);
      };
    } else {
      return async (data: any) => {
        const res = await axios.post(`/api/rpc/${name}`, data);
        return res.data;
      };
    }
  }
}

export async function callRpc(name: string, data: object) {
  const res = await axios.post(`/api/rpc/${name}`, data);
  return res.data;
}
