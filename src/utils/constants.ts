import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'

import { Comptroller as ComptrollerContract } from '../types/Comptroller/Comptroller'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const COMPTROLLER_ADDRESS = '0x1b4d3b0421dDc1eB216D230Bc01527422Fb93103'

export const ZERO_BI = BigInt.fromI32(0)
export const ONE_BI = BigInt.fromI32(1)
export const ZERO_BD = BigDecimal.fromString('0')
export const ONE_BD = BigDecimal.fromString('1')
export const BI_10 = BigInt.fromI32(10)
export const BI_18 = BigInt.fromI32(18)
export const BI_1e18 = BI_10.pow(18)

export const factoryContract = ComptrollerContract.bind(Address.fromString(COMPTROLLER_ADDRESS))
