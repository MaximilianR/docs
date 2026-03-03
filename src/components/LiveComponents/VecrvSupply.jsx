// src/components/VecrvSupply.jsx

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
// Change 1: Import the new formatter function
import { formatNumber } from '../../utils/formatters';

import CrvLogo from '@site/static/img/logos/crv.png';
import VecrvLogo from '@site/static/img/logos/vecrv.png';


// --- Configuration for this specific component ---
const CRV_CONTRACT_ADDRESS = '0xD533a949740bb3306d119CC777fa900bA034cd52';
const VECRV_CONTRACT_ADDRESS = '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2';
const CRV_ABI = [{"name":"Transfer","inputs":[{"type":"address","name":"_from","indexed":true},{"type":"address","name":"_to","indexed":true},{"type":"uint256","name":"_value","indexed":false}],"anonymous":false,"type":"event"},{"name":"Approval","inputs":[{"type":"address","name":"_owner","indexed":true},{"type":"address","name":"_spender","indexed":true},{"type":"uint256","name":"_value","indexed":false}],"anonymous":false,"type":"event"},{"name":"UpdateMiningParameters","inputs":[{"type":"uint256","name":"time","indexed":false},{"type":"uint256","name":"rate","indexed":false},{"type":"uint256","name":"supply","indexed":false}],"anonymous":false,"type":"event"},{"name":"SetMinter","inputs":[{"type":"address","name":"minter","indexed":false}],"anonymous":false,"type":"event"},{"name":"SetAdmin","inputs":[{"type":"address","name":"admin","indexed":false}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[{"type":"string","name":"_name"},{"type":"string","name":"_symbol"},{"type":"uint256","name":"_decimals"}],"stateMutability":"nonpayable","type":"constructor"},{"name":"update_mining_parameters","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":148748},{"name":"start_epoch_time_write","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":149603},{"name":"future_epoch_time_write","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":149806},{"name":"available_supply","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":4018},{"name":"mintable_in_timeframe","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"uint256","name":"start"},{"type":"uint256","name":"end"}],"stateMutability":"view","type":"function","gas":2216141},{"name":"set_minter","outputs":[],"inputs":[{"type":"address","name":"_minter"}],"stateMutability":"nonpayable","type":"function","gas":38698},{"name":"set_admin","outputs":[],"inputs":[{"type":"address","name":"_admin"}],"stateMutability":"nonpayable","type":"function","gas":37837},{"name":"totalSupply","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1421},{"name":"allowance","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"_owner"},{"type":"address","name":"_spender"}],"stateMutability":"view","type":"function","gas":1759},{"name":"transfer","outputs":[{"type":"bool","name":""}],"inputs":[{"type":"address","name":"_to"},{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":75139},{"name":"transferFrom","outputs":[{"type":"bool","name":""}],"inputs":[{"type":"address","name":"_from"},{"type":"address","name":"_to"},{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":111433},{"name":"approve","outputs":[{"type":"bool","name":""}],"inputs":[{"type":"address","name":"_spender"},{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":39288},{"name":"mint","outputs":[{"type":"bool","name":""}],"inputs":[{"type":"address","name":"_to"},{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":228030},{"name":"burn","outputs":[{"type":"bool","name":""}],"inputs":[{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":74999},{"name":"set_name","outputs":[],"inputs":[{"type":"string","name":"_name"},{"type":"string","name":"_symbol"}],"stateMutability":"nonpayable","type":"function","gas":178270},{"name":"name","outputs":[{"type":"string","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":8063},{"name":"symbol","outputs":[{"type":"string","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":7116},{"name":"decimals","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1721},{"name":"balanceOf","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"arg0"}],"stateMutability":"view","type":"function","gas":1905},{"name":"minter","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1781},{"name":"admin","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1811},{"name":"mining_epoch","outputs":[{"type":"int128","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1841},{"name":"start_epoch_time","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1871},{"name":"rate","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1901}];
const VECRV_ABI = [{"name":"CommitOwnership","inputs":[{"type":"address","name":"admin","indexed":false}],"anonymous":false,"type":"event"},{"name":"ApplyOwnership","inputs":[{"type":"address","name":"admin","indexed":false}],"anonymous":false,"type":"event"},{"name":"Deposit","inputs":[{"type":"address","name":"provider","indexed":true},{"type":"uint256","name":"value","indexed":false},{"type":"uint256","name":"locktime","indexed":true},{"type":"int128","name":"type","indexed":false},{"type":"uint256","name":"ts","indexed":false}],"anonymous":false,"type":"event"},{"name":"Withdraw","inputs":[{"type":"address","name":"provider","indexed":true},{"type":"uint256","name":"value","indexed":false},{"type":"uint256","name":"ts","indexed":false}],"anonymous":false,"type":"event"},{"name":"Supply","inputs":[{"type":"uint256","name":"prevSupply","indexed":false},{"type":"uint256","name":"supply","indexed":false}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[{"type":"address","name":"token_addr"},{"type":"string","name":"_name"},{"type":"string","name":"_symbol"},{"type":"string","name":"_version"}],"stateMutability":"nonpayable","type":"constructor"},{"name":"commit_transfer_ownership","outputs":[],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"nonpayable","type":"function","gas":37597},{"name":"apply_transfer_ownership","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":38497},{"name":"commit_smart_wallet_checker","outputs":[],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"nonpayable","type":"function","gas":36307},{"name":"apply_smart_wallet_checker","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":37095},{"name":"get_last_user_slope","outputs":[{"type":"int128","name":""}],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"view","type":"function","gas":2569},{"name":"user_point_history__ts","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"_addr"},{"type":"uint256","name":"_idx"}],"stateMutability":"view","type":"function","gas":1672},{"name":"locked__end","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"_addr"}],"stateMutability":"view","type":"function","gas":1593},{"name":"checkpoint","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":37052342},{"name":"deposit_for","outputs":[],"inputs":[{"type":"address","name":"_addr"},{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":74279891},{"name":"create_lock","outputs":[],"inputs":[{"type":"uint256","name":"_value"},{"type":"uint256","name":"_unlock_time"}],"stateMutability":"nonpayable","type":"function","gas":74281465},{"name":"increase_amount","outputs":[],"inputs":[{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function","gas":74280830},{"name":"increase_unlock_time","outputs":[],"inputs":[{"type":"uint256","name":"_unlock_time"}],"stateMutability":"nonpayable","type":"function","gas":74281578},{"name":"withdraw","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function","gas":37223566},{"name":"balanceOf","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"view","type":"function"},{"name":"balanceOf","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"},{"type":"uint256","name":"_t"}],"stateMutability":"view","type":"function"},{"name":"balanceOfAt","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"},{"type":"uint256","name":"_block"}],"stateMutability":"view","type":"function","gas":514333},{"name":"totalSupply","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"totalSupply","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"uint256","name":"t"}],"stateMutability":"view","type":"function"},{"name":"totalSupplyAt","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"uint256","name":"_block"}],"stateMutability":"view","type":"function","gas":812560},{"name":"changeController","outputs":[],"inputs":[{"type":"address","name":"_newController"}],"stateMutability":"nonpayable","type":"function","gas":36907},{"name":"token","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1841},{"name":"supply","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1871},{"name":"locked","outputs":[{"type":"int128","name":"amount"},{"type":"uint256","name":"end"}],"inputs":[{"type":"address","name":"arg0"}],"stateMutability":"view","type":"function","gas":3359},{"name":"epoch","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":1931},{"name":"point_history","outputs":[{"type":"int128","name":"bias"},{"type":"int128","name":"slope"},{"type":"uint256","name":"ts"},{"type":"uint256","name":"blk"}],"inputs":[{"type":"uint256","name":"arg0"}],"stateMutability":"view","type":"function","gas":5550},{"name":"user_point_history","outputs":[{"type":"int128","name":"bias"},{"type":"int128","name":"slope"},{"type":"uint256","name":"ts"},{"type":"uint256","name":"blk"}],"inputs":[{"type":"address","name":"arg0"},{"type":"uint256","name":"arg1"}],"stateMutability":"view","type":"function","gas":6079},{"name":"user_point_epoch","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"arg0"}],"stateMutability":"view","type":"function","gas":2175},{"name":"slope_changes","outputs":[{"type":"int128","name":""}],"inputs":[{"type":"uint256","name":"arg0"}],"stateMutability":"view","type":"function","gas":2166},{"name":"controller","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":2081},{"name":"transfersEnabled","outputs":[{"type":"bool","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":2111},{"name":"name","outputs":[{"type":"string","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":8543},{"name":"symbol","outputs":[{"type":"string","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":7596},{"name":"version","outputs":[{"type":"string","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":7626},{"name":"decimals","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":2231},{"name":"future_smart_wallet_checker","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":2261},{"name":"smart_wallet_checker","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":2291},{"name":"admin","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":2321},{"name":"future_admin","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function","gas":2351}];
const RPC_URL = 'https://eth.llamarpc.com';

const VecrvSupply = () => {
  const [supplyData, setSupplyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const crvContract = new ethers.Contract(CRV_CONTRACT_ADDRESS, CRV_ABI, provider);
        const vecrvContract = new ethers.Contract(VECRV_CONTRACT_ADDRESS, VECRV_ABI, provider);

        const [crvTotalSupply, lockedCrv, vecrvTotalSupply] = await Promise.all([
          crvContract.totalSupply(),
          crvContract.balanceOf(VECRV_CONTRACT_ADDRESS),
          vecrvContract.totalSupply(),
        ]);

        const crvSupply = Number(crvTotalSupply) / 1e18; // Current Total Supply
        const vecrvSupply = Number(vecrvTotalSupply) / 1e18; // Total VECRV Supply
        const lockedCrvSupply = Number(lockedCrv) / 1e18; // Locked CRV in VECRV
        const avgLockTime = vecrvSupply / lockedCrvSupply * 4;
        const percentLocked = lockedCrvSupply / crvSupply * 100;
        const lastUpdated = new Date();

        setSupplyData({ crvSupply, vecrvSupply, lockedCrvSupply, avgLockTime, percentLocked, lastUpdated });

      } catch (err) {
        console.error("Failed to fetch CRV data:", err);
        setError("Could not retrieve data.  Sometimes an Adblocker is blocking the RPC call.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculate();
  }, []);

  if (loading) return <div>Loading veCRV Data...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
    <table className="metric-table" > 
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><img src={CrvLogo} className="subheading-inline-logo" alt="CRV" /> CRV Current Total</td>
          <td>{formatNumber(supplyData?.crvSupply, 4)}</td>
        </tr>
        <tr>
          <td><img src={CrvLogo} className="subheading-inline-logo" alt="CRV" /> CRV Locked</td>
          <td>{formatNumber(supplyData?.lockedCrvSupply, 3)} <span style={{ color: 'var(--ifm-color-emphasis-600)', fontWeight: 'normal'}}>
  ({supplyData?.percentLocked.toPrecision(3)}%)
</span></td>
        </tr>
        <tr>
          <td><img src={CrvLogo} className="subheading-inline-logo" alt="CRV" /> Average Lock Time</td>
          <td>{supplyData?.avgLockTime.toPrecision(3) + " Years"}</td>
        </tr>
        <tr>
          <td><img src={VecrvLogo} className="subheading-inline-logo" alt="veCRV" /> veCRV Total</td>
          <td>{formatNumber(supplyData?.vecrvSupply, 3)}</td>
        </tr>
      </tbody>
    </table>
    <div style={{ 
      fontSize: '0.8rem', 
      color: 'var(--ifm-color-emphasis-600)',
      fontStyle: 'italic',
      textAlign: 'center',
      marginBottom: '1.5rem'
    }}>
      Last updated: {supplyData?.lastUpdated?.toLocaleString()}
    </div>
    </div>
  );
};

export default VecrvSupply;