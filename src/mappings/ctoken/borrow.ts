import { Borrow, Market, Token } from '../../types/schema'
import { Borrow as BorrowEvent } from '../../types/templates/CToken/CToken'
import { loadAccountState, loadTransaction } from '../../utils'
import { ONE_BI } from '../../utils/constants'

export function handleBorrow(event: BorrowEvent): void {
  const marketAddress = event.address
  const market = Market.load(marketAddress.toHexString())
  if (!market) return
  market.txCount = market.txCount.plus(ONE_BI)

  const token = Token.load(market.underlying)
  if (!token) return
  token.txCount = token.txCount.plus(ONE_BI)

  const transaction = loadTransaction(event)
  const borrowId = transaction.id.toString() + '-' + event.logIndex.toString()
  const borrow = new Borrow(borrowId)
  borrow.transaction = transaction.id
  borrow.logIndex = event.logIndex
  borrow.timestamp = transaction.timestamp
  borrow.market = market.id
  borrow.token = market.underlying
  borrow.account = event.params.borrower
  borrow.amount = event.params.borrowAmount
  borrow.accountBorrows = event.params.accountBorrows

  market.save()
  token.save()
  borrow.save()

  const accountState = loadAccountState(event.params.borrower, token)
  accountState.borrowAmount = borrow.accountBorrows
  accountState.save()
}
