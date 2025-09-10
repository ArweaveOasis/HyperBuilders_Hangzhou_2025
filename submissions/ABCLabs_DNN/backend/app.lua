
-- ID modules --

local json = require "json"

-- seed RNG if possible
if os and os.time and math and math.randomseed then
  math.randomseed(os.time())
end

-- Pure-Lua base64 encoder (avoids dependency on luasocket/mime)
function b64_encode(data)
  local b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  return ((data:gsub('.', function(x)
      local r = ''
      local byte = x:byte()
      for i = 8, 1, -1 do
        r = r .. (byte % 2^i - byte % 2^(i-1) > 0 and '1' or '0')
      end
      return r
    end) .. '0000'):gsub('%d%d%d?%d?%d?%d?', function(x)
      if #x < 6 then return '' end
      local c = 0
      for i = 1, 6 do
        c = c * 2 + (x:sub(i,i) == '1' and 1 or 0)
      end
      return b:sub(c+1, c+1)
    end) .. ({ '', '==', '=' })[#data % 3 + 1])
end

-- AO compatible random_hex and compute_bio_hash
function random_hex(n)
  -- Generate n random bytes using math.random, then base64 encode
  local t = {}
  for i = 1, n do
    t[i] = string.char(math.random(0, 255))
  end
  local b = table.concat(t)
  return (b64_encode(b)):gsub("=", ""):sub(1, n*2)
end

-- Fallback: use a simple hash (not cryptographically secure!)
function compute_bio_hash(bioSample)
  if not bioSample then return nil end
  local s = tostring(bioSample)
  local hash = 5381
  for i = 1, #s do
    hash = ((hash << 5) + hash) + s:byte(i)
    hash = hash & 0xFFFFFFFF -- force 32bit
  end
  -- convert to 8 bytes
  local t = {}
  for i = 1, 8 do
    t[i] = string.char((hash >> ((i-1)*4)) & 0xFF)
  end
  return b64_encode(table.concat(t))
end

Users = Users or {}

Handlers.add(
  "api_auth_register", 
  Handlers.utils.hasMatchingTag("Action" , "Api_auth_register") ,
  function (Msg)
    local data = Msg.Data or {}
    local finalHash = compute_bio_hash(data)
    -- if not finalHash then
    --   if Msg.ctx and Msg.ctx.stream then Msg.reply({Data = json.encode({ success = false, error = "missing biometric data" })}) return end
    --   Msg.reply({Data = json.encode({ success = false, error = "missing biometric data" })} )
    --   return
    -- end
    -- for _,r in pairs(users) do if r.bioHash == finalHash then
    --   if Msg.ctx and Msg.ctx.stream then Msg.reply({Data = json.encode({success=true,data={dnnId=r.dnnId}})}) return end
    --    Msg.reply({Data = json.encode({ success = true, data = { dnnId = r.dnnId } })})
    --    return
    -- end end
    local dnnId = "DNN_" .. finalHash
    Users[dnnId] = { dnnId = dnnId, bioHash = finalHash, createdAt = os.time() }
    -- if Msg.ctx and Msg.ctx.stream then  Msg.reply({Data = json.encode({ success=true, data={ dnnId=dnnId } }) } )  return end
    Msg.reply({Data = json.encode({ success = true, data = { dnnId = dnnId } })})
  end
)

Handlers.add(
  "api_auth_login", 
  Handlers.utils.hasMatchingTag("Action","Api_auth_login" ),
  function (Msg)
    print(Msg)
    local data = Msg.Data or {}
    local finalHash = compute_bio_hash(data)
    -- if not finalHash then
    --   if Msg.ctx and Msg.ctx.stream then  Msg.reply({Data = json.encode({ success = false, error = "missing biometric data" })}) return end
    --   Msg.reply({Data = json.encode({ success = false, error = "missing biometric data" })}) return 
    -- end
    local found = nil
    for _, r in pairs(Users) do if r.bioHash == finalHash then found = r; break end end
    -- if not found then
    --   if Msg.ctx and Msg.ctx.stream then Msg.reply({Data = json.encode({ success = false, error = "user not found; register first" })}) return  end
    --   Msg.reply({ Data = json.encode({ success = false, error = "user not found; register first" })}) return
    -- end

    -- if Msg.ctx and Msg.ctx.stream then Msg.reply({Data = json.encode({ success = true, data = { dnnId = found.dnnId, challenge = challenge } })}) return  end
    
    if not found then Msg.reply( { Data = json.encode({ success = false, data = "identify is failed" })}) return end
    Msg.reply( { Data = json.encode({ success = true, data = { dnnId = found.dnnId } })})
  end
)

Handlers.add(
  "api_auth_verify", 
  { Action = "Api_auth_verify" },
  function (Msg)
    local data = Msg.Payload or {}
    local dnnId, bioSample, challenge = data.dnnId, data.bioSample, data.challenge
    if not dnnId or not challenge then
      if Msg.ctx and Msg.ctx.stream then Msg.reply( {Data = json.encode({ success = false, error = "missing dnnId or challenge" })}) return  end
      Msg.reply({ Data = json.encode({ success = false, error = "missing dnnId or challenge" })}) return
    end
    local user = Users[dnnId]
    if not user then
      if Msg.ctx and Msg.ctx.stream then Msg.reply({Data = json.encode({ success = false, error = "user not found" })}) return  end
      Msg.reply({Data = json.encode({ success = false, error = "user not found" })}) return
    end
    local expected = dnnId
    if not expected or expected ~= challenge then
      if Msg.ctx and Msg.ctx.stream then Msg.reply({Data=json.encode({ success = false, error = "invalid or expired challenge" })}) return  end
      Msg.reply({Data = json.encode({ success = false, error = "invalid or expired challenge" })}) return
    end
    local finalHash = compute_bio_hash(bioSample)
    if not finalHash then
      if Msg.ctx and Msg.ctx.stream then Msg.reply({Data = json.encode({ success = false, error = "missing biometric data" })}) return  end
      Msg.reply({Data = json.encode({ success = false, error = "missing biometric data" })}) return
    end
    if user.bioHash ~= finalHash then
      if Msg.ctx and Msg.ctx.stream then Msg.reply({Data = json.encode({ success = false, error = "bioHash mismatch" })}) return  end
      Msg.reply({Data = json.encode({ success = false, error = "bioHash mismatch" })}) return
    end
    -- nonces[dnnId] = nil
    local token_src = dnnId .. ":" .. tostring(os.time()) .. ":" .. random_hex(6)
    local token = b64_encode(token_src)
    if Msg.ctx and Msg.ctx.stream then Msg.reply({Data = json.encode({ success = true, data = { token = token } })}) return  end
    Msg.reply({Data = json.encode({ success = true, data = { token = token } })})
  end
)

-- Nodes modules --

Nodes = Nodes or {
  { id = "p1", title = "Chiang Mai Node", tagline = "Cozy coworking & cafes", votes = 80, image = "https://source.unsplash.com/collection/190727/800x600" },
  { id = "p2", title = "Bangkok Node", tagline = "Vibrant tech scene", votes = 120, image = "https://source.unsplash.com/collection/190728/800x600" },
}

Handlers.add(
  "api_node_list", 
  Handlers.utils.hasMatchingTag("Action", "Api_node_list"),
  function (Msg)
    Msg.reply({Data = json.encode({ success = true, data = Nodes })})
  end
)

Handlers.add(
  "api_node_create", 
  Handlers.utils.hasMatchingTag("Action", "Api_node_create"),
  function (Msg)
    local data = json.decode(Msg.Data)
    table.insert(Nodes, data)
    Msg.reply({Data = json.encode({success = true, data = "Node has be created", createdAt = os.time()})})
  end
)


-- expose some internals for main to set ao_client/aorpc_url if desired
local M = {
  Handlers = Handlers,
  set_ao = function(client, url) ao_client = client; aorpc_url = url end,
}
return M
