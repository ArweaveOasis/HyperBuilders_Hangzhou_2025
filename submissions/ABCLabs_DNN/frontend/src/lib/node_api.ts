import { result } from "@permaweb/aoconnect";
import { message, createDataItemSigner } from "@permaweb/aoconnect";
// Simple centralized API client for backend calls
export type DNN_Node = {
  id: string;
  title: string;
  tagline: string;
  votes: number;
  image: string;
};

const processID: string = "zqxhq0H0VT1qAOKbQOEm-axwQQx_wGwmRN8NDT7Gues";

export async function createNode(val_node: DNN_Node) {
  const messageId = await message({
    process: processID,
    tags: [
      { name: "Action", value: "Api_node_create" },
    ],
    signer: createDataItemSigner(globalThis.arweaveWallet),
    data: JSON.stringify(val_node),
  });
  console.log(messageId);
  
  const res = await result({
    message: messageId,
    process: processID,
  })
  console.log(res);
  
  return res.Messages[0].Data ? JSON.parse(res.Messages[0].Data) : null;
}


export async function getProducts() {
  const message_id = await message({
    process: processID,
    tags: [
      { name: "Action", value: "Api_node_list" },
    ],
    signer: createDataItemSigner(globalThis.arweaveWallet),
  });
  const res = await result({
    message: message_id,
    process: processID,
  });
  return JSON.parse(res.Messages[0].Data);
}

export default { getProducts ,createNode};
