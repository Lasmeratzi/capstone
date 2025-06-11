import React, { useState, useEffect } from "react";
import axios from "axios";
import { BoltIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wallet = () => {
  const [walletActivated, setWalletActivated] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWalletStatus();
    fetchBalance();
  }, []);

  const fetchWalletStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/wallet/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWalletActivated(response.data.activated);
    } catch (error) {
      console.error("Error fetching wallet status:", error);
    }
  };

  const fetchBalance = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/wallet/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(response.data.balance);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const activateWallet = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/wallet/activate",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setWalletActivated(true);
        fetchBalance();
        toast.success("Wallet activated successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error activating wallet:", error);
      toast.error("Failed to activate wallet", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      
      {/* Main Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {/* Balance Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Balance</h2>
              <p className="text-3xl font-semibold text-gray-900 mt-1">₱{balance.toLocaleString()}</p>
            </div>
            <button
              onClick={fetchBalance}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Refresh balance"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Wallet Status */}
        <div className="p-6 border-b border-gray-200">
          {!walletActivated ? (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Activate Your Wallet</h3>
                <p className="text-sm text-gray-500 mt-1">Enable payments and withdrawals</p>
              </div>
              <button
                onClick={activateWallet}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <BoltIcon className="h-4 w-4" />
                Activate
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <BoltIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Wallet Active</h3>
                <p className="text-sm text-gray-500">Ready for transactions</p>
              </div>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              {transactions.length}
            </span>
          </div>

          {transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800 capitalize">{tx.type}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`font-medium ${
                      tx.type === "deposit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "deposit" ? "+" : "-"}₱{tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <BoltIcon className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;