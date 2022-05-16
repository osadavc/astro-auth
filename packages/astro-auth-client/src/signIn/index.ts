import { Providers } from "@astro-auth/types";
import axios from "redaxios";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

const signIn = async ({
  provider,
  login,
  callbackURL,
}: {
  provider: Providers;
  login?: any;
  callbackURL?: string;
}) => {
  if (provider == "credential" && !login) {
    throw new Error(
      "ASTROAUTH: Login Details Are Required For The Credential Provider"
    );
  }

  let metamaskInfo: {
    address?: string;
    signature?: string;
  } = {};

  if (provider == "metamask") {
    if (!window.ethereum) {
      return {
        error: "Metamask is not installed",
      };
    }

    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();

    const { data } = await axios.get("api/auth/sign-message");

    const signature = await signer.signMessage(data.message);
    const address = await signer.getAddress();

    metamaskInfo = {
      address,
      signature,
    };
  }

  const { data } = await axios
    .post("/api/auth/signin", {
      provider,
      callback: callbackURL ?? location.href,
      login: login ?? metamaskInfo,
    })
    .catch((err) => err);

  if (window.location) {
    location.href = data.loginURL || data.redirect;
  }
  return data;
};

export default signIn;
