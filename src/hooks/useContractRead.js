// src/hooks/useContractRead.js

import { useState, useEffect }_from_ 'react';
import { ethers } from 'ethers';

const RPC_URL = 'https://eth.llamarpc.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

/**
 * A generic hook to read data from any smart contract.
 * @param {string} address The contract address.
 * @param {Array} abi The contract ABI.
 * @param {string} functionName The name of the function to call.
 * @param {Array} args Optional arguments to pass to the function.
 * @returns {{data: any, loading: boolean, error: string|null}}
 */
export const useContractRead = ({ address, abi, functionName, args = [] }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!address || !abi || !functionName) {
        setError("Missing contract address, ABI, or function name.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const contract = new ethers.Contract(address, abi, provider);
        const result = await contract[functionName](...args);
        setData(result);
      } catch (err) {
        console.error(`Error calling ${functionName}:`, err);
        setError(`Could not fetch data from ${functionName}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Dependency array ensures the hook re-runs if any of these change.
  }, [address, functionName, JSON.stringify(abi), JSON.stringify(args)]);

  return { data, loading, error };
};