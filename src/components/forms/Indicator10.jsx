// src/components/forms/Indicator10.jsx
import React, { useState, useMemo } from "react";
import './Indicator10.css'

const Indicator10 = () => {
  const [activeAccounts, setActiveAccounts] = useState(0);
  const [inactiveAccounts, setInactiveAccounts] = useState(0);

  const totalAccounts = useMemo(() => activeAccounts + inactiveAccounts, [activeAccounts, inactiveAccounts]);

  const activePercentage = useMemo(() => {
    return totalAccounts > 0 ? ((activeAccounts / totalAccounts) * 100).toFixed(2) : 0;
  }, [activeAccounts, totalAccounts]);

  const inactivePercentage = useMemo(() => {
    return totalAccounts > 0 ? ((inactiveAccounts / totalAccounts) * 100).toFixed(2) : 0;
  }, [inactiveAccounts, totalAccounts]);

  return (
    <div className="indicator10-container">
      <h2>Indicator 10: Active Accounts Report</h2>
      <div className="form-group">
        <label>Active Accounts:</label>
        <input
          type="number"
          value={activeAccounts}
          onChange={(e) => setActiveAccounts(Number(e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>Inactive Accounts:</label>
        <input
          type="number"
          value={inactiveAccounts}
          onChange={(e) => setInactiveAccounts(Number(e.target.value))}
        />
      </div>
      <div className="results">
        <p>Total Accounts: {totalAccounts}</p>
        <p>Active Percentage: {activePercentage}%</p>
        <p>Inactive Percentage: {inactivePercentage}%</p>
      </div>
    </div>
  );
};

export default Indicator10;
