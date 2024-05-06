import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'

import { AccountState, Token, Transaction } from '../types/schema'
import { ZERO_BI } from '../utils/constants'

export function isNullEthValue(value: string): boolean {
  return value == '0x0000000000000000000000000000000000000000000000000000000000000001'
}

export function loadTransaction(event: ethereum.Event): Transaction {
  let transaction = Transaction.load(event.transaction.hash.toHexString())
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHexString())
  }
  transaction.blockNumber = event.block.number
  transaction.timestamp = event.block.timestamp
  transaction.gasUsed = BigInt.zero() //needs to be moved to transaction receipt
  transaction.gasPrice = event.transaction.gasPrice
  transaction.save()
  return transaction as Transaction
}

export function loadAccountState(account: Address, token: Token): AccountState {
  let stateId = account.toHexString() + '-' + token.id
  let state = AccountState.load(stateId)
  if (state === null) {
    state = new AccountState(stateId)
    state.account = account
    state.token = token.id
    state.lentAmount = ZERO_BI
    state.borrowAmount = ZERO_BI
    state.save()
  }

  return state as AccountState
}
