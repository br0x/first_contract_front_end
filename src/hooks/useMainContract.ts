import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

// replace with your address from tutorial 2 step 8
const mainContractAddr = "kQBDyugPjn53Zyp_GLxDXfMtSgZsAiHi4NvOOPIeHzVZObYh";

export function useMainContract() {
  const client = useTonClient();
  
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: string;
    owner_address: string;
  }>();

  const [balance, setBalance] = useState<null | bigint>(0n);

  const { sender } = useTonConnect();
    
  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse(mainContractAddr)
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const { balance } = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender.toString(),
        owner_address: val.owner_address.toString(),
      });
      setBalance(balance);

      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance?.toString(),
    ...contractData, // counter_value, recent_sender, owner_address
    sendIncrement: () => { return mainContract?.sendIncrement(sender, toNano(0.05), 5); },
    sendDeposit: () => { return mainContract?.sendDeposit(sender, toNano(1)); },
    sendWithdrawalRequest: () => { return mainContract?.sendWithdrawalRequest(sender, toNano(0.05), toNano(0.7)); },
  };
}

