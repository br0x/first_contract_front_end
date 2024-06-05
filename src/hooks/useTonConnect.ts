import { CHAIN, useTonConnectUI } from '@tonconnect/ui-react';
import { Address, Sender, SenderArguments } from '@ton/core';

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();
  const adr = tonConnectUI.account?.address;
  const addr = (adr !== undefined ? Address.parse(adr) : undefined);

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [ // min is 1, max is 4
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
          network: CHAIN.TESTNET,
        });
      },
      address: addr,
    },
    connected: tonConnectUI.connected,
  };
}
