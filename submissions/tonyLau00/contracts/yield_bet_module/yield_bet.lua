local json = require('json')

YieldBet = {
    Version = "0.0.1-hackathon",
    Initialized = false,
    State = {
        user_process: slippage, favorite_stocks, trade_history, order_history, 
        Users = YieldBet.State.Users or {},
        StockLastPrice = YieldBet.State.StockLastPrice or {},
        availableStocks = YieldBet.State.availableStocks or {},
        BucketStockProcess = id,
        MockUsdProcess = 'DewqFW5n913av0MEF93A2XVTa66ze1c8qqJgAHWTCmU',
        Orders = YieldBet.State.Orders or {}, -- order_id: {user_process, ticker, amount, price, side, orderType, status, timestamp, slippage}
        NextOrderId = YieldBet.State.NextOrderId or 1,
        UserOrders = YieldBet.State.UserOrders or {} -- user_process: {order_id1, order_id2, ...}
    }
}

function getUserOrders(userProcess)
        local userOrderIds = YieldBet.State.UserOrders[userProcess] or {}
        local userOrders = {}
        for _, orderId in ipairs(userOrderIds) do
            local order = YieldBet.State.Orders[orderId]
            if order then
                userOrders[orderId] = order
            end
        end
        return userOrders
    end
    

function _settleOrder(orderId)
    print('Settling order: ' .. tostring(orderId))
    -- TODO: YieldBet.State.Order[orderId] supposed that the orderId matches the index in Orders table
    local order = YieldBet.State.Orders[orderId]
    if not order or order.status ~= 'pending' then
        return false, "Order not found or not pending"
    end

    local currentPrice = YieldBet.State.StockLastPrice[order.ticker]
    if not currentPrice then
        send({
            target = order.user_process,
            success = false,
            error = "No current price available for " .. order.ticker
        })
        return false, "No current price available"
    end

    local executionPrice = order.price
    
    -- For limit orders, check if the order can be executed
    if order.orderType == 'limit' then
        if order.side == 'buy' and currentPrice > order.price then
            send({
                target = order.user_process,
                success = false,
                error = "Buy limit order price too low. Current: " .. currentPrice .. ", Limit: " .. order.price
            })
            return false, "Price condition not met"
        elseif order.side == 'sell' and currentPrice < order.price then
            send({
                target = order.user_process,
                success = false,
                error = "Sell limit order price too high. Current: " .. currentPrice .. ", Limit: " .. order.price
            })
            return false, "Price condition not met"
        end
        executionPrice = order.price
    else
        -- Market order uses current price with slippage already applied
        executionPrice = order.price
    end

    local totalCost = order.amount * executionPrice
    
    -- Calculate 0.1% fee
    local feeRate = 0.001 -- 0.1%
    local stockFee = order.amount * feeRate
    local moneyFee = totalCost * feeRate
    
    -- Net amounts after fee deduction
    local netStockAmount = order.amount - stockFee
    local netMoneyAmount = totalCost - moneyFee

    if order.side == 'buy' then
        -- For buy orders, USD is already transferred to contract via Credit-Notice
        -- Add stock to user's bucket (minus fee)
        send({
            target = YieldBet.State.BucketStockProcess,
            action = 'UserMintStock',
            user_process = order.user_process,
            stock = order.ticker,
            amount = netStockAmount
        })
    else
        -- Sell: remove stock from user and transfer USD (minus fee)
        send({
            target = YieldBet.State.BucketStockProcess,
            action = 'UserBurnStock',
            user_process = order.user_process,
            stock = order.ticker,
            amount = order.amount -- burn full amount from user
        })

        -- Transfer USD to user (minus fee)
        send({
            target = YieldBet.State.MockUsdProcess,
            action = 'Transfer',
            tags = {
                recipient = order.user_process,
                quantity = tostring(math.floor(netMoneyAmount))
            }
        })
    end

    -- Update order status
    order.status = 'filled'
    order.executionPrice = executionPrice
    order.executionTime = os.time()
    order.totalCost = totalCost
    order.stockFee = stockFee
    order.moneyFee = moneyFee
    order.netStockAmount = netStockAmount
    order.netMoneyAmount = netMoneyAmount

    send({
        target = order.user_process,
        success = true,
        orderId = orderId,
        executionPrice = executionPrice,
        totalCost = totalCost,
        stockFee = stockFee,
        moneyFee = moneyFee,
        netStockAmount = netStockAmount,
        netMoneyAmount = netMoneyAmount,
        message = "Order settled successfully"
    })

    return true
end

function getOrder(orderId)
    return YieldBet.State.Orders[orderId]
end

function YieldBet.init()
    YieldBet.Initialized = true

    Handlers.add('RegisterStock', 'RegisterStock', function(msg)
        print('Received RegisterStock from ' .. msg.from)
        if msg.from ~= id then
            return false, "Unauthorized"
        end

        local stock = string.upper(msg.stock)
        if not stock or type(stock) ~= 'string' then
            return false, "Invalid stock"
        end
        if YieldBet.State.availableStocks[stock] then
            return false, "Stock already registered"
        end
        YieldBet.State.availableStocks[stock] = true

        send({
            target = YieldBet.State.BucketStockProcess,
            action = 'AddStock',
            stock = stock
        })
        return true
    end)

    Handlers.add('CreateOrder', 'CreateOrder', function(msg) 
        local user_process = msg.from
        local OrderType = msg.orderType
        local Ticker = string.upper(msg.ticker or "")
        local Amount = tonumber(msg.amount)
        local Price = tonumber(msg.price)
        local Side = string.lower(msg.side or "")
        local slippage = tonumber(msg.slippage) or 0.001 -- default 0.1% slippage

        -- CreateOrder is only for sell orders
        if Side ~= 'sell' then
            send({
                target = user_process,
                action = 'CreateOrderResponse',
                success = false,
                error = "CreateOrder action is only for sell orders. Buy orders are created via USD transfer."
            })
            return
        end

        -- Validation
        if not OrderType or (OrderType ~= 'limit' and OrderType ~= 'market') then
            send({
                target = user_process,
                action = 'CreateOrderResponse',
                success = false,
                error = "Invalid order type. Must be 'limit' or 'market'"
            })
            return
        end

        if not Ticker or type(Ticker) ~= 'string' or not YieldBet.State.availableStocks[Ticker] then
            send({
                target = user_process,
                action = 'CreateOrderResponse',
                success = false,
                error = "Invalid ticker or stock not available"
            })
            return
        end

        if not Amount or Amount <= 0 then
            send({
                target = user_process,
                action = 'CreateOrderResponse',
                success = false,
                error = "Invalid amount. Must be positive number"
            })
            return
        end

        if OrderType == 'limit' and (not Price or Price <= 0) then
            send({
                target = user_process,
                action = 'CreateOrderResponse',
                success = false,
                error = "Limit orders require a valid price"
            })
            return
        end

        -- For market orders, use current market price with slippage
        if OrderType == 'market' then
            local currentPrice = YieldBet.State.StockLastPrice[Ticker]
            if not currentPrice then
                send({
                    target = user_process,
                    action = 'CreateOrderResponse',
                    success = false,
                    error = "No market price available for " .. Ticker
                })
                return
            end
            -- Apply slippage for sell orders
            Price = currentPrice * (1 - slippage)
        end

        -- Create sell order
        local orderId = tostring(YieldBet.State.NextOrderId)
        YieldBet.State.NextOrderId = YieldBet.State.NextOrderId + 1

        local order = {
            orderId = orderId,
            user_process = user_process,
            ticker = Ticker,
            amount = Amount,
            price = Price,
            side = Side,
            orderType = OrderType,
            status = 'pending',
            timestamp = msg.timestamp or os.time(),
            slippage = slippage
        }

        YieldBet.State.Orders[orderId] = order

        -- Track user orders
        if not YieldBet.State.UserOrders[user_process] then
            YieldBet.State.UserOrders[user_process] = {}
        end
        table.insert(YieldBet.State.UserOrders[user_process], orderId)

        -- For market orders, attempt immediate settlement
        if OrderType == 'market' then
            _settleOrder(orderId)
        end

        send({
            target = user_process,
            action = 'CreateOrderResponse',
            success = true,
            orderId = orderId,
            order = order
        })
    end)

    -- Handle buy orders via Credit-Notice when USD is transferred to the contract
    Handlers.add('Credit-Notice', 'Credit-Notice', function(msg)
        print('Received Credit-Notice from ' .. msg.from)
        -- Credit-Notice is received when someone transfers USD to this contract
        local user_process = msg.sender
        local transferAmount = tonumber(msg.quantity)
        
        print('user = ' .. user_process .. ' transferred ' .. transferAmount .. ' MockUSD')
        
        if not transferAmount or transferAmount <= 0 then
            return
        end

        -- Parse buy order details from msg.data
        local orderData = msg.data

        if not orderData or type(orderData) ~= 'table' then
            print('orderData incorrect returned')
            -- If no order data provided, treat as a simple USD deposit
            return
        end

        -- Extract buy order parameters
        -- {
        --     amount = "1",
        --     ordertype = "market",
        --     price = "0",
        --     slippage = "0.005",
        --     ticker = "AAPL"
        -- }
        local OrderType = orderData.ordertype
        local Ticker = string.upper(orderData.ticker or "")
        local Amount = tonumber(orderData.amount)
        local Price = tonumber(orderData.price)
        local slippage = tonumber(orderData.slippage) or 0.001

        -- Validation for buy order
        if not OrderType or (OrderType ~= 'limit' and OrderType ~= 'market') then
            send({
                target = user_process,
                success = false,
                data = "Invalid order type. Must be 'limit' or 'market'"
            })
            return
        end

        if not Ticker or type(Ticker) ~= 'string' or not YieldBet.State.availableStocks[Ticker] then
            send({
                target = user_process,
                success = false,
                data = "Invalid ticker or stock not available"
            })

            -- return the money back
            send({
                target = YieldBet.State.MockUsdProcess,
                action = 'Transfer',
                tags = {
                    recipient = user_process,
                    quantity = tostring(math.floor(transferAmount))
                }
            })
            return
        end

        if not Amount or Amount <= 0 then
            send({
                target = user_process,
                success = false,
                data = "Invalid amount. Must be positive number"
            })
            return
        end

        -- For market orders, use current market price with slippage
        if OrderType == 'market' then
            local currentPrice = YieldBet.State.StockLastPrice[Ticker]
            if not currentPrice then
                send({
                    target = user_process,
                    success = false,
                    data = "No market price available for " .. Ticker
                })
                return
            end
            -- Apply slippage for buy orders
            Price = currentPrice * (1 + slippage)
        elseif OrderType == 'limit' and (not Price or Price <= 0) then
            send({
                target = user_process,
                success = false,
                data = "Limit orders require a valid price"
            })
            return
        end

        -- Check if transferred amount is sufficient for the order
        local totalCost = Amount * Price
        if transferAmount < totalCost then
            send({
                target = user_process,
                success = false,
                data = "Insufficient USD transferred. Required: " .. totalCost .. ", Received: " .. transferAmount
            })

            -- return the money back
            send({
                target = YieldBet.State.MockUsdProcess,
                action = 'Transfer',
                tags = {
                    recipient = user_process,
                    quantity = tostring(math.floor(transferAmount))
                }
            })
            return
        end

        -- Create buy order
        local orderId = tostring(YieldBet.State.NextOrderId)
        YieldBet.State.NextOrderId = YieldBet.State.NextOrderId + 1

        local order = {
            orderId = orderId,
            user_process = user_process,
            ticker = Ticker,
            amount = Amount,
            price = Price,
            side = 'buy',
            orderType = OrderType,
            status = 'pending',
            timestamp = msg.timestamp or os.time(),
            slippage = slippage,
            transferredAmount = transferAmount
        }

        YieldBet.State.Orders[orderId] = order

        print('new order inserted')
        print(order)

        -- Track user orders
        if not YieldBet.State.UserOrders[user_process] then
            YieldBet.State.UserOrders[user_process] = {}
        end
        table.insert(YieldBet.State.UserOrders[user_process], orderId)

        -- For market orders, attempt immediate settlement
        if OrderType == 'market' then
            print('market order is going to settlement')
            _settleOrder(orderId)
        end
        print('fine here')

        send({
            target = user_process,
            success = true,
            orderId = orderId,
            order = order,
            message = "Buy order created successfully"
        })
        print('All done')
    end)

    Handlers.add('SettleOrder', 'SettleOrder', function(msg)
        local orderId = msg.orderId
        local user_process = msg.from

        if not orderId then
            send({
                target = user_process,
                success = false,
                error = "Order ID required"
            })
            return
        end

        local order = YieldBet.State.Orders[orderId]
        if not order then
            send({
                target = user_process,
                success = false,
                error = "Order not found"
            })
            return
        end

        if order.user_process ~= user_process then
            send({
                target = user_process,
                success = false,
                error = "Unauthorized to settle this order"
            })
            return
        end

        if order.status ~= 'pending' then
            send({
                target = user_process,
                success = false,
                error = "Order is not pending"
            })
            return
        end

        _settleOrder(orderId)
    end)

    Handlers.add('CancelOrder', 'CancelOrder', function(msg) 
        local orderId = msg.orderId
        local user_process = msg.from

        if not orderId then
            send({
                target = user_process,
                action = 'CancelOrderResponse',
                success = false,
                error = "Order ID required"
            })
            return
        end

        local order = YieldBet.State.Orders[orderId]
        if not order then
            send({
                target = user_process,
                action = 'CancelOrderResponse',
                success = false,
                error = "Order not found"
            })
            return
        end

        if order.user_process ~= user_process then
            send({
                target = user_process,
                action = 'CancelOrderResponse',
                success = false,
                error = "Unauthorized to cancel this order"
            })
            return
        end

        if order.status ~= 'pending' then
            send({
                target = user_process,
                action = 'CancelOrderResponse',
                success = false,
                error = "Order is not pending and cannot be cancelled"
            })
            return
        end

        -- Update order status
        order.status = 'cancelled'
        order.cancelledAt = os.time()

        -- For buy orders, refund the transferred USD back to user
        if order.side == 'buy' and order.transferredAmount then
            send({
                target = YieldBet.State.MockUsdProcess,
                action = 'Transfer',
                tags = {
                    recipient = order.user_process,
                    quantity = tostring(math.floor(order.transferredAmount))
                }
            })
        end

        send({
            target = user_process,
            action = 'CancelOrderResponse',
            success = true,
            orderId = orderId,
            message = "Order cancelled successfully" .. (order.side == 'buy' and " and USD refunded" or "")
        })
    end)

    Handlers.add('GetUserOrders', 'GetUserOrders', function(msg)
        local user_process = msg.from
        local userOrders = YieldBet.getUserOrders(user_process)
        
        send({
            target = user_process,
            action = 'GetUserOrdersResponse',
            success = true,
            orders = userOrders
        })
    end)

    Handlers.add('GetOrder', 'GetOrder', function(msg)
        local orderId = msg.orderId
        local user_process = msg.from
        
        if not orderId then
            send({
                target = user_process,
                action = 'GetOrderResponse',
                success = false,
                error = "Order ID required"
            })
            return
        end

        local order = getOrder(orderId)
        if not order then
            send({
                target = user_process,
                action = 'GetOrderResponse',
                success = false,
                error = "Order not found"
            })
            return
        end

        if order.user_process ~= user_process then
            send({
                target = user_process,
                action = 'GetOrderResponse',
                success = false,
                error = "Unauthorized to view this order"
            })
            return
        end

        send({
            target = user_process,
            action = 'GetOrderResponse',
            success = true,
            order = order
        })
    end)

    -- Get current market prices for all stocks
    Handlers.add('GetMarketPrices', 'GetMarketPrices', function(msg)
        send({
            target = msg.from,
            action = 'GetMarketPricesResponse',
            success = true,
            prices = YieldBet.State.StockLastPrice
        })
    end)

    -- Get available stocks
    Handlers.add('GetAvailableStocks', 'GetAvailableStocks', function(msg)
        send({
            target = msg.from,
            action = 'GetAvailableStocksResponse',
            success = true,
            stocks = YieldBet.State.availableStocks
        })
    end)


    -- https://api.polygon.io/v2/last/nbbo/AAPL?apiKey=z9EN1kD3Hz1ZUE0qCwlg9A8qElNHYIxZ
    Handlers.add('Cron', 'Cron', function(msg) 
        -- Fetch latest prices
        for stock, _ in pairs(YieldBet.State.availableStocks) do
            send({
                target = id,
                action = 'GetPrice',
                resolve = '~relay@1.0/call/~patch@1.0',
                ['relay-path'] = 'https://api.polygon.io/v2/last/nbbo/' .. stock .. '?apiKey=z9EN1kD3Hz1ZUE0qCwlg9A8qElNHYIxZ'
            })
        end

        -- Check and settle limit orders that can be executed
        for orderId, order in pairs(YieldBet.State.Orders) do
            if order.status == 'pending' and order.orderType == 'limit' then
                local currentPrice = YieldBet.State.StockLastPrice[order.ticker]
                if currentPrice then
                    local canExecute = false
                    if order.side == 'buy' and currentPrice <= order.price then
                        canExecute = true
                    elseif order.side == 'sell' and currentPrice >= order.price then
                        canExecute = true
                    end

                    if canExecute then
                        _settleOrder(orderId)
                    end
                end
            end
        end
    end)


    -- {
    --     "request_id": "b84e24636301f19f88e0dfbf9a45ed5c",
    --     "results": {
    --         "P": 127.98,
    --         "S": 7,
    --         "T": "AAPL",
    --         "X": 19,
    --         "p": 127.96,
    --         "q": 83480742,
    --         "s": 1,
    --         "t": 1617827221349730300,
    --         "x": 11,
    --         "y": 1617827221349366000,
    --         "z": 3
    --     },
    --     "status": "OK"
    -- }
    Handlers.add('GetPrice', 'GetPrice', function(msg)
        print('Received GetPrice')
        if msg.from ~= id then
            return false, "Unauthorized"
        end

        local data = json.decode(msg.body)
        if not data or not data.results or not data.results.T or not data.results.p then
            return false, "Invalid data"
        end

        local stock = string.upper(data.results.T)
        local price = (tonumber(data.results.p)  + tonumber(data.results.P)) / 2 -- average of bid and ask
        if not YieldBet.State.availableStocks[stock] then
            return false, "Stock not registered"
        end
        YieldBet.State.StockLastPrice[stock] = price
    end)

end

if not YieldBet.Initialized then
    YieldBet.init()
end