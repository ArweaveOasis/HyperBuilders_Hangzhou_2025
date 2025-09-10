import { result } from "@permaweb/aoconnect";
import { message, createDataItemSigner } from "@permaweb/aoconnect";
// Simple centralized API client for backend calls
export type RegisterPayload = {
  bioSample?: string;
};

const processID: string = "zqxhq0H0VT1qAOKbQOEm-axwQQx_wGwmRN8NDT7Gues";

export async function register(payload: RegisterPayload) {
  const messageId = await message({
  process: processID,
  tags: [
    { name: "Action", value: "Api_auth_register" },
  ],
  signer: createDataItemSigner(globalThis.arweaveWallet),
  data: payload.bioSample,
});

  const res = await result({
    message: messageId,
    process: processID,
  })

  return res.Messages[0].Data ? JSON.parse(res.Messages[0].Data) : null;
}

export async function login(bioSample: string) {
  const messageId = await message({
    process: processID,
    tags: [
      { name: "Action", value: "Api_auth_login" },
    ],
    signer: createDataItemSigner(globalThis.arweaveWallet),
    data: bioSample,
  });
  const res = await result({
    message: messageId,
    process: processID,
  });
  console.log(res);
  return res.Messages[0].Data ? JSON.parse(res.Messages[0].Data) : null;
}

export async function verify(body: { bioSample: string; challenge: string }) {
  const message_id = await message({
    process: processID,
    tags: [
      { name: "Action", value: "Api_auth_verify" },
    ],
    signer: createDataItemSigner(globalThis.arweaveWallet),
    data: JSON.stringify(body),
  })
  const res = await result({
    message: message_id,
    process: processID,
  })
  return res;
}

export default { register, login, verify };
