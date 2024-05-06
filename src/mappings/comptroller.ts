import { log } from '@graphprotocol/graph-ts'
import { MarketListed as MarketListedEvent } from '../types/Comptroller/Comptroller'
import { Comptroller, Market, Token } from '../types/schema'
import { CToken as CTokenTemplate } from '../types/templates'
import { ZERO_BI } from '../utils/constants'
import { fetchUnderlying } from '../utils/ctoken'
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from '../utils/token'

export function handleMarketListed(event: MarketListedEvent): void {
  const address = event.address.toHexString()

  let comptroller = Comptroller.load(address)
  if (comptroller === null) {
    comptroller = new Comptroller(address)
    comptroller.marketCount = ZERO_BI
  }

  let marketAddress = event.params.cToken
  const market = new Market(marketAddress.toHexString()) as Market

  const underlyingAddress = fetchUnderlying(marketAddress)
  let underlying = Token.load(underlyingAddress.toHexString())
  if (underlying === null) {
    underlying = new Token(underlyingAddress.toHexString())
    underlying.symbol = fetchTokenSymbol(underlyingAddress)
    underlying.name = fetchTokenName(underlyingAddress)

    const decimals = fetchTokenDecimals(underlyingAddress)
    if (decimals === null) {
      log.debug('decimal for underlying token is 0 or null', [])
      return
    }
    underlying.decimals = decimals
    underlying.txCount = ZERO_BI
  }

  market.createdAtTimestamp = event.block.timestamp
  market.createdAtBlockNumber = event.block.number
  market.underlying = underlying.id
  market.txCount = ZERO_BI

  market.save()
  CTokenTemplate.create(marketAddress)
  underlying.save()
  comptroller.save()
}
