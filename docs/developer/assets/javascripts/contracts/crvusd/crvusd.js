document.addEventListener('DOMContentLoaded', async function() {
    const web3 = new Web3('https://eth.llamarpc.com');
    const crvusdAddress = '0xf939e0a03fb07f59a73314e73794be0e57ac1b4e';
    const Multicall3Address = '0xcA11bde05977b3631167028862bE2a173976CA11';
 
    const crvusdABI = [{"name":"Approval","inputs":[{"name":"owner","type":"address","indexed":true},{"name":"spender","type":"address","indexed":true},{"name":"value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"Transfer","inputs":[{"name":"sender","type":"address","indexed":true},{"name":"receiver","type":"address","indexed":true},{"name":"value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"SetMinter","inputs":[{"name":"minter","type":"address","indexed":true}],"anonymous":false,"type":"event"},{"stateMutability":"nonpayable","type":"constructor","inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"transferFrom","inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"transfer","inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"approve","inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"permit","inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_deadline","type":"uint256"},{"name":"_v","type":"uint8"},{"name":"_r","type":"bytes32"},{"name":"_s","type":"bytes32"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"increaseAllowance","inputs":[{"name":"_spender","type":"address"},{"name":"_add_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"decreaseAllowance","inputs":[{"name":"_spender","type":"address"},{"name":"_sub_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"burnFrom","inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"burn","inputs":[{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"mint","inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"set_minter","inputs":[{"name":"_minter","type":"address"}],"outputs":[]},{"stateMutability":"view","type":"function","name":"DOMAIN_SEPARATOR","inputs":[],"outputs":[{"name":"","type":"bytes32"}]},{"stateMutability":"view","type":"function","name":"decimals","inputs":[],"outputs":[{"name":"","type":"uint8"}]},{"stateMutability":"view","type":"function","name":"version","inputs":[],"outputs":[{"name":"","type":"string"}]},{"stateMutability":"view","type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string"}]},{"stateMutability":"view","type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string"}]},{"stateMutability":"view","type":"function","name":"salt","inputs":[],"outputs":[{"name":"","type":"bytes32"}]},{"stateMutability":"view","type":"function","name":"allowance","inputs":[{"name":"arg0","type":"address"},{"name":"arg1","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"balanceOf","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"nonces","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"minter","inputs":[],"outputs":[{"name":"","type":"address"}]}];

    const Multicall3ABI = [{"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall3.Call[]","name":"calls","type":"tuple[]"}],"name":"aggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"bytes[]","name":"returnData","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bool","name":"allowFailure","type":"bool"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall3.Call3[]","name":"calls","type":"tuple[]"}],"name":"aggregate3","outputs":[{"components":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"internalType":"struct Multicall3.Result[]","name":"returnData","type":"tuple[]"}],"stateMutability":"payable","type":"function"}];
    
    const crvusdContract = new web3.eth.Contract(crvusdABI, crvusdAddress);
    const Multicall3Contract = new web3.eth.Contract(Multicall3ABI, Multicall3Address);

    async function updateValues() {
        const calls = [
            {target: crvusdAddress, allowFailure: false, callData: crvusdContract.methods.totalSupply().encodeABI()},
            {target: crvusdAddress, allowFailure: false, callData: crvusdContract.methods.minter().encodeABI()}
        ];

        const elementIds = ['totalSupplyOutput', 'minterOutput'];

        try {
            const results = await Multicall3Contract.methods.aggregate3(calls).call();

            results.forEach((result, index) => {
                const element = document.getElementById(elementIds[index]);
                if (element && result.success) {
                    let decodedResult;
                    if (index === 0) {
                        decodedResult = web3.eth.abi.decodeParameter('uint256', result.returnData);
                        element.textContent = decodedResult;
                    } else if (index === 1) {
                        decodedResult = web3.eth.abi.decodeParameter('address', result.returnData);
                        element.textContent = decodedResult;
                    }
                    element.style.color = '#4CAF50'; // Using a more specific green color
                } else if (element) {
                    element.textContent = 'Error fetching data';
                    element.style.color = '#F44336'; // Red color for errors
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Call updateValues to fetch and display data
    updateValues();

    // Generic handler for contract queries
    async function handleContractQuery(config) {
        const { inputs, outputId, method } = config;
        const outputElement = document.getElementById(outputId);
        
        async function fetchData() {
            // Check if all input elements exist
            const inputValues = inputs.map(input => {
                const element = document.getElementById(input.id);
                return element ? element.value.trim() : null;
            });
            
            if (!outputElement) {
                console.error('Output element not found');
                return;
            }
            
            if (inputValues.some(value => !value)) {
                outputElement.textContent = 'Please enter all required inputs';
                outputElement.style.color = '#F44336';
                return;
            }
            
            try {
                const result = await crvusdContract.methods[method](...inputValues).call();
                outputElement.textContent = result.toString();
                outputElement.style.color = '#4CAF50';
            } catch (error) {
                console.error(`Error fetching ${method}:`, error);
                outputElement.textContent = error.message;
                outputElement.style.color = '#F44336';
            }
        }

        // Initial fetch
        fetchData();

        // Add event listeners for all inputs
        inputs.forEach(input => {
            document.getElementById(input.id)?.addEventListener('input', fetchData);
        });
    }

    // Set up queries
    handleContractQuery({
        inputs: [{ id: 'balanceOfAddress' }],
        outputId: 'balanceOutput',
        method: 'balanceOf'
    });

    handleContractQuery({
        inputs: [
            { id: 'allowanceOwnerInput' },
            { id: 'allowanceSpenderInput' }
        ],
        outputId: 'allowanceOutput',
        method: 'allowance'
    });
});