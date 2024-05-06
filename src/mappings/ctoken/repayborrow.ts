import { Market, RepayBorrow, Token } from '../../types/schema'
import { RepayBorrow as RepayBorrowEvent } from '../../types/templates/CToken/CToken'
import { loadAccountState, loadTransaction } from '../../utils'
import { ONE_BI } from '../../utils/constants'

export function handleRepayBorrow(event: RepayBorrowEvent): void {
  const marketAddress = event.address
  const market = Market.load(marketAddress.toHexString())
  if (!market) return
  market.txCount = market.txCount.plus(ONE_BI)

  const token = Token.load(market.underlying)
  if (!token) return
  token.txCount = token.txCount.plus(ONE_BI)

  const transaction = loadTransaction(event)
  const repayBorrowId = transaction.id.toString() + '-' + event.logIndex.toString()
  const repayBorrow = new RepayBorrow(repayBorrowId)
  repayBorrow.transaction = transaction.id
  repayBorrow.logIndex = event.logIndex
  repayBorrow.timestamp = transaction.timestamp
  repayBorrow.market = market.id
  repayBorrow.token = market.underlying
  repayBorrow.account = event.params.borrower
  repayBorrow.amount = event.params.repayAmount
  repayBorrow.accountBorrows = event.params.accountBorrows

  token.save()
  repayBorrow.save()

  let accountState = loadAccountState(event.params.borrower, token)
  accountState.borrowAmount = repayBorrow.accountBorrows
  accountState.save()
}
