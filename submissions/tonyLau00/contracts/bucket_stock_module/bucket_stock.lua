BucketStock = {
    Version = "0.0.1-hackathon",
    Initialized = false,
    State = {
        YieldBetProcess = BucketStock.State.YieldBetProcess or id,
        Stocks = BucketStock.State.Stocks or {}
    }
}

function BucketStock.init()
    BucketStock.Initialized = true

    Handlers.add('AddStock', 'AddStock', function(msg)
        if msg.from ~= BucketStock.State.YieldBetProcess then
            return false, "Unauthorized"
        end
        
        local stock = msg.stock
        if not stock or type(stock) ~= 'string' then
            return false, "Invalid stock"
        end
        if BucketStock.State.Stocks[stock] then
            return false, "Stock already exists"
        end
        -- fields: user_process, amount
        BucketStock.State.Stocks[stock] = {}
        return true
    end)

    Handlers.add('UserBurnStock', 'UserBurnStock', function(msg)
        if msg.from ~= BucketStock.State.YieldBetProcess then
            return false, "Unauthorized"
        end

        local stock = msg.stock
        local user_process = msg.user_process
        local amount = msg.amount
        if not stock or type(stock) ~= 'string' then
            return false, "Invalid stock"
        end
        if not user_process or type(user_process) ~= 'string' then
            return false, "Invalid user_process"
        end
        if not BucketStock.State.Stocks[stock] then
            return false, "Stock does not exist"
        end
        local user_data = BucketStock.State.Stocks[stock][user_process]
        if not user_data then
            return false, "User process has no stock"
        end
        -- burn the stock
        if user_data.amount < amount then
            return false, "Insufficient share of " .. stock
        end
        BucketStock.State.Stocks[stock][user_process] = {
            amount = user_data.amount - amount
        }
        return true
    end)

    Handlers.add('UserMintStock', 'UserMintStock', function(msg)
        if msg.from ~= BucketStock.State.YieldBetProcess then
            return false, "Unauthorized"
        end

        local stock = msg.stock
        local user_process = msg.user_process
        local amount = msg.amount
        if not stock or type(stock) ~= 'string' then
            return false, "Invalid stock"
        end
        if not user_process or type(user_process) ~= 'string' then
            return false, "Invalid user_process"
        end
        if not BucketStock.State.Stocks[stock] then
            return false, "Stock does not exist"
        end
        local user_data = BucketStock.State.Stocks[stock][user_process]
        if not user_data then
            user_data = { amount = 0 }
        end
        -- mint the stock (add the entry)
        BucketStock.State.Stocks[stock][user_process] = {
            amount = user_data.amount + amount
        }
        return true
    end)


    Handlers.add('GetPortfolio', 'GetPortfolio', function(msg)
        local user_process = msg.user_process
        if not user_process or type(user_process) ~= 'string' then
            return false, "Invalid user_process"
        end
        local portfolio = {}
        for stock, users in pairs(BucketStock.State.Stocks) do
            local user_data = users[user_process]
            if user_data then
                portfolio[stock] = user_data.amount
            end
        end
        send({
            target = msg.from,
            data = json.encode(portfolio)
        })
        return true
    end)

    return true
end

if not BucketStock.Initialized then
    BucketStock.init()
end