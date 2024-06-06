import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "@ton/core";
import WebApp from "@twa-dev/sdk";

// kQBDyugPjn53Zyp_GLxDXfMtSgZsAiHi4NvOOPIeHzVZObYh
function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
  } = useMainContract();

  const { connected } = useTonConnect()

  const showAlert = () => {
    WebApp.showAlert("Hey there!");
  };

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>

      <div>
        <div className='Card'>
          <b>{WebApp.platform}</b>
          <br/>
          <b>Our contract Address</b>
          <div className='Hint'>{ contract_address?.slice(0, 15) + "..." + contract_address?.slice(33, 48) }</div>
          <b>Our contract Balance</b>
          {contract_balance && (
            <div className='Hint'>{ fromNano(contract_balance) }</div>
          )}
          <b>Contract owner address</b>
          {owner_address && (
            <div className='Hint'>{ owner_address?.slice(0, 15) + "..." + owner_address?.slice(33, 48) }</div>
          )}
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{ counter_value ?? "Loading..." }</div>
          <b>Latest sender</b>
          {recent_sender && (
            <div>{ recent_sender?.slice(0, 15) + "..." + recent_sender?.slice(33, 48) }</div>
          )}
        </div>

        <a
          onClick={() => {
            showAlert();
          }}
        >Show Alert</a>
        <br/>

        {connected && (
          <a onClick={() => {sendIncrement();}}>Increment by 5</a>
        )}
        <br/>
        {connected && (
          <a onClick={() => {sendDeposit();}}>Request Deposit of 1 TON</a>
        )}
        <br/>
        {connected && (
          <a onClick={() => {sendWithdrawalRequest();}}>Request 0.7 TON Withdrawal</a>
        )}

      </div>
    </div>
  );
}

export default App;
