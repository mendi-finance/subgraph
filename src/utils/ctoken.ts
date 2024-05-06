import { Address, BigInt } from '@graphprotocol/graph-ts'

import { CToken } from '../types/Comptroller/CToken'

export function fetchUnderlying(marketAddress: Address): Address {
  const contract = CToken.bind(marketAddress)
  let underlyingValue = Address.zero()
  const underlyingResult = contract.try_underlying()
  if (!underlyingResult.reverted) {
    underlyingValue = underlyingResult.value
  }
  return underlyingValue
}
