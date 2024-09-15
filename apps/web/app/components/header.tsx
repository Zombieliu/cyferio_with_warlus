import { Button } from "@repo/ui/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  ConnectButton,
  useCurrentAccount,
  useCurrentWallet,
  useSignTransaction,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import React, { useEffect } from "react";

import {
  NETWORK,
  PACKAGE_ID,
  TREASURE_ADDRESS,
  TREASURE_OBJECT_ADDRESS,
} from "../chain/config";

export const Header = () => {
  const [treasuryBalance, setTreasuryBalance] = React.useState("0");
  const [treasuryObjectBalance, setTreasuryObjectBalance] = React.useState("0");
  const { mutate: signAndExecuteTransactionBlock } =
    useSignAndExecuteTransaction();
  const { currentWallet, connectionStatus } = useCurrentWallet();

  //   useEffect(() => {
  //     if (!connected) return;
  //     console.log("connected wallet name: ", wallet?.name);
  //     console.log("account address: ", account?.address);
  //     console.log("account publicKey: ", account?.publicKey);
  //   }, [connected]);

  const wallet_address = useCurrentAccount()?.address;



  function convertBalanceToCurrency(balance: number): string {
    const amount = balance / Math.pow(10, 8);
    const formattedAmount = amount.toFixed(2);
    return formattedAmount;
  }

  const address = `https://suiscan.xyz/devnet/account/${TREASURE_ADDRESS}`;

  return (
    <div className="flex items-center justify-around bg-zinc-300 py-6">
      <div className="flex items-center">
        <div>
          <Link href="/">
            <Image
              src="/noggles.svg"
              width={80}
              height={80}
              alt="Picture of the author"
            />
          </Link>
        </div>
        <div className="ml-5">
          <Link href={address} target="_blank">
            <Button variant="outline" className="font-bold bg-zinc-300 ">
              Treasury Ξ{" "}
              {`${convertBalanceToCurrency(Number(treasuryObjectBalance))} OBJ`}
            </Button>
          </Link>
        </div>

        <div className="ml-5">
          <Link href="/proposal">
            <Button variant="outline" className="font-bold bg-zinc-300 ">
              DAO
            </Button>
          </Link>
        </div>
    
      </div>
      <div>
        <ConnectButton />
      </div>
    </div>
  );
};
