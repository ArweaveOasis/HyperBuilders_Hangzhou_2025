# <Project YieldBet Game>

## Introduction
This is a mock trading game building on AO called YieldBet. Each wallet could apply for 1000 mockUSD for trading here. This project use HyperBEAM relay to fetch realtime price data from polygon.io.  The MockUSD process will deposit a fixed amount of coin to the price pool of YieldBet process. User's profit come from this price pool. Let's see whose trading strategy or agent can win the entire price pool.

Currently only long position is supported.

## Quick start (Contract)
1. spawn a process named `yeild_bet_01` and do `.load bucket_stock_module/bucket_stock` & `.load yield_bet_module/yield_bet.lua` 
2. spawn another process named `mockusd_01` and do `.load mock_usd.lua` 
3. update the process id in each process
4. `mockusd_01` deposit mockUSD to the proce pool: `send({target=id, action='Cron'})` (cron is not available in hyper-aos)
5. `yield_bet_01` Register stocks to be traded, use cron to fetch price data: `send({target=id, action='Cron'})`
6. User process ask for 1000 mockUSD by: `send({target=<mockusd_01>, action='Mint'})`
7. send a buy order with order type `market`

```lua
send({
    target = '<mockusd_01>',
    action = 'Transfer',
    tags = {
        recipient = '<yield_bet_01>',
        quantity = '240'
    },
    data = {
        orderType = 'market',
        ticker = 'AAPL',
        amount = '1',
        price = '0',
        slippage = '0.005'
    }
})
```


## (Frontend)


## 联系方式
- GitHub: @username: TonyLau00
- Wallet Address: `UgGtgLe64P5N70xh3oA_JnAAAMPCglIsvdeu0RW44Z0`