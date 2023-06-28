"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { shortenHex } from "@/functions/utils";
import { LogOut } from "lucide-react";
import {
  useConnectors,
  useAccount,
  useStarkName,
  useNetwork,
} from "@starknet-react/core";
import { useState, useEffect } from "react";
import { cn, formatBigInt } from "@/app/lib/utils";
import { useWalletsProviderContext } from "@/app/providers/WalletsProvider";
import Starknet from "@/icons/starknet.svg"
import { RenderExplorers } from "./utils";

function StarkLogin() {
  const { available, connect, connectors, disconnect } = useConnectors();
  const { account, address, status } = useAccount();
  const { balances, refetch } = useWalletsProviderContext();

  /* const { data, isLoading, isError } = useStarkName({
    address: address || "",
  });
  const [starknetID, setStarknetID] = useState("");
  useEffect(() => {
    if (data) {
      setStarknetID(data);
    }
  }, [data]);*/
  const { chain } = useNetwork();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const network =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "goerli" : "mainnet";
  const NETWORK_ID = {
    mainnet: "0x534e5f4d41494e",
    goerli: "0x534e5f474f45524c49",
  };

  useEffect(() => {
    //if (!isConnected) return;

    if (
      (chain?.id === NETWORK_ID.goerli && network === "mainnet") ||
      (chain?.id === NETWORK_ID.mainnet && network === "goerli")
    ) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [chain, network, address /*, isConnected*/]);

  const onDisconnect = () => {
    disconnect();
    //setIsConnected(false);
    setIsWrongNetwork(false);
    //setHasWallet(false);
  };

  if (status === "connected")
    return (
      <div className=" border rounded p-2 pt-4">
        <div className="flex mb-3 justify-between">
          <div className="flex">
            <Starknet class="w-8 px-1" /><div className="self-center"> {chain?.name}</div>
          </div>
          <div>
            <Button
              variant="outline"
              size={"xs"}
              className=""
              onClick={() => onDisconnect()}
            >
              <LogOut className="self-center w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 align-items-center space-x-3">
          <div className="px-4 pt-4 pb-2 border rounded">

            <div className="text-2xl">
              {formatBigInt(balances.l2.eth, 3)} ETH
            </div>

          </div>
          <div className="px-4 pt-4 pb-2 border rounded   flex justify-between">

            <div className="text-2xl">
              {balances.l2.lords && balances.l2.lords > 0 ? formatBigInt(balances.l2.lords, 3) : 0} LORDS

            </div>
            <Button href="/bridge" size={'xs'} variant={'subtle'} className="self-center">Bridge</Button>
          </div>
          {/* {address && (
          <>
            <Button
              variant="outline"
              size={"lg"}
              className="flex justify-around w-full col-span-2"
              onClick={() => onDisconnect()}
            >
              {starknetID ? starknetID : shortenHex(address || "", 8)}

                <Starknet class="w-8 px-1" /> {chain?.name}
              
              <LogOut className="self-center w-4" />
            </Button>
          </>
        )} */}
          {/* <Button variant="outline" size={"lg"} className="group">
          <span className="group-hover:hidden">
            {formatBigInt(balances.l2.eth, 3)}
          </span>
          <span className="group-hover:block hidden">Buy Lords</span>
        </Button>
        {balances.l2.lords && (
          <Button variant="outline" size={"lg"} className="group">
            <span className="group-hover:hidden">
              {formatBigInt(balances.l2.lords, 3)}
            </span>
            <span className="group-hover:block hidden ">Buy Coins</span>
          </Button>
        )}
        <Button onClick={refetch}>Refetch Lrods</Button> */}
          {isWrongNetwork && (
            <Dialog open={isWrongNetwork}>
              <DialogContent className="w-full">
                <DialogHeader>
                  <DialogTitle>Wrong Network</DialogTitle>
                </DialogHeader>
                <span>
                  The Atlas currently only supports {network}, please change the
                  connected network in your wallet, or:
                </span>
                <Button
                  variant={"default"}
                  size={"lg"}
                  className="mt-4"
                  onClick={() => onDisconnect()}
                >
                  Disconnect
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>


      </div>
    );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="self-center normal-case w-full"
          size={"lg"}
          variant={"outline"}
        >
          Connect Starknet Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>Connect Starknet Wallet</DialogHeader>
        <div className="self-center flex-col">
          {connectors.map((connector) => {
            if (connector.available()) {
              return (
                <Button
                  className="self-center w-full"
                  variant={"outline"}
                  size={"lg"}
                  key={connector.id()}
                  onClick={() => connect(connector)}
                >
                  Connect {connector.id()}
                </Button>
              );
            }
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StarkLogin;