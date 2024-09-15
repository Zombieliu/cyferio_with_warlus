"use client";

// import { useCurrentAccount, useCurrentWallet, useSignPersonalMessage } from "@mysten/dapp-kit";
import {
  Ed25519Keypair,
  getFullnodeUrl,
  SovereignClient,
  toHEX,
  fromB58,
  toB58
} from "@0xobelisk/sov-client";
import React, { useState } from "react";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@ui/components/ui/dropdown-menu";
import { useAuthCallback, useEnokiFlow } from "@mysten/enoki/react";
import * as fhe_create_token from "./chain/fhe/create_token.json";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { useLogin } from "@privy-io/react-auth";
import { useSignMessage } from "@privy-io/react-auth";
import {bcs, loadMetadata, Obelisk, Transaction, TransactionResult} from '@0xobelisk/sui-client';
import { NETWORK, PACKAGE_ID, WORLD_ID } from "./chain/config";
import { toast } from "sonner";

export default function Page() {
  const [da_height,SetDaHeight] = useState(109666199);
  const [show_digest,SetDigest] = useState("");
  const enokiFlow = useEnokiFlow();
  const { handled } = useAuthCallback();
  const nodeApi = getFullnodeUrl("localnet");
  const client = new SovereignClient(nodeApi);

  function LogInIcon(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" x2="3" y1="12" y2="12" />
      </svg>
    );
  }

  const zk_login = async () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    console.log(protocol, host);
    const redirectUrl = `${protocol}//${host}`;
    await enokiFlow
      .createAuthorizationURL({
        provider: "google",
        network: "testnet",
        clientId: "40066679555-vibqigf8l3ginnva8sjhceag08svkllt.apps.googleusercontent.com",
        redirectUrl,
        extraParams: {
          scope: ["openid", "email", "profile"],
        },
      })
      .then((url) => {
        window.location.href = url;
      })
      .catch((error) => {
        console.error(error);
        alert("zk login error");
      });
      // alert("zk login success");
      toast("zk login Successful", {
        description: new Date().toUTCString()
      });
  };

  const send_tx = async () => {
    const client = new SovereignClient({
      rest: "https://tmc-rest.cyferio.com",
      rpc: "https://tmc-rpc.cyferio.com",
    });

    const test_private_key = new Uint8Array([
      117, 251, 248, 217, 135, 70, 194, 105, 46, 80, 41, 66, 185, 56, 200, 35,
      121, 253, 9, 234, 159, 91, 96, 212, 211, 158, 135, 225, 180, 36, 104, 253,
    ]);

    const keypair = Ed25519Keypair.fromSecretKey(test_private_key, {
      skipValidation: true,
    });
    console.log(keypair.toAddress());

    let pay_address = keypair.toAddress()
    const EnokiKeypair = await enokiFlow.getKeypair({ network: "testnet" });
    let pubkey = EnokiKeypair.getPublicKey().toRawBytes();
    let address = client.encodePubkeyToSovAddress({ pubkey: toHEX(pubkey) });
    console.log("3", address);
    const callPayload = {
      bank: {
        Transfer: {
          to: address,
          coins: {
            amount: 100000,
            token_id:
              "token_1rwrh8gn2py0dl4vv65twgctmlwck6esm2as9dftumcw89kqqn3nqrduss6",
          },
        },
      },
    };

    let credentialId = await client.getCredentialIds({
      sovAddr: pay_address
    });
    console.log(credentialId);

    let nonce
    if (credentialId.data.value === null){
      nonce = {
        nonce:0
      }
    }
    nonce = await client.queryNonce({
      credentialId: credentialId.data.value[0],
    });
      const res = await client.signAndExecuteBatchTransaction({
        callPayload,
      signer: keypair,
      nonce:nonce.nonce,
    }) as any;

    console.log(res.data.daHeight);
    console.log(res.data.numTxs);
    SetDaHeight(res.data.daHeight);
    toast("send tx success", {
      description: new Date().toUTCString()
    });
  };

  const create_account = async () => {
    const client = new SovereignClient({
      rest: "https://tmc-rest.cyferio.com",
      rpc: "https://tmc-rpc.cyferio.com",
    });

    const test_private_key = new Uint8Array([
      117, 251, 248, 217, 135, 70, 194, 105, 46, 80, 41, 66, 185, 56, 200, 35,
      121, 253, 9, 234, 159, 91, 96, 212, 211, 158, 135, 225, 180, 36, 104, 253,
    ]);

    const keypair = Ed25519Keypair.fromSecretKey(test_private_key, {
      skipValidation: true,
    });
    console.log(keypair.toAddress());

    let pay_address = keypair.toAddress()
    const EnokiKeypair = await enokiFlow.getKeypair({ network: "testnet" });
    let pubkey = EnokiKeypair.getPublicKey().toRawBytes();
    let address = client.encodePubkeyToSovAddress({ pubkey: toHEX(pubkey) });
    console.log("3", address);
    const callPayload = {
      bank: {
        Transfer: {
          to: address,
          coins: {
            amount: 100000,
            token_id:
              "token_1rwrh8gn2py0dl4vv65twgctmlwck6esm2as9dftumcw89kqqn3nqrduss6",
          },
        },
      },
    };
    try{
      const res = await client.signAndExecuteBatchTransaction({
      callPayload,
      signer: keypair,
      nonce:0,
    }) as any;

    console.log(res.data.daHeight);
    console.log(res.data.numTxs);
    SetDaHeight(res.data.daHeight);
    } catch (error) {
      toast("create account success", {
        description: new Date().toUTCString()
      });
    }
  };

  const query_digest = async () => {
    try {
      console.log("Querying with DA height:", da_height);
      
      const metadata = await loadMetadata(NETWORK, PACKAGE_ID);
      const obelisk = new Obelisk({
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
      });
      
      const obelisk_entity_key = await obelisk.entity_key_from_u256(da_height);
      console.log("Obelisk entity key:", obelisk_entity_key);

      const all_digest = await obelisk.getEntity(WORLD_ID, "walrus_da", obelisk_entity_key);
      const digest = all_digest[0];
      console.log("Digest:", digest);
      toast("Translation Successful", {
        description: new Date().toUTCString(),
        action: {
          label: "Check in Explorer",
          onClick: () => window.open(`https://testnet.suivision.xyz/txblock/${digest}`, "_blank"),
        },
      });
      SetDigest(digest);
    } catch (error) {
      console.error("Error in query_digest:", error);
      toast.error("Failed to query digest", {
        description: "An error occurred while querying the digest.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
      <header className="flex items-center justify-between w-full px-4 py-4 border-b md:px-6">
        <div className="flex items-center space-x-2">
          <LogInIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">TMC Demo</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={query_digest}
          >
          4-Query Digest 
        </Button>
          <Button onClick={send_tx}>3-Send TX</Button>
          <Button onClick={create_account}>2-Create TMC Account</Button>
          <Button onClick={zk_login}>1-ZK-Login</Button>
        </div>
      </header>
      <main className="flex flex-col items-center flex-1 w-full px-4 py-8 text-center md:px-6">
        <h2 className="text-3xl font-bold">TMC With Walrus Test |</h2>
        <p className="mt-4 text-lg">
          This is simple TMC With Walrus Demo !
        </p>
        <p className="mt-4 text-lg">
          This is digest: {show_digest}
        </p>
      </main>
    </div>
  );
}
