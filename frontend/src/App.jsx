import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const App = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [transactions, setTransactions] = useState([]);
  
  const url = "http://localhost:3000"
  useEffect(() => {
    axios.get(url + "/api/transactions")
      .then((res) => {
        // Assuming the API returns transactions sorted by date (newest first)
        const sortedTransactions = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sortedTransactions);
      })
      .catch((err) => console.error(err));
  }, []);

  const addNewTransaction = (e) => {
    e.preventDefault();

    axios.post(url + "/api/transactions", { amount, date, desc })
      .then((res) => {
        const newTransaction = res.data;
        setTransactions((prevTransactions) => [
          ...prevTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)),
          newTransaction,
        ]);
        setAmount("");
        setDesc("");
        setDate("");
      })
      .catch((err) => console.error(err.message));
  };

  const deleteTransaction = (id) => {
    
    axios.delete(url + `/api/transactions/${id}`)
      .then(() => {
        setTransactions(prevTransactions => 
          prevTransactions.filter(transaction => transaction._id !== id)
        );
      })
      .catch((err) => {
        console.error("Error deleting transaction:", err);
      });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  let balance = 0;
  
  transactions.forEach((transaction) => {
    balance += parseInt(transaction.amount);
  })

  return (
    <div className="w-full min-h-screen  bg-zinc-800 text-white p-10">
      <div className="max-w-screen-2xl mx-auto flex flex-col items-center">
        <h1 className="font-['Bebas_Neue'] text-[30px] font-semibold tracking-wider text-zinc-200 md:text-[40px]">
          Expense Tracker
        </h1>
        <div className="mt-10 p-10 border rounded flex flex-col justify-center items-center">
          <h1 className="text-5xl font-medium ">
            {balance}.<span className="text-2xl font-normal">00</span>
          </h1>
          <form className="mt-10" onSubmit={addNewTransaction}>
            <div className="flex flex-col gap-3 md:flex-row md:gap-2">
              <input
                type="text"
                className="w-[280px] px-3 py-1 bg-zinc-700 text-white rounded outline-none"
                placeholder="(+,-)amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <input
                type="datetime-local"
                className="w-[280px] px-3 py-1 bg-zinc-700 text-white rounded outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="mt-3">
              <input
                type="text"
                className="w-full px-3 py-1 bg-zinc-700 text-white rounded outline-none"
                placeholder="description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>
            <button
              className="mt-3 w-full px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded outline-none"
              type="submit"
            >
              Add Transaction
            </button>
          </form>

          <div className="transactions w-full mt-6">
            {transactions.length > 0 &&
              transactions.map((transaction, index) => {
                return (
                  <div key={index} className="transaction p-2 border-t-2 bg-zinc-900">
                    <div className="w-full flex justify-between">
                      <div>
                      <h3 className="text-lg">{transaction.desc}</h3>
                      <button className="text-red-500" onClick={() => deleteTransaction(transaction._id)}>delete</button>
                      </div>
                      <div className="flex flex-col items-end">
                        
                        <h3 className={`text-lg ${parseInt(transaction.amount) > 0 ? 'text-green-500' : 'text-red-500'}`}>{transaction.amount}</h3>
                        <h4 className="text-xs">{formatDate(transaction.date)}</h4>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
