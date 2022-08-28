import "./App.css";
import logo from "./logo.svg";
import w3authlogo from "./web3authlogo.png";
import { useMoralis, useWeb3Transfer, useMoralisWeb3Api } from "react-moralis";
import { useEffect, useState } from "react";

function App() {
  const {
    isAuthenticated,
    authError,
    isAuthenticating,
    logout,
    user,
    authenticate,
    Moralis,
    isWeb3Enabled,
    enableWeb3,
  } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const [balance, setBalance] = useState(0.0);

  const { fetch } = useWeb3Transfer({
    type: "native",
    amount: Moralis.Units.ETH(0.001),
    receiver: "0x0000000000000000000000000000000000000000",
  });

  useEffect(() => {
    if (isAuthenticated) {
      async function getBalance() {
        const balance = await Web3Api.account.getNativeBalance({
          chain: "0x13881",
        });
        setBalance(
          parseFloat(Moralis.Units.FromWei(balance.balance)).toFixed(4)
        );
      }
      getBalance();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled)
      enableWeb3({
        provider: "web3Auth",
        clientId:
          "BGny-kghxFcbCNbfNFn1t66jwqxtnr2744vQ9aHHr06u7jhe9iI1nm1zPKLkVKer0cW2F6Weip8FZ24rwfMwFEs",
        chainId: "0x13881",
      });
  }, [isAuthenticated, isWeb3Enabled]);

  const handleCustomLogin = async () => {
    authenticate({
      provider: "web3Auth",
      clientId:
        "BGny-kghxFcbCNbfNFn1t66jwqxtnr2744vQ9aHHr06u7jhe9iI1nm1zPKLkVKer0cW2F6Weip8FZ24rwfMwFEs",
      chainId: "0x13881",
    });
  };

  const transferMatic = () => {
    console.log("Transaction Processing ....");
    fetch({
      onSuccess: async (tx) => {
        console.log("Transaction info before confirmation", tx);
        await tx.wait();
        console.log("Transaction info after confirmation", tx);
        console.log("Transaction completed ............");
      },
      onError: (error) => {
        console.log("Error Processing Transaction");
        console.log("Error Info", error);
      },
    });
  };

  return (
    <div className="backgroundParent">
      <div className="App">
        <h2>Test web3Auth x Moralis</h2>
        <div className="logos">
          <img src={logo} alt="moralis logo" />
          <img src={w3authlogo} alt="web3Auth logo" />
        </div>
        <div>
          {isAuthenticating && <p className="green"> Authenticating ....</p>}
          {authError && (
            <p className="error">{JSON.stringify(authError.message)}</p>
          )}
          {isAuthenticated && (
            <div className="accountDetails">
              <h5>Account</h5>
              <p>{user?.attributes.accounts}</p>
            </div>
          )}
        </div>
        <div className="buttonCard">
          <button
            className="loginButton"
            onClick={isAuthenticated ? logout : handleCustomLogin}
          >
            {isAuthenticated ? "Sign Out" : "Connect to web3Auth"}
          </button>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="App">
          <p style={{ marginBottom: "2em" }}>
            <span>
              <b>Balance: </b> {balance} MATIC
            </span>
          </p>
          <button
            className="loginButton"
            style={{ marginBottom: ".5em" }}
            onClick={transferMatic}
          >
            Transfer 0.001 MATIC
          </button>
          <small>
            <b>Check console for transaction status</b>
          </small>
        </div>
      ) : null}
    </div>
  );
}

export default App;
