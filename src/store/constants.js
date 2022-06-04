export const ABIS = {
  ROUTER: [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns(uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',

    'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline ) external returns (uint amountA, uint amountB, uint liquidity)',
    'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline ) external payable returns (uint amountToken, uint amountETH, uint liquidity)',
    'function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline ) external returns (uint amountA, uint amountB)',
    'function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline ) external returns (uint amountToken, uint amountETH)',

    'function factory() external pure returns (address)',
  ],
  FACTORY: [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)',
    'function createPair(address tokenA, address tokenB) external returns (address pair)',
    'function INIT_CODE_PAIR_HASH() external view returns (bytes32)',
  ],
  CHAINLINK: [
    'function latestAnswer() external view returns (uint256)',
  ],
  PAIR: [
    'function transfer(address to, uint value) external returns (bool)',
    'function balanceOf(address account) external pure returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint)',
    'function totalSupply() external view returns (uint256)',
    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    'function token0() external view returns (address)',
    {
      "constant": true,
      "inputs": [],
      "name": "token1",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    'function owner() external view returns (address)',
  ],
  ERC20: [
    'function owner() external view returns (address)',
    'function transfer(address to, uint value) external returns (bool)',
    'function balanceOf(address account) external pure returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint)',
  ],
  WETH: [
    'function deposit() external payable',
    'function transfer(address to, uint value) external returns (bool)',
    'function balanceOf(address account) external pure returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint)',
  ],

  FRUIT: [
    'function owner() external view returns (address)',
    'function transferOwnership(address newOwner) external',
    'function transfer(address to, uint value) external returns (bool)',
    'function balanceOf(address account) external pure returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint)',
  ],
  SEED: [
    'function owner() external view returns (address)',
    'function transferOwnership(address newOwner) external',
    'function transfer(address to, uint value) external returns (bool)',
    'function balanceOf(address account) external pure returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint)',
  ],
  MASTERCHEF: [
    'function add(uint256 _allocPoint, address _lpToken, bool _withUpdate) external',
    'function poolLength() external view returns (uint256)',
    'function deposit(uint256 _pid, uint256 _amount) external',
    'function withdraw(uint256 _pid, uint256 _amount) external',
    'function pendingCash(uint256 _pid, address _user) external view returns (uint256)',
    'function updatePool(uint256 _pid) external',
    'function cash() external view returns (address)',
    'function cashPerBlock() external view returns (uint256)',
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "rewardDebt",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "poolInfo",
      "outputs": [
        {
          "internalType": "contract IBEP20",
          "name": "lpToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allocPoint",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lastRewardBlock",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "accCashPerShare",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
  ],
  SOUSCHEF: [
    'function add(uint256 _allocPoint, address _lpToken, bool _withUpdate) external',
  ],
};

// https://docs.chain.link/docs/matic-addresses/


export const bscNetwork = {
  RPC_URL: 'https://bsc-dataseed1.binance.org',
  ROUTER_ADDRESS: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  FACTORY_ADDRESS: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  WETH_ADDRESS: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',

  FRUIT_ADDRESS: '0x40e11f5e8027080a222eb8955f44aaef07e828d8',
  SEED_ADDRESS: '0xcdd59cec22452646415d4caad9186aa0965739ef',
  MASTERCHEF_ADDRESS: '0x7441c3ecf133d78b14ef27cb9e02b18c0af6a919',
  SOUSCHEF_ADDRESS: '0x0b7c14ae85267db38929af0d4d27e0aa3ede2722',

  BASE_TOKEN: 'BNB',
  BASE_USD_ID: 'USD (B)',
  BASE_USD_ADDRESS: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  TOKEN_LIST: [
    {
      id: 'BNB',
      address: "0x6cDa39BBA0efeF103b9EE20B19b7418f53374779",
      chainlink_address: "0x6cDa39BBA0efeF103b9EE20B19b7418f53374779",
      image:
        './res/1839.png',
      price: 1,
    },
    {
      id: 'USD (B)',
      address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      chainlink_address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      image:
        './res/999999.png',
      price: 0,
    },

    {
      id: 'FRUIT',
      address: "0x40e11f5e8027080a222eb8955f44aaef07e828d8",
      chainlink_address: "0x40e11f5e8027080a222eb8955f44aaef07e828d8",
      image:
        './res/995996.jpg',
      price: 0,
    },

    {
      id: 'USD (DAI)',
      address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      chainlink_address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      image:
        './res/4943.png',
      price: 0,
    },
    {
      id: 'BTC',
      address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
      chainlink_address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
      image:
        './res/1.png',
      price: 0,
    },
    {
      id: 'ETH',
      address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      chainlink_address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
      image:
        './res/1027.png',
      price: 0,
    },
    {
      id: 'FTM',
      address: "0xAD29AbB318791D579433D831ed122aFeAf29dcfe",
      chainlink_address: "0xAD29AbB318791D579433D831ed122aFeAf29dcfe",
      image:
        './res/3513.png',
      price: 0,
    },
  ],
};

export const maticNetwork = {
  RPC_URL: 'https://bsc-dataseed1.binance.org',
  ROUTER_ADDRESS: '0x0069E50350FABf3A207AefBDd10537F8d03B631a',
  FACTORY_ADDRESS: '0x51aEaC52520A583151325D27D66E9295e8CCb810',
  WETH_ADDRESS: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',

  FRUIT_ADDRESS: '0x40e11f5e8027080a222eb8955f44aaef07e828d8',
  SEED_ADDRESS: '0xcdd59cec22452646415d4caad9186aa0965739ef',
  MASTERCHEF_ADDRESS: '0x7441c3ecf133d78b14ef27cb9e02b18c0af6a919',
  SOUSCHEF_ADDRESS: '0x0b7c14ae85267db38929af0d4d27e0aa3ede2722',

  BASE_TOKEN: 'MATIC',
  BASE_USD_ID: 'USD (DAI)',
  BASE_USD_ADDRESS: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  TOKEN_LIST: [
    {
      id: 'MATIC',
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      chainlink_address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      image:
        './res/3890.png',
      price: 1,
    },
    {
      id: 'USD (DAI)',
      address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      chainlink_address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      image:
        './res/4943.png',
      price: 0,
    },

    {
      id: 'FRUIT',
      address: "0x40e11f5e8027080a222eb8955f44aaef07e828d8",
      chainlink_address: "0x40e11f5e8027080a222eb8955f44aaef07e828d8",
      image:
        './res/995996.jpg',
      price: 0,
    },

    {
      id: 'BTC',
      address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      chainlink_address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      image:
        './res/1.png',
      price: 0,
    },
    {
      id: 'ETH',
      address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      chainlink_address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      image:
        './res/1027.png',
      price: 0,
    },
  ],
};
export const maticNetworkNew = {
  RPC_URL: 'https://bsc-dataseed1.binance.org',

  FACTORY_ADDRESS: '0xc839E118d37CFEF20fc6f439F50ee3B3a7656F6f',
  BANK_ADDRESS: '0xc839E118d37CFEF20fc6f439F50ee3B3a7656F6f',

  ROUTER_ADDRESS: '0xe33a3c49577171e469cf823ee8b19295664fad5c',
  CONTROLLER_ADDRESS: '0xe33a3c49577171e469cf823ee8b19295664fad5c',


  BASE_TOKEN: 'MATIC',
  WETH_ADDRESS: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  BASE_TOKEN_ADDRESS: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',

  BASE_USD_ID: 'USD (DAI)',
  BASE_USD_ADDRESS: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',


  FRUIT_ADDRESS: '0x7BFA6B8f09AED170Bff62Faf6680B7F16c9B9829',
  CASH_ADDRESS: '0x7BFA6B8f09AED170Bff62Faf6680B7F16c9B9829',

  SEED_ADDRESS: '0x51eC0B0b84Fa437023922d6e5EfCEb8056cd9716',
  BOND_ADDRESS: '0x51eC0B0b84Fa437023922d6e5EfCEb8056cd9716',

  MASTERCHEF_ADDRESS: '0x710A73107d68bCdfA5511Ce7C8978B4AA866F8DB',
  PRINTER_ADDRESS: '0x710A73107d68bCdfA5511Ce7C8978B4AA866F8DB',

  SOUSCHEF_ADDRESS: '0xaF44DFE0130f175148Ee0D7D722aA4f06F6D2203',
  RESERVE_ADDRESS: '0xaF44DFE0130f175148Ee0D7D722aA4f06F6D2203',

  TOKEN_LIST: [
    {
      id: 'MATIC',
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      chainlink_address: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
      image:
        './res/3890.png',
      price: 1,
    },
    {
      id: 'USD (DAI)',
      address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      chainlink_address: "0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D",
      image:
        './res/4943.png',
      price: 0,
    },

    {
      id: 'CASH',
      address: "0x7BFA6B8f09AED170Bff62Faf6680B7F16c9B9829",
      chainlink_address: "0x7BFA6B8f09AED170Bff62Faf6680B7F16c9B9829",
      image:
        './res/995996.jpg',
      price: 0,
    },

    {
      id: 'BTC',
      address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      chainlink_address: "0xc907E116054Ad103354f2D350FD2514433D57F6f",
      image:
        './res/1.png',
      price: 0,
    },
    {
      id: 'ETH',
      address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      chainlink_address: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
      image:
        './res/1027.png',
      price: 0,
    },
  ],
};

// init hash code - 0x8415a681423c31e5a24dcd0ee281f8837ccc5f7848784fe79002602bb75365de
export const ftmNetwork = {
  RPC_URL: 'https://rpcapi.fantom.network/',
  ROUTER_ADDRESS: '0x686ae4038f98153D83CB6F44A069DC839D847CAB',
  FACTORY_ADDRESS: '0x612f8359C4B9191B10Ae134ff0eAFBEDBC068a98',
  WETH_ADDRESS: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',

  FRUIT_ADDRESS: '0x40e11f5e8027080a222eb8955f44aaef07e828d8',
  SEED_ADDRESS: '0xcdd59cec22452646415d4caad9186aa0965739ef',
  MASTERCHEF_ADDRESS: '0x7441c3ecf133d78b14ef27cb9e02b18c0af6a919',
  SOUSCHEF_ADDRESS: '0x0b7c14ae85267db38929af0d4d27e0aa3ede2722',

  BASE_TOKEN: 'FTM',
  BASE_USD_ID: 'USD (DAI)',
  BASE_USD_ADDRESS: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
  TOKEN_LIST: [
    {
      id: 'FTM',
      address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
      chainlink_address: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc",
      image:
        './res/3513.png',
      price: 1,
    },
    {
      id: 'USD (DAI)',
      address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
      chainlink_address: "0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52",
      image:
        './res/4943.png',
      price: 0,
    },

    {
      id: 'FRUIT',
      address: "0x40E11F5E8027080a222EB8955F44AAEf07E828D8",
      chainlink_address: "0x02E48946849e0BFDD7bEa5daa80AF77195C7E24c",
      image:
        './res/995996.jpg',
      price: 0,
    },

    // {
    //   id: 'USD (COIN)',
    //   address: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    //   chainlink_address: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    //   image:
    //     './res/3408.png',
    //   price: 0,
    // },
    // {
    //   id: 'LINK',
    //   address: "0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8",
    //   chainlink_address: "0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8",
    //   image:
    //     './res/1975.png',
    //   price: 0,
    // },
    {
      id: 'BTC',
      address: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
      chainlink_address: "0x8e94C22142F4A64b99022ccDd994f4e9EC86E4B4",
      image:
        './res/1.png',
      price: 0,
    },
    {
      id: 'ETH',
      address: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
      chainlink_address: "0x11DdD3d147E5b83D01cee7070027092397d63658",
      image:
        './res/1027.png',
      price: 0,
    },
  ],
};

export const localNetwork = {
  RPC_URL: 'http://localhost:8545',
  ROUTER_ADDRESS: '0x565d4Ec2aB22e5e686Ae029aD2Ea6d36C6F28281',
  FACTORY_ADDRESS: '0xD704cED92Cc82D05D932364459EF14C1Dc5D9d61',
  WETH_ADDRESS: '0x50C48f8C651191405644Ed03C8B9373b3531B338',

  FRUIT_ADDRESS: '0x40e11f5e8027080a222eb8955f44aaef07e828d8',
  SEED_ADDRESS: '0xcdd59cec22452646415d4caad9186aa0965739ef',
  MASTERCHEF_ADDRESS: '0x7441c3ecf133d78b14ef27cb9e02b18c0af6a919',
  SOUSCHEF_ADDRESS: '0x0b7c14ae85267db38929af0d4d27e0aa3ede2722',

  BASE_TOKEN: 'TEST',
  BASE_USD_ID: 'TOKEN2',
  BASE_USD_ADDRESS: '0x6c652937623b816343F2ba32c8d840F6cDaE0820',
  TOKEN_LIST: [
    {
      id: 'TEST',
      address: "0x50C48f8C651191405644Ed03C8B9373b3531B338",
      chainlink_address: "0x50C48f8C651191405644Ed03C8B9373b3531B338",
      image:
        './res/1839.png',
      price: 1,
    },
    {
      id: 'TOKEN1',
      address: "0x5866c15DC432dA5cc3928E06d2E510A738963669",
      chainlink_address: "0x5866c15DC432dA5cc3928E06d2E510A738963669",
      image:
        './res/999999.png',
      price: 0,
    },

    {
      id: 'FRUIT',
      address: "0x40e11f5e8027080a222eb8955f44aaef07e828d8",
      chainlink_address: "0x40e11f5e8027080a222eb8955f44aaef07e828d8",
      image:
        './res/995996.jpg',
      price: 0,
    },

    {
      id: 'TOKEN2',
      address: "0x6c652937623b816343F2ba32c8d840F6cDaE0820",
      chainlink_address: "0x6c652937623b816343F2ba32c8d840F6cDaE0820",
      image:
        './res/666.png',
      price: 0,
    },
  ],
};
// export const CURRENT_NETWORK = localNetwork;
// export const CURRENT_NETWORK = bscNetwork;
// export const CURRENT_NETWORK = ftmNetwork;
// export const CURRENT_NETWORK = maticNetwork;
export const CURRENT_NETWORK = maticNetworkNew;
