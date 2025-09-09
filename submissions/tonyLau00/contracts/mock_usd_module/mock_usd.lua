local json = require('json')

if not Balances then Balances = { [id] = 100000000000000 } end

if Name ~= 'MockUsd' then Name = 'MockUsd' end

if Ticker ~= 'COIN' then Ticker = 'COIN' end

if Denomination ~= 10 then Denomination = 10 end

if not Logo then Logo = 'SBCCXwwecBlDqRLUjb8dYABExTJXLieawf7m2aBJ-KY' end

if not MintedUsers then MintedUsers = 0 end


Handlers.add('Info', 'Info', function(msg) 
    send({
        target = msg.from,
        tags = {
            ["Name"] = Name,
            ["Ticker"] = Ticker,
            ["Logo"] = Logo,
            ["Denomination"] = tostring(Denomination)
        }
    })
end)

Handlers.add('Balance', 'Balance', function(msg)
    local bal = '0'

    -- If not recipient is provided, then return the Senders balance
    if (msg.tags.recipient) then
        if (Balances[msg.tags.recipient]) then
            bal = tostring(Balances[msg.tags.recipient])
        end
    elseif msg.tags.target and Balances[msg.tags.target] then
        bal = tostring(Balances[msg.tags.target])
    elseif Balances[msg.from] then
        bal = tostring(Balances[msg.from])
    end

    send({
        target = msg.from,
        tags = { ["Balance"] = bal, ["Ticker"] = Ticker }
    })
end)

Handlers.add('Balances', 'Balances', function(msg)
    send({
        target = msg.from,
        data = json.encode(Balances)
    })
end)

Handlers.add('Transfer', 'Transfer', function(msg)
  assert(type(msg.tags.recipient) == 'string', 'recipient is required!')
  assert(type(msg.tags.quantity) == 'string', 'quantity is required!')

  if not Balances[msg.from] then Balances[msg.from] = 0 end

  if not Balances[msg.tags.recipient] then Balances[msg.tags.recipient] = 0 end

  local qty = tonumber(msg.tags.quantity)
  assert(type(qty) == 'number', 'qty must be number')

  if Balances[msg.from] >= qty then
    Balances[msg.from] = Balances[msg.from] - qty
    Balances[msg.tags.recipient] = Balances[msg.tags.recipient] + qty

    --[[
      Only Send the notifications to the Sender and recipient
      if the Cast tag is not set on the Transfer message
    ]] --
    if not msg.tags.Cast then
      -- Debit-Notice message template, that is sent to the Sender of the transfer
      local debitNotice = {
        target = msg.from,
        action = 'Debit-Notice',
        recipient = msg.tags.recipient,
        quantity = tostring(qty),
        Data = colors.gray ..
            "You transferred " ..
            colors.blue .. msg.tags.quantity .. colors.gray .. " to " .. colors.green .. msg.tags.recipient .. colors.reset
      }
      -- Credit-Notice message template, that is sent to the recipient of the transfer
      local creditNotice = {
        target = msg.tags.recipient,
        action = 'Credit-Notice',
        Sender = msg.from,
        quantity = tostring(qty),
        Data = msg.data or '' .. colors.green .. "You received " .. colors.blue .. msg.tags.quantity .. colors.green .. " from " .. colors.green .. msg.from .. colors.reset
      }

      -- Add forwarded tags to the credit and debit notice messages
      for tagName, tagValue in pairs(msg) do
        -- tags beginning with "X-" are forwarded
        if string.sub(tagName, 1, 2) == "X-" then
          debitNotice[tagName] = tagValue
          creditNotice[tagName] = tagValue
        end
      end

      -- Send Debit-Notice and Credit-Notice
      send(debitNotice)
      send(creditNotice)
    end
  else
    send({
      target = msg.tags.from,
      tags = { ["Action"] = 'Transfer-Error', ["Error"] = 'Insufficient Balance!' }
    })
  end
end)

-- every process can mint once (1000units)
Handlers.add('Mint', 'Mint', function(msg, env)
    print('Received Mint request from ' .. msg.from)
    if Balances[msg.from] then
        print('User' .. msg.from .. ' has already minted.')
        return false, "Already minted"
    end
    if Balances[id] < 1000 then
        print('dry contract balances')
        return false, "Contract has insufficient balance"
    end
    Balances[id] = Balances[id] - 1000
    Balances[msg.from] = 1000
    MintedUsers = MintedUsers + 1

    send({
        target = msg.from,
        action = 'Mint-Notice',
        tags = { ["Quantity"] = '1000', ["Ticker"] = Ticker },
        Data = colors.gray .. "You have minted " .. colors.blue .. "1000"
    })
end)



MockYield = {
    Version = "0.0.1-hackathon",
    Initialized = false,
    State = {
        YieldBetProcess = 'vk3NioK4-tHcuh8iBz9PtcELx2LTHMRciGLXEYW8GEg',
        MockPeriod = 365 * 24 * 60 * 60, -- 1 year in seconds
        MockRate = 0.03, -- 3% yield per period
        MockStake = 10000000, -- 10 million MockUSD
        MockGainPerDay = 0, -- MockStake * MockRate / 365
        YieldNumber = 0
    }
}

function MockYield.init()
    MockYield.Initialized = true

    MockYield.State.MockRate = 0.03
    MockYield.State.MockStake = 10000000
    MockYield.State.MockGainPerDay = 0.03 * 10000000 / 365

    Handlers.add('Cron', 'Cron', function(msg)
        print('Received Cron Task')
        if not MockYield.State.YieldBetProcess then
            return false, "YieldBetProcess not set"
        end
        if msg.from ~= id then
            return false, "Unauthorized"
        end

        Balances[id] = Balances[id] - math.floor(MockYield.State.MockGainPerDay)
        if not Balances[MockYield.State.YieldBetProcess] then
            Balances[MockYield.State.YieldBetProcess] = 0
        end
        Balances[MockYield.State.YieldBetProcess] = Balances[MockYield.State.YieldBetProcess] + math.floor(MockYield.State.MockGainPerDay)
        MockYield.State.YieldNumber = MockYield.State.YieldNumber + 1

        
        -- send({
        --     target = id,
        --     action = 'Transfer',
        --     tags = {
        --         recipient = MockYield.State.YieldBetProcess,
        --         quantity = tostring(math.floor(MockYield.State.MockGainPerDay))
        --     }
        -- })
    end)
end

if not MockYield.Initialized then
    MockYield.init()
end