import { Contract, providers, utils } from "ethers";


export const parseTradeDataTokenAmounts = (_tokens, _tradeData) =>
{
  // console.log("_tradeData***")
  // console.log(_tradeData)
  // console.log(_tokens)
  // console.log(_tokens[0].id)
  // console.log(_tokens[1].id)
  let tradeData = {..._tradeData}

  if (_tokens[0].id == "BTC")
  {
    tradeData.token0amount = parseFloat(tradeData.token0amount) / (10 ** 10)
  }
  if (_tokens[1].id == "BTC")
  {
    tradeData.token1amount = parseFloat(tradeData.token1amount) / (10 ** 10)
  }
  return {
    token0amount: tradeData.token0amount + "",
    token1amount: tradeData.token1amount + "",
  }
};
export const fixBTCDecimalsMul = (_tokens, _tradeData) =>
{
  // console.log("* * * fixBTCDecimalsMul * * *")
  // console.log(_tradeData)
  // console.log(_tokens)
  // console.log(_tokens[0].id)
  // console.log(_tokens[1].id)
  let tradeData = [..._tradeData]

  if (_tokens[0].id == "BTC")
  {
    // console.log('_tokens[0].id == "BTC"')
    tradeData[0] = parseFloat(_tradeData[0]) * (10 ** 10)
  }
  if (_tokens[1].id == "BTC")
  {
    // console.log('_tokens[1].id == "BTC"')
    tradeData[1] = parseFloat(_tradeData[1]) * (10 ** 10)
  }
  // console.log("_tradeData***")
  // console.log("* * * fixBTCDecimalsMul tradeData * * *")
  // console.log(tradeData)
  // console.log("_tradeData***")
  return [
   tradeData[0],
   tradeData[1],
  ]
};
export const fixBTCDecimalsDiv = (_tokens, _tradeData) =>
{
  // console.log("_tradeData***")
  // console.log(_tradeData)
  // console.log(_tokens)
  // console.log(_tokens[0].id)
  // console.log(_tokens[1].id)
  let tradeData = [..._tradeData]

  if (_tokens[0].id == "BTC")
  {
    tradeData[0] = parseFloat(_tradeData[0]) / (10 ** 10)
  }
  if (_tokens[1].id == "BTC")
  {
    tradeData[1] = parseFloat(_tradeData[1]) / (10 ** 10)
  }
  // console.log("_tradeData***")
  // console.log(_tradeData)
  // console.log("_tradeData***")
  return [
   parseFloat(tradeData[0]),
   parseFloat(tradeData[1]),
  ]
};
export const formatTradeDataTokenAmounts = (_tokens, _tradeData) =>
{
  // console.log("_tradeData***")
  // console.log(_tradeData)
  // console.log(_tokens)
  // console.log(_tokens[0].id)
  // console.log(_tokens[1].id)
  let tradeData = {..._tradeData}

  if (_tokens[0].id == "BTC")
  {
    tradeData.token0amount = parseFloat(tradeData.token0amount) * (10 ** 10)
  }
  if (_tokens[1].id == "BTC")
  {
    tradeData.token1amount = parseFloat(tradeData.token1amount) * (10 ** 10)
  }
  return {
    token0amount: tradeData.token0amount + "",
    token1amount: tradeData.token1amount + "",
  }
};
export const shortAddress = (address) =>
{
  return address.substr(0,5)+"..."+address.substr(address.length-3,address.length)
};
export const shortAddressSpaced = (address) =>
{
  return (address.substr(0,5)+"..."+address.substr(address.length-3,address.length) ).split('').join(' ')
};

export const ERROR_HELPER = {
  handleError: (tx, error) =>
  {
    if (!error) return "undefined error"
    if (typeof error == "string") return error
    if (!error.code) return "undefined data"
    switch (error.code)
    {
      case -32603:
        switch (tx.action)
        {
          case "makeTrade":
            switch (error.data.message)
            {
              case "execution reverted: ds-math-sub-underflow":
                return "high price impact, \nSETTINGS -> MARGIN OF ERROR"
              case "execution reverted: UniswapV2Router: EXCESSIVE_INPUT_AMOUNT":
                return "flawed exchange rate, \nSETTINGS -> MARGIN OF ERROR"
              case "execution reverted: FarmController: EXCESSIVE_INPUT_AMOUNT":
                return "flawed exchange rate, \nSETTINGS -> MARGIN OF ERROR"
              default:
                return error.data.message
            }
          case "addLiquidity":
            switch (error.data.message)
            {
              case "execution reverted: UniswapV2Router: INSUFFICIENT_A_AMOUNT":
                return "flawed exchange rate (from), \nSETTINGS -> MARGIN OF ERROR"
              case "execution reverted: UniswapV2Router: INSUFFICIENT_B_AMOUNT":
              case "execution reverted: FarmController: INSUFFICIENT_A_AMOUNT":
                return "flawed exchange rate (from), \nSETTINGS -> MARGIN OF ERROR"
              case "execution reverted: FarmController: INSUFFICIENT_B_AMOUNT":
                return "flawed exchange rate (to), \nSETTINGS -> MARGIN OF ERROR"
              default:
                return error.data.message
            }
          case "createPair":
            return error.data.message
          case "getLiquidity":
            return error.data.message
          case "approveToRouter":
            return error.data.message
        }
      break;
      case 4001:
        return "user rejected tx"
      break;
      default:
        return "undefined code"
      break;
    }
  },
};

export const CONTRACT_HELPER = {
	"callMany": async (contract, methodNames, args, signer = null) => {
		let response = {}

		for (var i = 0; i < methodNames.length; ++i)
		{
			let aResult = await contract[methodNames[i]].apply(this, args)
			response[methodNames[i]] = aResult
		}

		return response
	},
};

export const isMetaMaskInstalled = () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
};

export const parseDecimals = (x) => {
  if (typeof x.toString == "function" &&
      (
        x > "115792089237316195423570985008687907853269984665640000000000" || 
        x.toString() == "1.157920892373162e+59"
      )
     )
    { return 666.666 }
  if (x == 0) return 0
  if (x < 0.000001)
  {
    return 0
  }
  if (x < 0.00001)
  {
    console.log("*number* TOO LOW", x)
    return x.toFixed(8)
  }
  if (x < 0.0001)
  {
    return x.toFixed(7)
  }
  if (x < 0.001)
  {
    return x.toFixed(6)
  }
  if (x < 0.01)
  {
    return x.toFixed(5)
  }
  if (x < 0.1)
  {
    return x.toFixed(4)
  }
  if (x < 1)
  {
    return x.toFixed(3)
  }
  if (x < 50)
  {
    return x.toFixed(2)
  }
  if (x < 100)
  {
    return x.toFixed(1)
  }
  return parseInt(x)
};