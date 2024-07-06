import { createStore } from 'vuex';
import { ethers, Contract }  from 'ethers';

import { CONTRACT_HELPER, isMetaMaskInstalled, parseDecimals, parseTradeDataTokenAmounts, formatTradeDataTokenAmounts, fixBTCDecimalsMul, fixBTCDecimalsDiv } from './helpers';
import { ABIS, CURRENT_NETWORK } from './constants';
import { LANG } from './lang';

const store = createStore({
  state() {
    return {
      LANG,
      main_togglers: {},
      darkMode: true,
      englishMode: true,

      ethereum: window.ethereum,
      isMetaMaskInstalled: isMetaMaskInstalled(),
      SCANNER: CURRENT_NETWORK.SCANNER_URL,
      BASE_TOKEN: CURRENT_NETWORK.BASE_TOKEN,
      BASE_USD_ID: CURRENT_NETWORK.BASE_USD_ID,

      lps: {},
      pools: {},
      retrieved_pool_length: 0,
      tokens: CURRENT_NETWORK.TOKEN_LIST.slice(0, 2),
      token_list: CURRENT_NETWORK.TOKEN_LIST,

      accounts: {},
      articles: [
        {
          id: 'test1',
          image:
            'https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg',
          title: 'A trip into the mountains',
          description: 'It was a really nice trip!',
        },
      ],
      memories: [
        {
          id: 'BNB',
          image:
            './res/1839.png',
          title: 'Good eating',
          description: 'Really tasty!',
        },
        {
          id: 'USD (B)',
          image:
            './res/3408.png',
          title: 'Good eating',
          description: 'Really tasty!',
        },
      ],
    };
  },
  mutations: {

    updateTokenPriceAt(state, tokenData) {
      state.token_list[tokenData.index].price = tokenData.price
    },

    // addToggler(state, _toggler)
    // {
    //   state.main_togglers[_toggler.key] = _toggler
    // }
    // turnOnToggler(state, _toggler)
    // {
    //   state.main_togglers[_toggler.key] = true
    // }
    // turnOffToggler(state, _toggler)
    // {
    //   state.main_togglers[_toggler.key] = false
    // }
    // toggleToggler(state, _toggler)
    // {
    //   state.main_togglers[_toggler.key] = !state.main_togglers[_toggler.key]
    // }

    setDarkMode(state, mode) {
      state.darkMode = mode
    },
    setEnglishMode(state, mode) {
      state.englishMode = mode
    },
    setToken(state, tokenData) {
      state.tokens[tokenData.index] = tokenData.token
    },
    reverseToken(state) {
      state.tokens = [state.tokens[1], state.tokens[0]]
    },
    addMemory(state, memoryData) {
      const newMemory = {
        id: new Date().toISOString(),
        title: memoryData.title,
        image: memoryData.imageUrl,
        description: memoryData.description
      };

      state.memories.unshift(newMemory);
    },
    addLp(state, lpData) {
      state.lps[lpData.token0+lpData.token1] = lpData
    },
    addPool(state, poolData) {
      state.pools[poolData.lpToken] = poolData
    },
    refreshPool(state, poolData) {
      state.pools[poolData.lpToken] = {
        ...state.pools[poolData.lpToken],
        ...poolData,
      }
    },
    update_retrieved_pools_length(state, length) {
      state.retrieved_pool_length = length
    },
    addAccount(state, accountData) {
      const newAccounts = {
        [accountData]: {
          address: accountData,
          balance: 0,
          balances: {},
          allowances: {},
        },
      };

      state.accounts = {...state.accounts, ...newAccounts}
    },
    updateAccountAllowance(state, allowanceData) {
      let newAllowance = {
        [allowanceData.tokenAddress]: allowanceData.allowance
      }
      state.accounts[allowanceData.address].allowances = {
        ...state.accounts[allowanceData.address].allowances,
        ...newAllowance,
      }
    },
    updateAccountBalance(state, balanceData) {
      let newBalance = {
        [balanceData.tokenId]: balanceData.balance
      }
      if (CURRENT_NETWORK.BASE_TOKEN == balanceData.tokenId)
      {
        state.accounts[balanceData.address].balance = balanceData.balance
      }
      // console.log("state.accounts[balanceData.address].balances[balanceData.tokenId]")
      // console.log(state.accounts[balanceData.address].balances[balanceData.tokenId])
      // console.log("newBalance")
      // console.log(newBalance)
      state.accounts[balanceData.address].balances = {
        ...state.accounts[balanceData.address].balances,
        ...newBalance,
      }
    },
    updateAccount(state, accountData) {
      state.accounts[accountData.address] = {
                          ...state.accounts[accountData.address],
                          ...accountData.account
                        }
    },
  },
  actions: {

    setDarkMode(context, mode) {
      context.commit('setDarkMode', mode);
    },
    setEnglishMode(context, mode) {
      context.commit('setEnglishMode', mode);
    },

    addLp(context, lpData) {
      context.commit('addLp', lpData);
    },
    reverseToken(context) {
      context.commit('reverseToken')
    },
    addMemory(context, memoryData) {
      context.commit('addMemory', memoryData);
    },

    connectWallet: async (context) => {
      if (!context.getters.is_metaMask) { alert("Please, Install Metamask.") }
      // console.log("accs")
      let accs = await context.getters.eth.request({ method: 'eth_requestAccounts' }).catch((err) => {
        // console.log("err", err.message)
        if (err.code == -32002)
        {
          alert("Unlock or Connect your Wallet and\ntry Again...")
        }
      })
      if(typeof accs == "undefined") { console.log("Unlock or Connect Wallet and try Again...")}
      // console.log(accs)
      for (var i = 0; i < accs.length; i++) {
        context.commit('addAccount', accs[i]);
      }
      // context.dispatch('getTradeData')
      // context.dispatch('refreshFirstAccount')
    },
    setToken(context, tokenData) {
      let foundToken = context.getters.tokenAt(tokenData.index ? 0 : 1)
      if (foundToken.id == tokenData.token.id)
      {
        context.commit('reverseToken')
      } else {
        context.commit('setToken', tokenData)
      }
    },

    refreshFarms: async (context) =>
    {
      let firstAddress = context.getters.first_acc.address
      const BLOCKCHAIN = context.getters.newProvider
      const blockNumber = await BLOCKCHAIN.getBlockNumber()
      console.log("blockNumber", blockNumber)
      const chefContract = new Contract(CURRENT_NETWORK.MASTERCHEF_ADDRESS, ABIS.MASTERCHEF, BLOCKCHAIN)

      return new Promise(async (resolve, reject) => {
        let poolsLengthData = await chefContract.poolLength()
        let poolsLength = parseInt(poolsLengthData.toString())
        context.commit("update_retrieved_pools_length", poolsLength)
        // console.log("poolsLength", poolsLength)
        poolsLength = poolsLength > 10 ? 10 : poolsLength
        // console.log("new poolsLength", poolsLength)

        for (var i = 0; i < poolsLength; i++)
        {
          let thePoolData = await chefContract.poolInfo(i)
          // console.log(i, "thePoolData", thePoolData)
          let theUserInfo = await chefContract.userInfo(i, firstAddress)
          // console.log(i, "theUserInfo", theUserInfo)
          const pendingCash = await chefContract.pendingCash(i, firstAddress)
          // console.log(i, "pendingCash", pendingCash)

          const lpContract = new Contract(thePoolData.lpToken, ABIS.PAIR, BLOCKCHAIN)

          const chefAllowance = await lpContract.allowance(firstAddress, CURRENT_NETWORK.MASTERCHEF_ADDRESS)
          // console.log(i, "chefAllowance", chefAllowance)
          // console.log(thePoolData.lpToken)
          // const xxxtoken0Address = await lpContract.token0
          // console.log(xxxtoken0Address)
          let token0Address = null
          let token1Address = null
          if (i > 0)
          {
            token0Address = await lpContract.token0()
            token1Address = await lpContract.token1()
          }
          // const token1Address = await lpContract.token1()
          // console.log("asd", token0Address, token1Address)
          // console.log(parseFloat(ethers.utils.formatEther(chefAllowance)))
          // console.log(parseDecimals(parseFloat(ethers.utils.formatEther(chefAllowance).toString())))

          // (user.amount * pool.accCashPerShare) - user.rewardDebt

          let newPoolData = {
            pid: i,
            lpToken: thePoolData.lpToken,
            allocPoint: parseFloat(thePoolData.allocPoint.toString()),
            lastRewardBlock: parseInt(thePoolData.lastRewardBlock.toString()),
            accCashPerShare: parseDecimals(parseFloat(ethers.utils.formatEther(thePoolData.accCashPerShare))),

            allowance: parseDecimals(parseFloat(ethers.utils.formatEther(chefAllowance))),
            pendingCash: parseDecimals(parseFloat(ethers.utils.formatEther(pendingCash))),

            amount: parseDecimals(parseFloat(ethers.utils.formatEther(theUserInfo.amount))),
            rewardDebt: parseDecimals(parseFloat(ethers.utils.formatEther(theUserInfo.rewardDebt))),

            token0: token0Address,
            token1: token1Address,
          }
          // console.table(newPoolData)
          context.commit('addPool', newPoolData)
        }

        resolve(poolsLength)
      })
    },

    refreshAFarm: async (context, farmData) =>
    {
      let firstAddress = context.getters.first_acc.address
      const BLOCKCHAIN = context.getters.newProvider
      const blockNumber = await BLOCKCHAIN.getBlockNumber()
      console.log("blockNumber", blockNumber)
      const chefContract = new Contract(CURRENT_NETWORK.MASTERCHEF_ADDRESS, ABIS.MASTERCHEF, BLOCKCHAIN)

      let cashPerBlock = await chefContract.cashPerBlock()
      console.log("cash per block", ethers.utils.formatEther(cashPerBlock))

      return new Promise(async (resolve, reject) => {
        // let poolsLengthData = await chefContract.poolLength()
        // let poolsLength = parseInt(poolsLengthData.toString())
        // context.commit("update_retrieved_pools_length", poolsLength)
        // console.log("poolsLength", poolsLength)
        // poolsLength = poolsLength > 10 ? 10 : poolsLength
        // console.log("new poolsLength", poolsLength)

        // for (var i = 0; i < poolsLength; i++)
        // {
          let thePoolData = await chefContract.poolInfo(farmData.pid)
          // console.log(i, "thePoolData", thePoolData)
          let theUserInfo = await chefContract.userInfo(farmData.pid, firstAddress)
          // console.log(i, "theUserInfo", theUserInfo)
          const pendingCash = await chefContract.pendingCash(farmData.pid, firstAddress)
          // console.log(i, "pendingCash", pendingCash)

          const lpContract = new Contract(farmData.lpToken, ABIS.PAIR, BLOCKCHAIN)

          const chefAllowance = await lpContract.allowance(firstAddress, CURRENT_NETWORK.MASTERCHEF_ADDRESS)
          // console.log(i, "chefAllowance", chefAllowance)
          // console.log(thePoolData.lpToken)
          // const xxxtoken0Address = await lpContract.token0
          // console.log(xxxtoken0Address)
          let token0Address = null
          let token1Address = null
          // if (i > 0)
          // {
          //   token0Address = await lpContract.token0()
          //   token1Address = await lpContract.token1()
          // }
          // const token1Address = await lpContract.token1()
          // console.log("asd", token0Address, token1Address)
          // console.log(parseFloat(ethers.utils.formatEther(chefAllowance)))
          // console.log(parseDecimals(parseFloat(ethers.utils.formatEther(chefAllowance).toString())))

          // (user.amount * pool.accCashPerShare) - user.rewardDebt

          let newPoolData = {
            // pid: i,
            lpToken: farmData.lpToken,

            allocPoint: parseFloat(thePoolData.allocPoint.toString()),
            lastRewardBlock: parseInt(thePoolData.lastRewardBlock.toString()),
            accCashPerShare: parseDecimals(parseFloat(ethers.utils.formatEther(thePoolData.accCashPerShare))),

            allowance: parseDecimals(ethers.utils.formatEther(chefAllowance)),
            pendingCash: parseDecimals(parseFloat(ethers.utils.formatEther(pendingCash))),

            amount: parseDecimals(parseFloat(ethers.utils.formatEther(theUserInfo.amount))),
            rewardDebt: parseDecimals(parseFloat(ethers.utils.formatEther(theUserInfo.rewardDebt))),

            // token0: token0Address,
            // token1: token1Address,
          }
          // console.table(newPoolData)
          context.commit('refreshPool', newPoolData)
        // }

        resolve(newPoolData)
      })
    },

    refreshFirstAccount: async (context, refreshAllowance = false) =>
    {
      let firstAddress = context.getters.first_acc.address
      console.log("refreshFirstAccount -> "+firstAddress+ ". . .")

      return new Promise(async (resolve, reject) => {
        const BLOCKCHAIN = context.getters.newProvider
        const aBalance = await BLOCKCHAIN.getBalance(firstAddress)
        // console.log(`*getting base balance. . .`)
        const myparsedBalance = parseDecimals(parseFloat(ethers.utils.formatEther(aBalance)))
        console.log(aBalance,`. . .1/3. BASE_TOKEN balance: ${myparsedBalance}`)

        // let newAccount = {
        //   balance: myparsedBalance,
        //   allowances: {},
        //   balances: {
        //     [CURRENT_NETWORK.BASE_TOKEN]: myparsedBalance,
        //   }
        // }
        context.commit(
          "updateAccountBalance",
          {
            address: firstAddress,
            tokenId: CURRENT_NETWORK.BASE_TOKEN,
            balance: parseFloat(myparsedBalance),
          }
        )

        if (!myparsedBalance) {
          return
        }


        const tokens = context.getters.tokens
        const token_list = context.getters.token_list
        for (var i = 0; i < tokens.length; i++)
        {
          const tokenAddress = tokens[i].address 
          const tokenContract = new Contract(tokenAddress, ABIS.ERC20, BLOCKCHAIN)
          // console.log("tokenAddress, ABIS.ERC20, BLOCKCHAIN")
          let PARSED_userAllowance = 0
          let PARSED_userBalance = 0

          const chainlinkContract = new Contract(tokens[i].chainlink_address, ABIS.CHAINLINK, BLOCKCHAIN)
          // console.log("tokens[i].id", tokens[i].id, tokens[i].id != "CASH", tokens[i].id != "FRUIT")
          if (tokens[i].id != "CASH" && tokens[i].id != "FRUIT")
          {
            // console.log("tokens[i].chainlink_address", tokens[i].chainlink_address)
            const chainlinkPrice = await chainlinkContract.latestAnswer()
            const parsedChainlinkPrice = parseFloat(ethers.utils.formatEther(chainlinkPrice))*10**10

            // console.log({index: i, price: parseDecimals(parsedChainlinkPrice)}, tokens[i].id)
            let tokenIndex = token_list.find(x => x.address == tokens[i].address)
            context.commit("updateTokenPriceAt", {index: token_list.indexOf(tokenIndex), price: parseDecimals(parsedChainlinkPrice)})
          }

          if (CURRENT_NETWORK.BASE_TOKEN != tokens[i].id)
          {
            // console.log(`*getting ${tokens[i].id} balance. . .`, tokens[i].address)
            const userBalance = await tokenContract.balanceOf(firstAddress)
            PARSED_userBalance = parseFloat(ethers.utils.formatEther(userBalance))

            if (tokens[i].id == "USD (COIN)") {
              PARSED_userBalance = parseDecimals(PARSED_userBalance * (10 ** 12))
            } else if (tokens[i].id == "BTC") {
              PARSED_userBalance = parseDecimals(PARSED_userBalance * (10 ** 10))
            } else {
              PARSED_userBalance = parseDecimals(PARSED_userBalance)
            }
            console.log(`. . .3/3. ${tokens[i].id} balanceOf: ${PARSED_userBalance}`)
            // console.log(PARSED_userBalance)

            context.commit(
              "updateAccountBalance",
              {
                address: firstAddress,
                tokenId: tokens[i].id,
                balance: parseFloat(PARSED_userBalance),
              }
            )
            // console.log(tokens[i].address, PARSED_userBalance)
            // newAccount.balances[tokens[i].id] = PARSED_userBalance

            if (refreshAllowance)
            {

              const userAllowance = await tokenContract.allowance(firstAddress, CURRENT_NETWORK.ROUTER_ADDRESS)
              PARSED_userAllowance = ethers.utils.formatEther(userAllowance)
              // console.log(`pre PARSED_userAllowance: ${PARSED_userAllowance}`)

              // if (tokens[i].id == "USD (COIN)") {
              //   console.log("is usdc")
              //   PARSED_userAllowance = parseDecimals(PARSED_userAllowance * (10 ** 12))
              // } else if (tokens[i].id == "BTC") {
              //   console.log("is btc")
              //   PARSED_userAllowance = parseDecimals(PARSED_userAllowance * (10 ** 10))
              // } else
              {
                // console.log("is any erc20")
                PARSED_userAllowance = parseDecimals(PARSED_userAllowance)
              }
              // console.log(`allowance: ${ethers.utils.formatEther(userAllowance)}`)
              // console.log(`PARSED_userAllowance: ${PARSED_userAllowance}`)
              console.log(`. . .3/3.1. ${tokens[i].id} allowance: ${PARSED_userAllowance}`)
              // newAccount.allowances[tokens[i].address] = PARSED_userAllowance

              context.commit(
                "updateAccountAllowance",
                {
                  address: firstAddress,
                  tokenAddress: tokens[i].address,
                  allowance: PARSED_userAllowance,
                }
              )
            }
          } else {
            console.log(`. . .2/3. token${i} is BASE_TOKEN`)
          }
        }

        // context.commit('updateAccount', {address: firstAddress, account: newAccount})
        resolve(true)
      })
    },

    getTradeData: async (context, _tradeData) =>
    {
      const firstAddress = context.getters.first_acc.address
      const tokens = context.getters.tokens
      const token_list = context.getters.token_list
      const BLOCKCHAIN = context.getters.newProvider
      const routerContract = new Contract(CURRENT_NETWORK.ROUTER_ADDRESS, ABIS.ROUTER, BLOCKCHAIN)
      const oneEther = ethers.utils.parseUnits('1', 18)
      
      // const amountInFloat = parseFloat(tradeData.token0amount);

      // console.log(`pre getTradeData -> ${_tradeData.token0amount} ${_tradeData.token1amount}`)
      // const _tradeData_ = fixBTCDecimalsDiv(tokens, [_tradeData.token0amount, _tradeData.token1amount])
      // const tradeData = {
      //   token0amount: _tradeData_[0],
      //   token1amount: _tradeData_[1],
      // }
      // console.log(`post getTradeData -> ${tradeData.token0amount} ${tradeData.token1amount}`)
      // const tradeData = parseTradeDataTokenAmounts(tokens, _tradeData)
      console.log(`getTradeData -> ${_tradeData.token0amount} <${tokens[0].id}>s for ? <${tokens[1].id}> . . .`)
      const tradeDataParsedd = fixBTCDecimalsDiv(tokens, [_tradeData.token0amount, _tradeData.token1amount])
      const amountIn = ethers.utils.parseEther(tradeDataParsedd[0].toFixed(17));
      // const amountIn = ethers.utils.parseEther(parseFloat(_tradeData.token0amount).toFixed(17));

      return new Promise(async (resolve, reject) => {
        // console.log([CURRENT_NETWORK.BASE_USD_ADDRESS, CURRENT_NETWORK.WETH_ADDRESS])
        // console.log(`getTradeData getAmountsOut ${CURRENT_NETWORK.WETH_ADDRESS} ${CURRENT_NETWORK.BASE_USD_ADDRESS}`)
        // const baseAmountsOut = await routerContract.getAmountsOut(oneEther, [CURRENT_NETWORK.WETH_ADDRESS, CURRENT_NETWORK.BASE_USD_ADDRESS]);
        // const _parsedBasePrice = parseFloat(ethers.utils.formatEther(baseAmountsOut[1]))
        // const basePrice = parseFloat(ethers.utils.formatEther(baseAmountsOut[1]))
        // context.commit("updateTokenPriceAt", {index: 0, price: parseDecimals(basePrice)})
        // console.log(`getTradeData `, tradeData)
        let inString = _tradeData.token0amount
        let outString = ""

        if (tokens[0].id != CURRENT_NETWORK.BASE_USD_ID && tokens[1].id != CURRENT_NETWORK.BASE_USD_ID )
        {
          console.log(`. . .1/2. trading Token x Token: {${inString}} for {${outString}}`)
          const amountsresult = await routerContract.getAmountsOut(amountIn, [tokens[0].address, CURRENT_NETWORK.BASE_USD_ADDRESS ,tokens[1].address])
          // console.log(ethers.utils.formatEther(amountsresult[0]), ethers.utils.formatEther(amountsresult[1]), ethers.utils.formatEther(amountsresult[2]))
          const parsedDecimalsAmountResult = fixBTCDecimalsMul(tokens, [ethers.utils.formatEther(amountsresult[0]),ethers.utils.formatEther(amountsresult[2])])
          console.log(`. . .1.1/2. parsedDecimalsAmountResult: ${parsedDecimalsAmountResult[1]}`)
          outString = parseDecimals(parseFloat(parsedDecimalsAmountResult[1]))
          resolve(outString)
          // const __parsedAmountResult1 = ethers.utils.formatEther(amountsresult[2])
          // const doubleparsedamount1 = formatTradeDataTokenAmounts(tokens, {token1amount: __parsedAmountResult1, token0amount: "0"}).token1amount
          // resolve(parseDecimals(parseFloat(doubleparsedamount1)))
        } else {
          if (tokens[0].id == CURRENT_NETWORK.BASE_USD_ID)
          {
            console.log(`. . .1/2. trading USD: {${inString}} for {${outString}}`)
          } else {
            console.log(`. . .1/2. trading : {${inString}} for {${outString}} USD`)
          }
          const amountsresult = await routerContract.getAmountsOut(amountIn, [tokens[0].address, tokens[1].address]);
          const __parsedAmountResult1 = ethers.utils.formatEther(amountsresult[1])
          const doubleparsedamount1 = formatTradeDataTokenAmounts(tokens, {token1amount: __parsedAmountResult1, token0amount: "0"}).token1amount
          // console.log(ethers.utils.formatEther(amountsresult[0]), ethers.utils.formatEther(amountsresult[1]))
          outString = parseDecimals(parseFloat(doubleparsedamount1))
          resolve(outString)
        }
        console.log(`. . .2/2. trade results: {${inString}} for {${outString}}`)
      })
    },

    _getTradeData: async (context, tradeData) =>
    {
      const firstAddress = context.getters.first_acc.address
      const tokens = context.getters.tokens
      const token_list = context.getters.token_list
      const BLOCKCHAIN = context.getters.newProvider
      const routerContract = new Contract(CURRENT_NETWORK.ROUTER_ADDRESS, ABIS.ROUTER, BLOCKCHAIN)
      const oneEther = ethers.utils.parseUnits('1', 18)

      return new Promise(async (resolve, reject) => {
        // console.log([CURRENT_NETWORK.BASE_USD_ADDRESS, CURRENT_NETWORK.WETH_ADDRESS])
        console.log(`getTradeData getAmountsOut ${CURRENT_NETWORK.WETH_ADDRESS} ${CURRENT_NETWORK.BASE_USD_ADDRESS}`)
        const baseAmountsOut = await routerContract.getAmountsOut(oneEther, [CURRENT_NETWORK.WETH_ADDRESS, CURRENT_NETWORK.BASE_USD_ADDRESS]);
        const _parsedBasePrice = parseFloat(ethers.utils.formatEther(baseAmountsOut[1]))
        const basePrice = parseFloat(ethers.utils.formatEther(baseAmountsOut[1]))
        // context.commit("updateTokenPriceAt", {index: 0, price: parseDecimals(basePrice)})
        console.log(`getTradeData baseprice ${basePrice} ${typeof basePrice}`)
        const amountIn = ethers.utils.parseEther(tradeData.token0amount);
        const amountInFloat = parseFloat(tradeData.token0amount);

        if (tokens[0].id == CURRENT_NETWORK.BASE_TOKEN)
        {
          if (tokens[1].id == CURRENT_NETWORK.BASE_USD_ID)
          {
            const amountsresult = await routerContract.getAmountsOut(amountIn, [CURRENT_NETWORK.WETH_ADDRESS, tokens[1].address]);
            // console.log(ethers.utils.formatEther(amountsresult[0]), ethers.utils.formatEther(amountsresult[1]))
            const __parsedAmountResult1 = parseFloat(ethers.utils.formatEther(amountsresult[1]))
            // context.commit("updateTokenPriceAt", {index: 0, price: parseDecimals(__parsedAmountResult1/amountInFloat)})
            resolve(parseDecimals(__parsedAmountResult1))
          } else {
            const amountsresult = await routerContract.getAmountsOut(amountIn, [CURRENT_NETWORK.WETH_ADDRESS, tokens[1].address]);
            // console.log(ethers.utils.formatEther(amountsresult[0]), ethers.utils.formatEther(amountsresult[1]))
            const __parsedAmountResult1 = parseFloat(ethers.utils.formatEther(amountsresult[1]))
            // const __parsedtoken1 = ethers.utils.formatEther(amountsresult[1])
            const oneOfTokenInWETH = amountInFloat / __parsedAmountResult1
            let tokenIndex = token_list.find(x => x.address == tokens[1].address)
            // context.commit("updateTokenPriceAt", {index: token_list.indexOf(tokenIndex), price: parseDecimals(oneOfTokenInWETH*basePrice)})
            resolve(parseDecimals(__parsedAmountResult1))
          }
        } else {
          if (tokens[1].id == CURRENT_NETWORK.BASE_TOKEN)
          {
            if (tokens[0].id == CURRENT_NETWORK.BASE_USD_ID)
            {
              const amountsresult = await routerContract.getAmountsOut(amountIn, [tokens[0].address, CURRENT_NETWORK.WETH_ADDRESS]);
              const __parsedAmountResult1 = parseFloat(ethers.utils.formatEther(amountsresult[1]))
              // context.commit("updateTokenPriceAt", {index: 0, price: parseDecimals(amountInFloat/__parsedAmountResult1)})
              resolve(parseDecimals(__parsedAmountResult1))
            } else {
              const amountsresult = await routerContract.getAmountsOut(amountIn, [tokens[0].address, CURRENT_NETWORK.WETH_ADDRESS]);
              const __parsedAmountResult1 = parseFloat(ethers.utils.formatEther(amountsresult[1]))
              let tokenIndex = token_list.find(x => x.address == tokens[0].address)
              // context.commit("updateTokenPriceAt", {index: token_list.indexOf(tokenIndex), price: parseDecimals(__parsedAmountResult1/parseFloat(ethers.utils.formatEther(amountsresult[0])) * basePrice)})
              resolve(parseDecimals(__parsedAmountResult1))
            }
          } else {
            const amountsresult = await routerContract.getAmountsOut(amountIn, [tokens[0].address, CURRENT_NETWORK.WETH_ADDRESS, tokens[1].address]);
            const __parsedAmountResult1 = parseFloat(ethers.utils.formatEther(amountsresult[1]))
            console.log(ethers.utils.formatEther(amountsresult[0]), ethers.utils.formatEther(amountsresult[1]))
            resolve(parseDecimals(__parsedAmountResult1))
            // if (tokens[1].id == CURRENT_NETWORK.BASE_USD_ID)
            // {
            //   resolve(parseDecimals(__parsedtoken1*basePrice))
            // } else {
            //   const amountsresult2 = await routerContract.getAmountsOut(oneEther, [tokens[1].address, CURRENT_NETWORK.WETH_ADDRESS]);
            //   const __parsedtoken12 = parseFloat(ethers.utils.formatEther(amountsresult2[1]))
            //   resolve(parseDecimals(__parsedtoken1/__parsedtoken12))
            // }
            // reject("not ready")
          }
        }
      })
    },

    addLiquidity: async (context, _tradeData) =>
    {
      const firstAddress = context.getters.first_acc.address
      let tokens = context.getters.tokens
      const BLOCKCHAIN = context.getters.newProvider
      const USER_WALLET = await BLOCKCHAIN.getSigner()
      const routerContract = new Contract(CURRENT_NETWORK.ROUTER_ADDRESS, ABIS.ROUTER, USER_WALLET)
      // const tradeData = parseTradeDataTokenAmounts(tokens, _tradeData)
      return new Promise(async (resolve, reject) => {
        // if (tokens[0].id == "BTC")
        // {
        //   tradeData.token0amount = parseFloat(tradeData.token0amount) / (10 ** 10)
        // }
        // if (tokens[1].id == "BTC")
        // {
        //   tradeData.token1amount = parseFloat(tradeData.token1amount) / (10 ** 10)
        // }
        // console.table("add liquidity")
        // console.table(tradeData)
        console.log(`addLiquidity -> ${_tradeData.token0amount} <${tokens[0].id}>s and ? ${_tradeData.token1amount} <${tokens[1].id}>s . . .`)
        const tradeDataParsedd = fixBTCDecimalsDiv(tokens, [_tradeData.token0amount, _tradeData.token1amount])
        const tradeData = {
          slippage: _tradeData.slippage,
          token0amount: tradeDataParsedd[0],
          token1amount: tradeDataParsedd[1],
        }
        // console.log("tradeData.token0amount", typeof tradeData.token0amount,":" , tradeData.token0amount)
        // console.log("tradeData.token1amount", typeof tradeData.token1amount,":" , tradeData.token1amount)

        let token0amountslipped = ethers.utils.parseEther((tradeData.token0amount * (tradeData.slippage / 100)).toFixed(17))
        let token1amountslipped = ethers.utils.parseEther((tradeData.token1amount * (tradeData.slippage / 100)).toFixed(17))
        let token0amount = ethers.utils.parseEther((parseFloat(tradeData.token0amount).toFixed(17)).toString())
        let token1amount = ethers.utils.parseEther((parseFloat(tradeData.token1amount).toFixed(17)).toString())
        let dueDate2 = parseInt(Date.now() / 1000) + 1800
        console.log(`. . .1/4 parsed values`)
        console.table(
        {
          // token0amountslipped,
          token0amountslipped_VALUE: (tradeData.token0amount * (tradeData.slippage / 100)).toFixed(17),
          // token1amountslipped,
          token1amountslipped_VALUE: (tradeData.token1amount * (tradeData.slippage / 100)).toFixed(17),
          // token0amount,
          token0amount_VALUE: (parseFloat(tradeData.token0amount).toFixed(17)).toString(),
          // token1amount,
          token1amount_VALUE: (parseFloat(tradeData.token1amount).toFixed(17)).toString(),
        })
        console.log(". . .2/4. slippage", tradeData.slippage)

        if (tradeData.token0amount && tradeData.token1amount)
        {
          if ((tokens[0].id == CURRENT_NETWORK.BASE_TOKEN) || (tokens[1].id == CURRENT_NETWORK.BASE_TOKEN))
          {
            console.log(". . .3/4. add Liquidity to BASE_TOKEN", CURRENT_NETWORK.BASE_TOKEN)
            // console.log("trade with base token:",CURRENT_NETWORK.BASE_TOKEN,)
            let pairToken = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? tokens[1] : tokens[0]
            let tokenAmount = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? token1amount : token0amount
            let tokenAmountslipped = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? token1amountslipped : token0amountslipped
            let wethAmount = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? token0amount : token1amount
            let wethAmountslipped = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? token0amountslipped : token1amountslipped
            console.table({
              pairToken: pairToken.address,
              tokenAmount: ethers.utils.formatEther(tokenAmount),
              tokenAmountslipped: ethers.utils.formatEther(tokenAmountslipped),
              wethAmount: ethers.utils.formatEther(wethAmount),
              wethAmountslipped: ethers.utils.formatEther(wethAmountslipped),
            })
            console.log(". . .3/4. also add Liquidity to token:",pairToken)
            // console.log("trade with :",pairToken,)

            try {
              // let tokenamountFixed = 0
              // let wethAmountFixed = 0
              // if (tokens[0].id == CURRENT_NETWORK.BASE_TOKEN)
              // {
              //   wethAmountFixed = wethAmountslipped
              // } else {
              //   wethAmountFixed = wethAmount
              // }
              // console.log("add liquidity with base token")

              //   console.log("pairToken.address,", pairToken.address)
              //   console.log("tokenAmount,", tokenAmount)
              //   console.log("tokenAmountslipped,", tokenAmountslipped)
              //   console.log("wethAmountslipped,", wethAmountslipped)
              //   console.log("firstAddress,", firstAddress)
              //   console.log("dueDate2,", dueDate2)
              //   console.log("{value: wethAmountFixed}", wethAmountFixed)


              const swapTx = await routerContract.addLiquidityETH(
                pairToken.address,
                tokenAmount,
                tokenAmountslipped,
                wethAmountslipped,
                firstAddress,
                dueDate2,
                {value: wethAmount}
              )


              await swapTx.wait()
              await context.dispatch('getLiquidity')
              resolve(swapTx)
            } catch (error)
            {
              reject(error)
            }
          } else {

            let token0 = tokens[0]
            let token1 = tokens[1]


                console.log("add liquidity with non base token")
                console.log("token0.address,",token0.address)
                console.log("token1.address,",token1.address)
                console.log("token0amount,",token0amount)
                console.log("token1amount,",token1amount)
                console.log("token0amountslipped,",token0amountslipped)
                console.log("token1amountslipped,",token1amountslipped)
                console.log("firstAddress,",firstAddress)
                console.log("dueDate2,",dueDate2)

            const swapTx = await routerContract.addLiquidity(
                token0.address,
                token1.address,
                token0amount,
                token1amount,
                token0amountslipped,
                token1amountslipped,
                firstAddress,
                dueDate2,
            ).then(async (res) => {
              console.log("tx sent!", res);
              let aresultado = await res.wait()
              console.log("tx res", aresultado);
              await context.dispatch('refreshFirstAccount')
              resolve(aresultado)
            }).catch((err) => {
              
              console.log("failed addLiquidity", err);
              reject(err)
            })
          }
        }  
      })
    },

    handleNullPairETH: async (context, tokenAddress) =>
    {
      return new Promise(async (resolve, reject) => {
        console.log("handleNullPairETH")

        const firstAddress = context.getters.first_acc.address
        const BLOCKCHAIN = context.getters.newProvider
        const USER_WALLET = await BLOCKCHAIN.getSigner()
        const routerContract = new Contract(CURRENT_NETWORK.ROUTER_ADDRESS, ABIS.ROUTER, USER_WALLET)
        const oneEther = ethers.utils.parseUnits('1', 18)
        const oneTenthEther = ethers.utils.parseUnits('0.1', 18)
        let tokens = context.getters.tokens

        const factoryContract = new Contract(CURRENT_NETWORK.FACTORY_ADDRESS, ABIS.FACTORY, USER_WALLET)
        const theHash = await factoryContract.INIT_CODE_PAIR_HASH()
        console.log("theHash", theHash,)
        console.log(theHash.toString())

        try {
          console.log("*** trying to createPair", tokenAddress, CURRENT_NETWORK.WETH_ADDRESS)
          const newLpTx = await factoryContract.createPair(tokenAddress, CURRENT_NETWORK.WETH_ADDRESS)
          console.log("*** waiting to createPair", tokenAddress, CURRENT_NETWORK.WETH_ADDRESS)
          await newLpTx.wait()
          const pairAddressnew = await factoryContract.getPair(tokens[0], tokens[1])

          resolve(pairAddressnew)
        } catch (error)
        {
          console.log(error)
          reject(error)
        }
      })
    },

    approveToRouter: async (context, tokenAddress) =>
    {
      let firstAddress = context.getters.first_acc.address
      const BLOCKCHAIN = context.getters.newProvider
      const USER_WALLET = await BLOCKCHAIN.getSigner()
      const tokenContract = new Contract(tokenAddress, ABIS.ERC20, USER_WALLET)

      return new Promise(async (resolve, reject) => {
        try {
          let approvingTx4 = await tokenContract.approve(CURRENT_NETWORK.ROUTER_ADDRESS, ethers.constants.MaxUint256.toString())
          await approvingTx4.wait()
          const allowanceTx = await tokenContract.allowance(firstAddress, CURRENT_NETWORK.ROUTER_ADDRESS)
          let parsedAllowanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(allowanceTx)))
          context.commit(
            "updateAccountAllowance",
            {
              address: firstAddress,
              tokenAddress: tokenAddress,
              allowance: parsedAllowanceTx,
            }
          )

          resolve(parsedAllowanceTx)
        } catch (error)
        {
          reject(error)
        }
      })
    },
    disapproveToRouter: async (context, tokenAddress) =>
    {
      let firstAddress = context.getters.first_acc.address
      const BLOCKCHAIN = context.getters.newProvider
      const USER_WALLET = await BLOCKCHAIN.getSigner()
      const tokenContract = new Contract(tokenAddress, ABIS.ERC20, USER_WALLET)

      return new Promise(async (resolve, reject) => {
        try {
          let approvingTx4 = await tokenContract.approve(CURRENT_NETWORK.ROUTER_ADDRESS, 0)
          await approvingTx4.wait()
          const allowanceTx = await tokenContract.allowance(firstAddress, CURRENT_NETWORK.ROUTER_ADDRESS)
          let parsedAllowanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(allowanceTx)))
          context.commit(
            "updateAccountAllowance",
            {
              address: firstAddress,
              tokenAddress: tokenAddress,
              allowance: parsedAllowanceTx,
            }
          )

          resolve(parsedAllowanceTx)
        } catch (error)
        {
          reject(error)
        }
      })
    },

    async sendDustToLP(context, index) {
      return new Promise(async (resolve, reject) => {
        const BLOCKCHAIN = context.getters.newProvider
        const tokens = context.getters.tokens
        const USER_WALLET = await BLOCKCHAIN.getSigner()
        const oneTenthEther = ethers.utils.parseUnits('0.01', 18)

        const factoryContract = new Contract(CURRENT_NETWORK.FACTORY_ADDRESS, ABIS.FACTORY, USER_WALLET)
        const pairAddressnew = await factoryContract.getPair(tokens[0].address, tokens[1].address)

        const tokenContract = new Contract(tokens[index].address, ABIS.ERC20, USER_WALLET)
        // let approvingTx3 = await tokenContract.approve(pairAddressnew, ethers.constants.MaxUint256.toString())
        // await approvingTx3.wait()
        console.log(tokenContract.transfer, pairAddressnew, oneTenthEther)
        let approvingTx4 = await tokenContract.transfer(pairAddressnew, oneTenthEther)
        await approvingTx4.wait()

        resolve(pairAddressnew)
      })
    },
    
    handleNullPair: async (context, tokens) =>
    {
      return new Promise(async (resolve, reject) => {
        console.log("handleNullPair")

        const firstAddress = context.getters.first_acc.address
        const BLOCKCHAIN = context.getters.newProvider
        const USER_WALLET = await BLOCKCHAIN.getSigner()
        const routerContract = new Contract(CURRENT_NETWORK.ROUTER_ADDRESS, ABIS.ROUTER, USER_WALLET)
        const oneEther = ethers.utils.parseUnits('1', 18)
        const oneTenthEther = ethers.utils.parseUnits('0.1', 18)

        const factoryContract = new Contract(CURRENT_NETWORK.FACTORY_ADDRESS, ABIS.FACTORY, USER_WALLET)
        try {
          const newLpTx = await factoryContract.createPair(tokens[0], tokens[1])
          await newLpTx.wait()
          const pairAddressnew = await factoryContract.getPair(tokens[0], tokens[1])

          resolve(pairAddressnew)
        } catch (error)
        {
          reject()
        }
      })
    },
    getLiquidity: async (context, createPair) =>
    {
      await context.dispatch('refreshFirstAccount', true)
      const firstAddress = context.getters.first_acc.address
      const tokens = context.getters.tokens
      const BLOCKCHAIN = context.getters.newProvider
      const factoryContract = new Contract(CURRENT_NETWORK.FACTORY_ADDRESS, ABIS.FACTORY, BLOCKCHAIN)

      return new Promise(async (resolve, reject) => {

          console.log(`getLiquidity -> ${tokens[0].id}: ${tokens[0].address} and ${tokens[1].id}: ${tokens[1].address}`)
        if ((tokens[0].id == CURRENT_NETWORK.BASE_TOKEN) || (tokens[1].id == CURRENT_NETWORK.BASE_TOKEN))
        {
          let pairToken = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? tokens[1] : tokens[0]
          const pairAddress = await factoryContract.getPair(pairToken.address, CURRENT_NETWORK.WETH_ADDRESS)
          // console.log(`getLiquidity getPair ${CURRENT_NETWORK.WETH_ADDRESS} ${pairToken.address}`)
          const lpContract = new Contract(pairAddress, ABIS.PAIR, BLOCKCHAIN)
          console.log(`. . .1/3. getting pair address`)

          if (pairAddress != "0x0000000000000000000000000000000000000000")
          {
            console.log(`. . .1/3. pair address`, pairAddress)
            const getReserves = await lpContract.getReserves()
            const token0Address = await lpContract.token0()
            const token1Address = await lpContract.token1()
            console.log(`. . .2/3. getReserves token0:${token0Address} token1:${token1Address} | `)
            console.log(`. . .2/3.1. names token0:${(tokens[0].address == token0Address ? tokens[0].id : tokens[0].id)}`)
            console.table({
              [token0Address]: ethers.utils.formatEther(getReserves[0]),
              [token1Address]: ethers.utils.formatEther(getReserves[1]),
            })
            const balanceTx = await lpContract.balanceOf(firstAddress)
            let parsedBalanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx)))
            const allowanceTx = await lpContract.allowance(firstAddress, CURRENT_NETWORK.ROUTER_ADDRESS)
            let parsedAllowanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(allowanceTx)))

            // console.table({token0Address, token1Address})

            context.commit(
              "updateAccountAllowance",
              {
                address: firstAddress,
                tokenAddress: pairAddress,
                allowance: parsedAllowanceTx,
              }
            )
            const wethContract = new Contract(CURRENT_NETWORK.WETH_ADDRESS, ABIS.ERC20, BLOCKCHAIN)              
            const balanceTx2 = await wethContract.balanceOf(pairAddress)
            let parsedBalanceTx2 = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx2)))
            const tokenContract = new Contract(pairToken.address, ABIS.ERC20, BLOCKCHAIN)
            const balanceTx3 = await tokenContract.balanceOf(pairAddress)
            let parsedBalanceTx3 = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx3)))
            // console.log(`weth balance in lp ${parsedBalanceTx2}` )
            // console.log(`token balance in lp ${parsedBalanceTx3} ${pairToken.id}` )

            let lps = context.getters.lps
            let newLp = {
              token0Reserve: parsedBalanceTx2, 
              token1Reserve: parsedBalanceTx3, 
              token0: tokens[0].address, 
              token1: tokens[1].address, 
              balance: parsedBalanceTx,
              address: pairAddress,
            }
            context.commit('addLp', newLp)

            resolve(newLp)
          } else {



            console.log(`. . .1/3. pair address doesnt exist | createPair: `+(createPair ? 'true' : 'false'))
            // console.log("createPair", createPair ? 'true' : 'false')
            if (createPair)
            {
              try {
                // console.log('handleNullPairETH', pairToken.address)
                let newLp = await context.dispatch('handleNullPairETH', pairToken.address)
                resolve(newLp)
              } catch(error)
              {
                reject("pair doesnt exists and failed to create createPair")
              }
            }
            reject("pair doesnt exists, createPair:"+ (createPair ? 'true' : 'false'))



          }
        } else {
          const pairAddress = await factoryContract.getPair(tokens[0].address, tokens[1].address)
          const lpContract = new Contract(pairAddress, ABIS.PAIR, BLOCKCHAIN)

          if (pairAddress != "0x0000000000000000000000000000000000000000")
          {
            console.log(`. . .1/3. pair address: ${pairAddress}`)
            // console.log("pair exists", pairAddress)
            const balanceTx = await lpContract.balanceOf(firstAddress)
            let parsedBalanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx)))
            let lps = context.getters.lps

            const token0Contract = new Contract(tokens[0].address, ABIS.ERC20, BLOCKCHAIN)              
            const balanceTx2 = await token0Contract.balanceOf(pairAddress)
            let parsedBalanceTx2 = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx2)))
            const token1Contract = new Contract(tokens[1].address, ABIS.ERC20, BLOCKCHAIN)
            const balanceTx3 = await token1Contract.balanceOf(pairAddress)
            let parsedBalanceTx3 = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx3)))


            const parsedWithDecimals = fixBTCDecimalsMul(tokens,
              [
                ethers.utils.formatEther(balanceTx2),
                ethers.utils.formatEther(balanceTx3),
              ]
            )

            const token0Address = await lpContract.token0()
            const token1Address = await lpContract.token1()
            console.log(`. . .2/3. getReserves token0:${token0Address} token1:${token1Address} `)
            console.table({
              [token0Address]: (parsedWithDecimals[0].toFixed(17)),
              [token1Address]: (parsedWithDecimals[1].toFixed(17)),
            })

            let newLp = {
              token0: tokens[0].address, 
              token1: tokens[1].address, 
              token0balance: parsedWithDecimals[0], 
              token1balance: parsedWithDecimals[1], 
              balance: parsedBalanceTx,
              address: pairAddress,
            }
            context.commit('addLp', newLp)

            // console.log("token0 balance", parsedBalanceTx2)
            // console.log("token1 balance", parsedBalanceTx3)
            // console.log("** ** ** token0 balance  **  **", parsedWithDecimals[0])
            // console.log("** ** ** token0 balance  **  **", parsedWithDecimals[1])

            resolve(newLp)
          } else {
            console.log(`. . .1/3. pair address doesnt exist | createPair: `+(createPair ? 'true' : 'false'))
            // console.log("createPair", createPair ? 'true' : 'false')
            if (createPair)
            {
              try {
                // console.log('handleNullPair', [tokens[0].address, tokens[1].address])
                let newLp = await context.dispatch('handleNullPair', [tokens[0].address, tokens[1].address])
                resolve(newLp)
              } catch(error)
              {
                reject("pair doesnt exists and failed to create createPair")
              }
            }
            reject("pair doesnt exists, createPair:"+ (createPair ? 'true' : 'false'))
          }
        }
      })
    },

    getLPPrice: async (context) =>
    {
      await context.dispatch('refreshFirstAccount')
      const firstAddress = context.getters.first_acc.address
      const tokens = context.getters.tokens
      const BLOCKCHAIN = context.getters.newProvider
      const factoryContract = new Contract(CURRENT_NETWORK.FACTORY_ADDRESS, ABIS.FACTORY, BLOCKCHAIN)

      return new Promise(async (resolve, reject) => {

        if ((tokens[0].id == CURRENT_NETWORK.BASE_TOKEN) || (tokens[1].id == CURRENT_NETWORK.BASE_TOKEN))
        {
          let pairToken = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? tokens[1] : tokens[0]
          const pairAddress = await factoryContract.getPair(pairToken.address, CURRENT_NETWORK.WETH_ADDRESS)
          const lpContract = new Contract(pairAddress, ABIS.PAIR, BLOCKCHAIN)
          // console.log(`*getting pair address. . .`)

          if (pairAddress != "0x0000000000000000000000000000000000000000")
          {
            // console.log("pair exists", pairAddress)
            const getReserves = await lpContract.getReserves()
            console.table({
              token0: ethers.utils.formatEther(getReserves[0]),
              token1: ethers.utils.formatEther(getReserves[1]),
            })
            const balanceTx = await lpContract.balanceOf(firstAddress)
            let parsedBalanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx)))
            const allowanceTx = await lpContract.allowance(firstAddress, CURRENT_NETWORK.ROUTER_ADDRESS)
            let parsedAllowanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(allowanceTx)))
            context.commit(
              "updateAccountAllowance",
              {
                address: firstAddress,
                tokenAddress: pairAddress,
                allowance: parsedAllowanceTx,
              }
            )
            const wethContract = new Contract(CURRENT_NETWORK.WETH_ADDRESS, ABIS.ERC20, BLOCKCHAIN)              
            const balanceTx2 = await wethContract.balanceOf(pairAddress)
            let parsedBalanceTx2 = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx2)))
            const tokenContract = new Contract(pairToken.address, ABIS.ERC20, BLOCKCHAIN)
            const balanceTx3 = await tokenContract.balanceOf(pairAddress)
            let parsedBalanceTx3 = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx3)))
            // console.log(`weth balance in lp ${parsedBalanceTx2}` )
            // console.log(`token balance in lp ${parsedBalanceTx3} ${pairToken.id}` )

            let lps = context.getters.lps
            let newLp = {
              token0Reserve: parsedBalanceTx2, 
              token1Reserve: parsedBalanceTx3, 
              token0: tokens[0].address, 
              token1: tokens[1].address, 
              balance: parsedBalanceTx,
              address: pairAddress,
            }
            context.commit('addLp', newLp)

            resolve(newLp)
          } else {
            reject("pair doesnt exists")
            // try {
            //   let newLp = await context.dispatch('handleNullPairETH', pairToken.address)
            //   resolve(newLp)
            // } catch(error)
            // {
            //   reject()
            // }
          }
        } else {
          const pairAddress = await factoryContract.getPair(tokens[0].address, tokens[1].address)
          const lpContract = new Contract(pairAddress, ABIS.ERC20, BLOCKCHAIN)

          if (pairAddress != "0x0000000000000000000000000000000000000000")
          {
            // console.log("pair exists", pairAddress)
            const balanceTx = await lpContract.balanceOf(firstAddress)
            let parsedBalanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx)))
            let lps = context.getters.lps
            let newLp = {
              token0: tokens[0].address, 
              token1: tokens[1].address, 
              balance: parsedBalanceTx,
              address: pairAddress,
            }
            context.commit('addLp', newLp)

            const token0Contract = new Contract(tokens[0].address, ABIS.ERC20, BLOCKCHAIN)              
            const balanceTx2 = await token0Contract.balanceOf(pairAddress)
            let parsedBalanceTx2 = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx2)))
            const token1Contract = new Contract(tokens[1].address, ABIS.ERC20, BLOCKCHAIN)
            const balanceTx3 = await token1Contract.balanceOf(pairAddress)
            let parsedBalanceTx3 = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx3)))
            // console.log("token0 balance", parsedBalanceTx2)
            // console.log("token1 balance", parsedBalanceTx3)

            resolve(newLp)
          } else {
            reject("pair doesnt exists")
            // try {
            //   let newLp = await context.dispatch('handleNullPair', [tokens[0].address, tokens[1].address])
            //   resolve(newLp)
            // } catch(error)
            // {
            //   reject()
            // }
          }
        }
      })
    },


    removeLiquidity: async (context, tradeData) =>
    {
      let firstAddress = context.getters.first_acc.address
      let tokens = context.getters.tokens

      return new Promise(async (resolve, reject) => {
        let newprovider = new ethers.providers.JsonRpcProvider(CURRENT_NETWORK.RPC_URL)
        const provider2 = new ethers.providers.Web3Provider(context.getters.eth);
        const zigner = await provider2.getSigner()
        let aSigner = await newprovider.getSigner()
        const routerContract = new Contract(CURRENT_NETWORK.ROUTER_ADDRESS, ABIS.ROUTER, zigner)
        let TOKEN_CONTRACT_ADDRESS = tokens[0].address
        const daiContract = new Contract(
            TOKEN_CONTRACT_ADDRESS,
            [
                'function approve(address spender, uint256 amount) external returns (bool)'
            ],
            zigner
        )

        let makeATrade = false



        // if ( tokens[0].id == CURRENT_NETWORK.BASE_TOKEN )
        // {
        //   makeATrade = true
        //   console.log("same base token");
        // } else {
        //   const approveTx = await daiContract.approve(
        //       CURRENT_NETWORK.ROUTER_ADDRESS,
        //       ethers.utils.parseEther(tradeData.token0amount)
        //   );
        //   let reciept = await approveTx.wait();
        //   console.log("approveTx");
        //   console.log(reciept);
        // }



        let liquidityslipped = ethers.utils.parseEther((tradeData.liquidity * (tradeData.slippage / 100)).toString())
        let liquidity = ethers.utils.parseEther((tradeData.liquidity).toString())
        let token0amount = ethers.utils.parseEther((tradeData.token0amount).toString())
        let token0amountslipped = ethers.utils.parseEther((tradeData.token0amount * (tradeData.slippage / 100)).toFixed(17))
        let token1amountslipped = ethers.utils.parseEther((tradeData.token1amount * (tradeData.slippage / 100)).toFixed(17))
        let token1amount = ethers.utils.parseEther((tradeData.token1amount).toString())
        let dueDate2 = parseInt(Date.now() / 1000) + 1800
        console.table(
          {
            liq:(tradeData.liquidity * (tradeData.slippage / 100)),
            token0:(tradeData.token0amount * (tradeData.slippage / 100)),
            token1:(tradeData.token1amount * (tradeData.slippage / 100)),
          }
        )



        // if (tradeData.token0amount && tradeData.token1amount)
        {
          if ((tokens[0].id == CURRENT_NETWORK.BASE_TOKEN) || (tokens[1].id == CURRENT_NETWORK.BASE_TOKEN))
          {
            let pairToken = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? tokens[1] : tokens[0]
            let tokenAmount = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? token1amount : token0amount
            let tokenAmountslipped = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? token1amountslipped : token0amountslipped
            let wethAmount = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? token0amount : token1amount
            let wethAmountslipped = tokens[0].id == CURRENT_NETWORK.BASE_TOKEN ? token0amountslipped : token1amountslipped

            let theerror = null

            let args = {
                token: pairToken.address,
                liquidity: liquidityslipped,
                amountTokenMin: tokenAmountslipped,
                amountETHMin: wethAmountslipped,
                to: firstAddress,
                deadline: dueDate2,
              }
              // console.log(tradeData, (tradeData.liquidity * (tradeData.slippage / 100)))
              // address token,
              //   uint liquidity,
              //   uint amountTokenMin,
              //   uint amountETHMin,
              // address to,
              //   uint deadline
            // console.log("let theerror = null")

            // pair.approve(pair_address, lp_balance, {'from':accounts[0]})

            // pair.transferFrom(accounts[0], pair_address, lp_balance, {'from': pair_address})

            // tx = pair.burn(accounts[0], {'from': pair_address})
                
            // interface.IWETH(router.CURRENT_NETWORK.WETH_ADDRESS()).withdraw(tx.events['Burn']['amount1'], {'from':accounts[0]})


            const factoryContract = new Contract(CURRENT_NETWORK.FACTORY_ADDRESS, ABIS.FACTORY, zigner)
            const pairAddress = await factoryContract.getPair(tokens[0].address, tokens[1].address)
            const lpContract = new Contract(
                pairAddress,
                [
                    'function approve(address spender, uint256 amount) external returns (bool)',
                    'function balanceOf(address account) external pure returns (uint256)',
                ],
                zigner
            )
            // console.log("factory")
            // console.log(factoryContract, CURRENT_NETWORK.ROUTER_ADDRESS, lpContract.apply, lpContract.balanceOf)




            // let response = await CONTRACT_HELPER.callMany(lpContract,
            //                   ["balanceOf"],
            //                   [firstAddress])
            // let parsedBalance = parseDecimals(parseFloat(ethers.utils.formatEther(response.balanceOf)))
            // console.log("lp balance", parsedBalance)

            // console.log("lp balance **************")




            // const balanceTx = await lpContract.balanceOf(firstAddress)
            // let parsedBalanceTx = parseDecimals(parseFloat(ethers.utils.formatEther(balanceTx)))
            // console.log("balanceTx, ethers.utils.formatEther(balanceTx)")
            // console.log(balanceTx, parsedBalanceTx, tokens)
            // let lps = context.getters.lps
            // let newLp = {
            //   token0: tokens[0].address, 
            //   token1: tokens[1].address, 
            //   balance: parsedBalanceTx,
            //   address: pairAddress,
            // }
            // context.commit('addLp', newLp)

            // resolve(newLp)

            // return
            // const approveTx = await lpContract.approve(CURRENT_NETWORK.ROUTER_ADDRESS, ethers.constants.MaxUint256.toString())

            // return

            const swapTx = await routerContract.removeLiquidityETH(
                args.token, //   ->  pairToken.address,
                args.liquidity, //   ->  liquidity,
                args.amountTokenMin, //   ->  tokenAmount,
                args.amountETHMin, //   ->  wethAmount,
                args.to, //   ->  firstAddress,
                args.deadline, //   ->  dueDate2,
            ).then(async (res) => {
              console.log("tx sent!", res);
              let aresultado = await res.wait()
              console.log("tx res", aresultado);
              await context.dispatch('refreshFirstAccount')
              resolve(aresultado)
            }).catch((err) => {
              
              // console.log("failed contract", err);
              theerror = err
              reject(theerror)
            })
            // addLiquidityETH
          } else {
            // addLiquidity
          }
        }  
      })
    },


    makeTrade: async (context, tradeData) =>
    {
      let firstAddress = context.getters.first_acc.address
      let tokens = context.getters.tokens

      return new Promise(async (resolve, reject) => {
        let newprovider = new ethers.providers.JsonRpcProvider(CURRENT_NETWORK.RPC_URL)
        const provider2 = new ethers.providers.Web3Provider(context.getters.eth);
        const zigner = await provider2.getSigner()
        let aSigner = await newprovider.getSigner()
        const routerContract = new Contract(CURRENT_NETWORK.ROUTER_ADDRESS, ABIS.ROUTER, zigner)

        const tradeDataParsedd = fixBTCDecimalsDiv(tokens, [tradeData.token0amount, tradeData.token1amount * (tradeData.slippage / 100)])

        let token0amount = ethers.utils.parseEther(tradeDataParsedd[0].toFixed(17))
        let amountInStr = tradeDataParsedd[0].toFixed(17)
        let token1amount = ethers.utils.parseEther(tradeDataParsedd[1].toFixed(17))
        let amountOutStr = tradeDataParsedd[1].toFixed(17)
        // let token0amount = ethers.utils.parseEther((tradeData.token0amount).toString())
        // let token1amount = ethers.utils.parseEther((tradeData.token1amount * (tradeData.slippage / 100)).toFixed(17))

        // let amountInStr = (tradeData.token0amount).toString()
        // let token0amount = ethers.utils.parseEther(amountInStr)
        // let amountOutStr = (tradeData.token1amount * (tradeData.slippage / 100)).toFixed(17)
        // let token1amount = ethers.utils.parseEther(amountOutStr)
        let dueDate = parseInt(Date.now() / 1000) + 1800
        console.log(`makeTrade ${tradeDataParsedd[0]} ${tokens[0].id} for ${tradeDataParsedd[1]} ${tokens[1].id} . . .`)
        console.log(`. . .1/4. trade addresses ${tokens[0].id}: ${tokens[0].address} for ${tokens[1].id}: ${tokens[1].address}`)
        console.log(`. . .1/4. trade amounts: ${tradeData.token0amount} for ${tradeData.token1amount}`)
        console.log(`. . .1/4. trade amountInStr amounts: ${amountInStr} for ${amountOutStr}`)
        console.log(". . .2/4. slippage", tradeData.slippage,"trade",tradeData.token0amount, "for", (tradeData.token1amount * (tradeData.slippage / 100)))

        if (tradeData.token0amount && tradeData.token1amount)
        {
          if (tokens[0].id == CURRENT_NETWORK.BASE_TOKEN)
          {

            if (tokens[1].id == CURRENT_NETWORK.BASE_USD_ID)
            {
// WETH -> USD
console.log(". . .3/4. trading WETH -> USD")
              try {
                const swapTx = await routerContract.swapETHForExactTokens( 
                    token1amount,
                    [CURRENT_NETWORK.WETH_ADDRESS, tokens[1].address],
                    firstAddress,
                    dueDate,
                    {value: token0amount}
                )
                let result = await swapTx.wait()
                await context.dispatch('refreshFirstAccount')
                resolve(result)
              } catch (error)
              {
                reject(error)
              }
            } else {
// WETH -> TOKEN
console.log(". . .3/4. trading WETH -> TOKEN")

              try {
                const swapTx = await routerContract.swapETHForExactTokens( 
                    token1amount,
                    [CURRENT_NETWORK.WETH_ADDRESS, CURRENT_NETWORK.BASE_USD_ADDRESS, tokens[1].address],
                    firstAddress,
                    dueDate,
                    {value: token0amount}
                )
                let result = await swapTx.wait()
                await context.dispatch('refreshFirstAccount')
                resolve(result)
              } catch (error)
              {
                reject(error)
              }
            }
          } else {

            if (tokens[1].id == CURRENT_NETWORK.BASE_TOKEN)
            {
              if (tokens[0].id == CURRENT_NETWORK.BASE_USD_ID)
              {
// USD -> WETH
console.log(". . .3/4. trading USD -> WETH")

                try {
                  const swapTx = await routerContract.swapTokensForExactETH( 
                    token1amount,
                    token0amount,
                    [tokens[0].address, CURRENT_NETWORK.WETH_ADDRESS],
                    firstAddress,
                    dueDate,
                  )
                  let result = await swapTx.wait()
                  await context.dispatch('refreshFirstAccount')
                  resolve(result)
                } catch (error)
                {
                  reject(error)
                }
              } else {
                
// TOKEN -> WETH
console.log(". . .3/4. trading TOKEN -> WETH")

                try {
                  const swapTx = await routerContract.swapTokensForExactETH( 
                    token1amount,
                    token0amount,
                    [tokens[0].address, CURRENT_NETWORK.BASE_USD_ADDRESS, CURRENT_NETWORK.WETH_ADDRESS],
                    firstAddress,
                    dueDate,
                  )
                  let result = await swapTx.wait()
                  await context.dispatch('refreshFirstAccount')
                  resolve(result)
                } catch (error)
                {
                  reject(error)
                }
              }
            } else {
              if (tokens[0].id == CURRENT_NETWORK.BASE_USD_ID)
              {
                
// USD -> TOKEN
console.log(". . .3/4. trading USD -> TOKEN")

                try {
                  const swapTx = await routerContract.swapExactTokensForTokens( 
                    token0amount,
                    token1amount,
                    [tokens[0].address, tokens[1].address],
                    firstAddress,
                    dueDate,
                  )
                  let result = await swapTx.wait()
                  await context.dispatch('refreshFirstAccount')
                  resolve(result)
                } catch (error)
                {
                  reject(error)
                }
              } else {
                
                if (tokens[1].id == CURRENT_NETWORK.BASE_USD_ID)
                {
// TOKEN -> USD
console.log(". . .3/4. trading TOKEN -> USD")

                  try {
                    const swapTx = await routerContract.swapExactTokensForTokens( 
                      token0amount,
                      token1amount,
                      [tokens[0].address, CURRENT_NETWORK.BASE_USD_ADDRESS],
                      firstAddress,
                      dueDate,
                    )
                    let result = await swapTx.wait()
                    await context.dispatch('refreshFirstAccount')
                    resolve(result)
                  } catch (error)
                  {
                    reject(error)
                  }
                } else {
// TOKEN -> TOKEN
console.log(". . .3/4. trading TOKEN -> TOKEN")

                  try {
                    const swapTx = await routerContract.swapExactTokensForTokens( 
                      token0amount,
                      token1amount,
                      [tokens[0].address, CURRENT_NETWORK.BASE_USD_ADDRESS, tokens[1].address],
                      firstAddress,
                      dueDate,
                    )
                    let result = await swapTx.wait()
                    await context.dispatch('refreshFirstAccount')
                    resolve(result)
                  } catch (error)
                  {
                    reject(error)
                  }
                }
              }
            }
          }
          resolve(true)
        }  
      })
    },


    _makeTrade: async (context, tradeData) =>
    {
      let firstAddress = context.getters.first_acc.address
      let tokens = context.getters.tokens

      return new Promise(async (resolve, reject) => {
        let newprovider = new ethers.providers.JsonRpcProvider(CURRENT_NETWORK.RPC_URL)
        const provider2 = new ethers.providers.Web3Provider(context.getters.eth);
        const zigner = await provider2.getSigner()
        let aSigner = await newprovider.getSigner()
        const routerContract = new Contract(CURRENT_NETWORK.ROUTER_ADDRESS, ABIS.ROUTER, zigner)

        const tradeDataParsedd = fixBTCDecimalsDiv(tokens, [tradeData.token0amount, tradeData.token1amount * (tradeData.slippage / 100)])

        let token0amount = tradeDataParsedd[0]
        let token1amount = tradeDataParsedd[1]
        // let token0amount = ethers.utils.parseEther((tradeData.token0amount).toString())
        // let token1amount = ethers.utils.parseEther((tradeData.token1amount * (tradeData.slippage / 100)).toFixed(17))

        let dueDate = parseInt(Date.now() / 1000) + 1800
        console.log(`trade ${tradeData.token0amount} ${tokens[0].id} for ${tradeData.token1amount} ${tokens[1].id}`)
        console.log("slippage", tradeData.slippage,"trade",tradeData.token0amount, "for", (tradeData.token1amount * (tradeData.slippage / 100)))

        if (tradeData.token0amount && tradeData.token1amount)
        {
          if (tokens[0].id == CURRENT_NETWORK.BASE_TOKEN)
          {
            try {
              const swapTx = await routerContract.swapETHForExactTokens(
                  token1amount,
                  [CURRENT_NETWORK.WETH_ADDRESS, tokens[1].address],
                  firstAddress,
                  dueDate,
                  {value: token0amount}
              )
              let result = await swapTx.wait()
              await context.dispatch('refreshFirstAccount')
              resolve(result)
            } catch (error)
            {
              reject(error)
            }
          } else {

            if (tokens[1].id == CURRENT_NETWORK.BASE_TOKEN)
            {
              try {
                const swapTx = await routerContract.swapTokensForExactETH(
                  token0amount,
                  token1amount,
                  [tokens[0].address, CURRENT_NETWORK.WETH_ADDRESS],
                  firstAddress,
                  dueDate,
                )
                let result = await swapTx.wait()
                await context.dispatch('refreshFirstAccount')
                resolve(result)
              } catch (error)
              {
                reject(error)
              }
            } else {
              try {
                const swapTx = await routerContract.swapExactTokensForTokens(
                  token0amount,
                  token1amount,
                  [tokens[0].address, CURRENT_NETWORK.WETH_ADDRESS, tokens[1].address],
                  firstAddress,
                  dueDate,
                )
                let result = await swapTx.wait()
                await context.dispatch('refreshFirstAccount')
                resolve(result)
              } catch (error)
              {
                reject(error)
              }
            }
          }
          resolve(true)
        }  
      })
    },

  },
  getters: {

    LANG(state) {
      return state.LANG[state.englishMode ? "EN" : "ES"];
    },

    dark_mode(state) {
      return state.darkMode
    },
    english_mode(state) {
      return state.englishMode
    },


    token_list(state) {
      return state.token_list;
    },
    token_listAt(state) {
      return (tokenId) => {
        return state.token_list.find((token) => token.id === tokenId);
      };
    },
    token(state) {
      return (tokenId) => {
        return state.tokens.find((token) => token.id === tokenId);
      };
    },
    tokens(state) {
      return state.tokens;
    },
    tokenAt(state) {
      return (index) => {
        return state.tokens[index];
      };
    },

    lps(state) {
      return state.lps;
    },
    lpAt(state) {
      return (key) => {
        return state.lps[key];
      };
    },

    retrieved_pool_length(state) {
      return state.retrieved_pool_length - 1
    },
    pools_length(state) {
      return Object.keys(state.pools).length
    },
    pools(state) {
      const theLength = Object.keys(state.pools).length
      if (theLength == 0) return {}
      if (theLength == 1) return {}
      const newPools = {...state.pools} 
      delete newPools[Object.keys(state.pools)[0]]
      return newPools
    },
    poolAt(state) {
      return (key) => {
        return state.pools[key]
      };
    },

    BASE_TOKEN(state) {
      return state.BASE_TOKEN
    },
    BASE_USD_ID(state) {
      return state.BASE_USD_ID
    },
    SCANNER(state) {
      return state.SCANNER
    },
    eth(state) {
      return state.ethereum
    },
    newProvider(state) {
      return new ethers.providers.Web3Provider(state.ethereum)
    },
    is_metaMask(state) {
      return state.isMetaMaskInstalled;
    },

    accs_length(state) {
      return Object.keys(state.accounts).length;
    },
    accounts(state) {
      return state.accounts;
    },
    first_acc(state) {
      if (Object.keys(state.accounts) == 0) return null
      let firstAccAddress = Object.keys(state.accounts)[0]

      return state.accounts[firstAccAddress];
    },
    account(state) {
      return (address) => {
        return state.accounts[address];
      };
    },

    memories(state) {
      return state.memories;
    },
    memory(state) {
      return (memoryId) => {
        return state.memories.find((memory) => memory.id === memoryId);
      };
    },

    articles(state) {
      return state.articles;
    },
    article(state) {
      return (articleId) => {
        return state.articles.find((article) => article.id === articleId);
      };
    },
  },
});

export default store;


    // pair.approve(pair_address, lp_balance, {'from':accounts[0]})
    // pair.transferFrom(accounts[0], pair_address, lp_balance, {'from': pair_address})
    // tx = pair.burn(accounts[0], {'from': pair_address})
    // interface.IWETH(router.CURRENT_NETWORK.WETH_ADDRESS()).withdraw(tx.events['Burn']['amount1'], {'from':accounts[0]})


/*
              const wethContract = new Contract(
                  CURRENT_NETWORK.WETH_ADDRESS,
                  [
                      'function deposit() external payable',
                      'function transfer(address to, uint value) external returns (bool)',
                  ],
                  zigner
              )
              // await wethContract.deposit({value: ethers.utils.parseEther("1").toString()})
              // await wethContract.transfer(pairAddress, ethers.utils.parseEther("0.1").toString())

              const tokenContract = new Contract(
                  pairToken.address,
                  [
                      'function deposit() external payable',
                      'function transfer(address to, uint value) external returns (bool)',
                  ],
                  zigner
              )
              // await tokenContract.deposit({value: ethers.utils.parseEther("1").toString()})
              // await tokenContract.transfer(pairAddress, ethers.utils.parseEther("0.1").toString())
*/
              /*
              // Acccounts now exposed
              console.log(ethers.utils.parseUnits("1001", 'wei'))
              console.log(ethers.utils.parseUnits("1001", 'wei').toHexString())
              console.log(ethers.utils.parseUnits("1001", 'wei').toString())
              const params = [{
                  from: firstAddress,
                  to: pairAddress,
                  value: ethers.utils.parseEther("1").toString(),
                  value: "1000",
                  // value: ethers.utils.parseUnits("1001", 'wei').toHexString()
              }];

              const transactionHash = await provider2.send('eth_sendTransaction', params)
              console.log('transactionHash is ' + transactionHash);
              */

              /*

              let tx = {
                  to: pairAddress,
                  // Convert currency unit from ether to wei
                  value: "1000",
                  value: 1000,
                  value: ethers.utils.formatEther("1001").toString(),
                  // value: ethers.utils.parseEther("1")
              }
              // Send a transaction
              console.log("pair exists", tx, "tx ********")
              provider2.sendTransaction(tx)
              .then((txObj) => {
                  console.log('txHash', txObj.hash)
                  // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
                  // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
              })
              .catch((err) => {
                  console.log('sendTransaction err', err)
                  // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
                  // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
              })*/
