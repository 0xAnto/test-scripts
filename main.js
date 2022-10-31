const WalletClient = require("aptos-wallet-api/src/wallet-client");
const env = require("dotenv");
env.config();
const NODE_URL_MAIN = "https://fullnode.mainnet.aptoslabs.com/v1";
const FAUCET_URL_MAIN = "https://faucet.mainnet.aptoslabs.com";
const main = async () => {
  let walletClient = new WalletClient(NODE_URL_MAIN, FAUCET_URL_MAIN);
  const code = process.env.CodeMain;
  const account = await walletClient.getAccountFromMnemonic(code, 0);
  console.log("account", account.account.address().toShortString());
  let rawPayload = {
    type: "entry_function_payload",
    function:
      "0x62fdfe47c9c37227be1f885e79be827be292fe1833ac63a2fe2c2c16c55ecb12::aggregatorV1::direct_route",
    type_arguments: [
      "0x1::aptos_coin::AptosCoin",
      "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
      "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated",
    ],
    arguments: ["1", "1", "false", "1000", "63"],
  };
  const txnRequest = await walletClient.client.generateTransaction(
    account.account.address(),
    rawPayload,
    {
      max_gas_amount: "20000",
      gas_unit_price: "100",
    }
  );
  let txn = await walletClient.simulate(account.account, txnRequest);
  console.log(txn);
};
main();
