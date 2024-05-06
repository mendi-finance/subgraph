import { Market, Token, Transfer } from '../../types/schema'
import { Transfer as TransferEvent } from '../../types/templates/CToken/CToken'
import { loadAccountState, loadTransaction } from '../../utils'
import { ONE_BI } from '../../utils/constants'

export function handleTransfer(event: TransferEvent): void {
  const marketAddress = event.address
  const market = Market.load(marketAddress.toHexString())
  if (!market) return
  market.txCount = market.txCount.plus(ONE_BI)

  const token = Token.load(market.underlying)
  if (!token) return
  token.txCount = token.txCount.plus(ONE_BI)

  const transaction = loadTransaction(event)
  const repayBorrowId = transaction.id.toString() + '-' + event.logIndex.toString()
  const transfer = new Transfer(repayBorrowId)
  transfer.transaction = transaction.id
  transfer.logIndex = event.logIndex
  transfer.timestamp = transaction.timestamp
  transfer.market = market.id
  transfer.token = market.underlying
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.tokenAmount = event.params.amount

  market.save()
  token.save()
  transfer.save()

  if (event.params.from !== event.address && event.params.from !== event.params.to) {
    const accountState = loadAccountState(event.params.from, token)
    accountState.lentAmount = accountState.lentAmount.minus(transfer.tokenAmount)
    accountState.save()
  }

  if (event.params.to !== event.address && event.params.from !== event.params.to) {
    const accountState = loadAccountState(event.params.to, token)
    accountState.lentAmount = accountState.lentAmount.plus(transfer.tokenAmount)
    accountState.save()
  }
}
