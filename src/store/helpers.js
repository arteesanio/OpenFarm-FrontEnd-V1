import { Contract, providers, utils } from "ethers";


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
  if (typeof x.toString == "function" && x.toString() ==
      "115792089237316195423570985008687907853269984665640564039457.584007913129639935")
    { return 666.666 }
  if (x == 0) return 0
  if (x < 0.00001)
  {
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