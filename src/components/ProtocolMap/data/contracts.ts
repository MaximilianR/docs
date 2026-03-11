export const RPC_URL = 'https://ethereum-rpc.publicnode.com/'
export const MULTICALL3 = '0xcA11bde05977b3631167028862bE2a173976CA11' as const

export const addresses = {
  crv: '0xD533a97B49629800559223b95449FD8E1E04e162',
  crvusd: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
  vecrv: '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2',
  scrvusd: '0x0655977FEb2f289A4aB78af67BAB0d17aAb84367',
  gaugeController: '0x2F50D538606Fa9Edd2B11E2446BEb18C9D5846bB',
  minter: '0xd061D61a4d941c39E5453435B6345Dc261C2fcE0',
  feeCollector: '0xa2Bcd1a4Efbd04B63cd03f5aFf2561106ebCCE00',
  feeSplitter: '0x2dFd89449faff8a532790667baB21cF733C064f2',
  cowSwapBurner: '0x6B5dB12435C1e81B3a0B3EEf138ea48D26F1Be60',
  feeDistributor: '0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc',
  rewardsHandler: '0xE8d1E2531761406Af1615A6764B0d5fF52736F56',
  daoOwnership: '0xE478de485ad2fe566d49342Cbd03E49ed7DB3356',
  daoParameter: '0xBCfF8B0b9419b9A88c44546519b1e909cF330399',
  treasury: '0x6508ef65b0bd57eabd0f1d52685a70433b2d290b',
  emergencyDao: '0x467947EE34aF926cF1DCac093870f613C96B1E0c',
  router: '0xF0d4c12A5768D806021F80a262B4d39d26C58b8D',
  stableswapFactory: '0x6A8cbed756804B16E05E741eDaBd5cB544AE21bf',
  cryptoswapFactory: '0x0c0e5f2fF0ff18a3be9b835635039256dC4B4963',
  tricryptoFactory: '0x0c0e5f2fF0ff18a3be9b835635039256dC4B4963',
  twocryptoFactory: '0x98EE851a00abeE0d95D08cF4CA2BdCE32aeaAF7F',
  crvusdController: '0xA920De414eA4Ab66b97dA1bFE9e6EcA7d4219635',
  monetaryPolicy: '0xc684432FD6322c6D58b6bC5d28B18569aA0AD0A1',
  priceAggregator: '0xe5Afcf332a5457E8FafCD668BcE3dF953762Dfe7',
  llamalendFactory: '0xeA6876DDE9e3467564acBeE1Ed5bac88783205E0',
} as const

export type ContractKey = keyof typeof addresses

// Minimal ABIs for live data reads
export const abis = {
  erc20Supply: [{ name: 'totalSupply', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' }],
  erc20Decimals: [{ name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view', type: 'function' }],
  veBalance: [{ name: 'totalSupply', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' }],
  gaugeControllerNGauges: [{ name: 'n_gauges', inputs: [], outputs: [{ type: 'int128' }], stateMutability: 'view', type: 'function' }],
  minterRate: [{ name: 'rate', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' }],
  scrvusdAssets: [{ name: 'totalAssets', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' }],
  rewardsHandlerRate: [{ name: 'distribution_time', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' }],
  factoryPoolCount: [{ name: 'pool_count', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' }],
  crvusdTotalDebt: [{ name: 'total_debt', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' }],
  monetaryPolicyRate: [{ name: 'rate', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' }],
} as const
