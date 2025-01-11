import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  // const [error, setError] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/transactions/all",
          {
            headers: { Authorization: token },
          }
        );
        // Format dates
        const transactionsWithFormattedDate = res.data.map((txn) => ({
          ...txn,
          date: txn.date.split("T")[0],
        }));
        setTransactions(transactionsWithFormattedDate);

        // Calculate initial total balance
        calculateBalance(transactionsWithFormattedDate);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  const calculateBalance = (transactions) => {
    const balance = transactions.reduce((acc, txn) => {
      return txn.category === "Income"
        ? acc + parseFloat(txn.amount)
        : acc - parseFloat(txn.amount);
    }, 0);
    setTotalBalance(balance);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/transactions/add",
        formData,
        { headers: { Authorization: token } }
      );
      const newTransaction = { ...res.data, date: res.data.date.split("T")[0] };

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);

      // Recalculate balance after adding a transaction
      calculateBalance(updatedTransactions);

      setFormData({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <h2>Expense Tracker</h2>
        <div className="dashboard-balance">
          <h3>Your Balance</h3>
          <h3>${totalBalance.toFixed(2)}</h3>
        </div>
        <div className="income-expense">
          <div className="income">
            <h4>Income</h4>
            <p>
              $
              {transactions
                .filter((txn) => txn.category === "Income")
                .reduce((acc, txn) => acc + parseFloat(txn.amount), 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="expense">
            <h4>Expense</h4>
            <p>
              $
              {transactions
                .filter((txn) => txn.category === "Expense")
                .reduce((acc, txn) => acc + parseFloat(txn.amount), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
        <form className="transaction-form" onSubmit={handleSubmit}>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Transaction</button>
        </form>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <h2>Transaction History</h2>
        <ul className="transaction-list">
          {transactions.map((txn) => (
            <li
              key={txn._id}
              className={`transaction-item ${
                txn.category === "Income" ? "income" : "expense"
              }`}
            >
              <span>{txn.date}</span>
              <span className="description">{txn.description}</span>
              <span>${txn.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

