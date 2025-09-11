
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ArweaveWalletKit } from "arweave-wallet-kit";
import { config } from "./config";
import "./index.css";

const root = document.getElementById("root");
console.log("Root element:", root);

if (root) {
  console.log("Creating React root...");
  const reactRoot = createRoot(root);

  reactRoot.render(
    <ArweaveWalletKit
      config={{
        permissions: [...config.walletPermissions],
        ensurePermissions: config.ensurePermissions,
        appInfo: {
          name: config.appName,
          logo: config.appLogo,
        },
      }}
      theme={{
        accent: config.theme.accent,
      }}
    >

      <App />
    </ArweaveWalletKit>
  );

  console.log("React app rendered successfully");
} else {
  console.error("Root element not found!");
}
