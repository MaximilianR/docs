document.addEventListener('DOMContentLoaded', async function() {
    const chainList = [
        { name: 'Ethereum', rpc: 'https://ethereum-rpc.publicnode.com/' },
        { name: 'Arbitrum', rpc: 'https://arbitrum.llamarpc.com', backupRpc: 'https://arb-pokt.nodies.app' },
        { name: 'Optimism', rpc: 'https://optimism.llamarpc.com', backupRpc: 'wss://optimism-mainnet.publicnode.com' },
        { name: 'Base', rpc: 'https://base.llamarpc.com' },
        { name: 'BinanceSmartChain', rpc: 'https://binance.llamarpc.com' },
        { name: 'Gnosis', rpc: 'https://rpc.gnosischain.com' },
        { name: 'Polygon', rpc: 'https://polygon.llamarpc.com' },
        { name: 'Fantom', rpc: 'https://rpcapi.fantom.network' },
        { name: 'Aurora', rpc: 'https://endpoints.omniatech.io/v1/aurora/mainnet/public' },
        { name: 'Celo', rpc: 'wss://forno.celo.org/ws' },
        { name: 'Mantle', rpc: 'https://rpc.mantle.xyz' },
        { name: 'Linea', rpc: 'wss://mantle-rpc.publicnode.com' },
        { name: 'PolygonZkEVM', rpc: 'https://1rpc.io/polygon/zkevm' },
        { name: 'Scroll', rpc: 'https://1rpc.io/scroll' },
        { name: 'Fraxtal', rpc: 'wss://fraxtal.drpc.org' },
        { name: 'Avalanche', rpc: 'wss://avalanche-c-chain-rpc.publicnode.com' },
        { name: 'Kava', rpc: 'wss://kava-evm-rpc.publicnode.com' },
        { name: 'X-layer', rpc: 'https://endpoints.omniatech.io/v1/xlayer/mainnet/public' },
        { name: 'zk-Sync', rpc: 'https://1rpc.io/zksync2-era' }
        // Add more chains here as needed
    ];

    const AddressProviderAddress = '0x5ffe7FB82894076ECB99A30D6A32e969e6e35E98';
    const targetIndex = 2;

    const AddressProviderABI = [{"name":"NewEntry","inputs":[{"name":"id","type":"uint256","indexed":true},{"name":"addr","type":"address","indexed":false},{"name":"description","type":"string","indexed":false}],"anonymous":false,"type":"event"},{"name":"EntryModified","inputs":[{"name":"id","type":"uint256","indexed":true},{"name":"version","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"EntryRemoved","inputs":[{"name":"id","type":"uint256","indexed":true}],"anonymous":false,"type":"event"},{"name":"CommitNewAdmin","inputs":[{"name":"admin","type":"address","indexed":true}],"anonymous":false,"type":"event"},{"name":"NewAdmin","inputs":[{"name":"admin","type":"address","indexed":true}],"anonymous":false,"type":"event"},{"stateMutability":"nonpayable","type":"constructor","inputs":[],"outputs":[]},{"stateMutability":"view","type":"function","name":"ids","inputs":[],"outputs":[{"name":"","type":"uint256[]"}]},{"stateMutability":"view","type":"function","name":"get_address","inputs":[{"name":"_id","type":"uint256"}],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"nonpayable","type":"function","name":"add_new_id","inputs":[{"name":"_id","type":"uint256"},{"name":"_address","type":"address"},{"name":"_description","type":"string"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"add_new_ids","inputs":[{"name":"_ids","type":"uint256[]"},{"name":"_addresses","type":"address[]"},{"name":"_descriptions","type":"string[]"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"update_id","inputs":[{"name":"_id","type":"uint256"},{"name":"_new_address","type":"address"},{"name":"_new_description","type":"string"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"update_address","inputs":[{"name":"_id","type":"uint256"},{"name":"_address","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"update_description","inputs":[{"name":"_id","type":"uint256"},{"name":"_description","type":"string"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"remove_id","inputs":[{"name":"_id","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"remove_ids","inputs":[{"name":"_ids","type":"uint256[]"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"commit_transfer_ownership","inputs":[{"name":"_new_admin","type":"address"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"apply_transfer_ownership","inputs":[],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"revert_transfer_ownership","inputs":[],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"view","type":"function","name":"admin","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"future_admin","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"num_entries","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"check_id_exists","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"view","type":"function","name":"get_id_info","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"tuple","components":[{"name":"addr","type":"address"},{"name":"description","type":"string"},{"name":"version","type":"uint256"},{"name":"last_modified","type":"uint256"}]}]}];

    async function fetchAddressForChain(chain, id = targetIndex) {
        const addressProviderAddress = chain.name === 'zk-Sync' 
            ? '0x960C90aE833af0fd699dBc2503468A07cC28FA4F' 
            : AddressProviderAddress;

        const primaryRpc = chain.rpc;
        const backupRpc = chain.backupRpc;

        async function fetchWithRpc(rpc) {
            const web3 = new Web3(rpc);
            const AddressProviderContract = new web3.eth.Contract(AddressProviderABI, addressProviderAddress);

            try {
                const ids = await AddressProviderContract.methods.ids().call();
                if (ids.includes(id.toString())) { // Ensure ID is checked as a string
                    const address = await AddressProviderContract.methods.get_address(id).call();
                    return { chain, address };
                } else {
                    return { chain, error: `ID ${id} not found` };
                }
            } catch (error) {
                console.error(`Error fetching data for ${chain.name} using RPC ${rpc}:`, error);
                return { chain, error: error.message }; // Return the actual error message
            }
        }

        // Try primary RPC first, then backup if necessary
        let result = await fetchWithRpc(primaryRpc);
        if (!result && backupRpc) {
            result = await fetchWithRpc(backupRpc);
        }

        return result || { chain, error: 'Error fetching data from RPCs.' };
    }

    async function updateValues() {
        // Fetch and update the ExchangeRouter addresses (get_address(2))
        const exchangeRouterResults = await Promise.all(chainList.map(chain => fetchAddressForChain(chain, 2)));

        const exchangeRouterTableBody = document.getElementById('exchangeRouterTableBody');
        exchangeRouterTableBody.innerHTML = '';

        exchangeRouterResults.forEach(result => {
            const row = exchangeRouterTableBody.insertRow();
            const chainCell = row.insertCell(0);
            const addressCell = row.insertCell(1);
            
            chainCell.textContent = result.chain.name;
            if (result.error) {
                addressCell.textContent = result.error;
                addressCell.style.color = 'red';
            } else {
                const link = document.createElement('a');
                link.href = getExplorerLink(result.chain.name, result.address);
                link.textContent = result.address;
                link.target = '_blank'; // Open link in a new tab
                addressCell.appendChild(link);
            }
        });

        // Fetch and update the CRV token addresses
        const crvResults = await Promise.all(chainList.map(chain => fetchAddressForChain(chain, 19)));

        const crvTableBody = document.getElementById('crvTableBody');
        crvTableBody.innerHTML = '';

        crvResults.forEach(result => {
            const row = crvTableBody.insertRow();
            const chainCell = row.insertCell(0);
            const addressCell = row.insertCell(1);
            
            chainCell.textContent = result.chain.name;
            if (result.error) {
                addressCell.textContent = result.error;
                addressCell.style.color = 'red';
            } else {
                const link = document.createElement('a');
                link.href = getExplorerLink(result.chain.name, result.address);
                link.textContent = result.address;
                link.target = '_blank'; // Open link in a new tab
                addressCell.appendChild(link);
            }
        });

        // Fetch and update the StableswapFactory addresses
        const stableswapFactoryResults = await Promise.all(chainList.map(chain => fetchAddressForChain(chain, 12)));

        const stableswapFactoryTableBody = document.getElementById('stableswapFactoryTableBody');
        stableswapFactoryTableBody.innerHTML = '';

        stableswapFactoryResults.forEach(result => {
            const row = stableswapFactoryTableBody.insertRow();
            const chainCell = row.insertCell(0);
            const addressCell = row.insertCell(1);
            
            chainCell.textContent = result.chain.name;
            if (result.error) {
                addressCell.textContent = result.error;
                addressCell.style.color = 'red';
            } else {
                const link = document.createElement('a');
                link.href = getExplorerLink(result.chain.name, result.address);
                link.textContent = result.address;
                link.target = '_blank'; // Open link in a new tab
                addressCell.appendChild(link);
            }
        });
    }

    function getExplorerLink(chainName, address) {
        switch (chainName) {
            case 'Ethereum':
                return `https://etherscan.io/address/${address}`;
            case 'Arbitrum':
                return `https://arbiscan.io/address/${address}`;
            case 'Optimism':
                return `https://optimistic.etherscan.io/address/${address}`;
            case 'Base':
                return `https://basescan.org/address/${address}`;
            case 'BinanceSmartChain':
                return `https://bscscan.com/address/${address}`;
            case 'Polygon':
                return `https://polygonscan.com/address/${address}`;
            case 'Fantom':
                return `https://ftmscan.com/address/${address}`;
            case 'Gnosis':
                return `https://gnosisscan.io/address/${address}`;
            case 'Aurora':
                return `https://aurorascan.dev/address/${address}`;
            case 'Celo':
                return `https://explorer.celo.org/address/${address}`;
            case 'Mantle':
                return `https://explorer.mantle.xyz/address/${address}`;
            case 'Linea':
                return `https://lineascan.build/address/${address}`;
            case 'PolygonZkEVM':
                return `https://zkevm.polygonscan.com/address/${address}`;
            case 'Scroll':
                return `https://scrollscan.com/address/${address}`;
            case 'Fraxtal':
                return `https://fraxscan.com/address/${address}`;
            case 'Avalanche':
                return `https://snowscan.xyz/address/${address}`;
            case 'Kava':
                return `https://explorer.kava.io/address/${address}`;
            case 'X-layer':
                return `https://www.oklink.com/xlayer/address/${address}`;
            case 'zk-Sync':
                return `https://explorer.zksync.io/address/${address}`;
            // Add more cases for other chains as needed
            default:
                return '#'; // Fallback if no explorer is available
        }
    }

    // Call updateValues to fetch and display data
    updateValues();
});
