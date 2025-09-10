Tiles = Tiles or {}
LastTileId = LastTileId or -1
TILE_W = 2048

Handlers.add("STEP", "STEP", function (msg)
  -- 1) 计算下一个分片 ID 与偏移
  local nextId = LastTileId + 1
  local offsetX = nextId * TILE_W

  -- 2) 生成分片内容（建议：生成矢量/程序化 JSON，体积更小）
  local tilePayload = {
    id = nextId,
    offsetX = offsetX,
    seed = msg.Tags["Seed"] or tostring(math.random(1,1e9)),
    meta = { createdBy = msg.From, createdAt = ao.now }
  }

  -- 3) 上链存储分片数据（写入 Data-Item，返回 TxID）
  -- 具体可用 Assignables/Assignments 桥接写入，或由前端先上传再把 Tx 传进来
  local tileDataJson = json.encode(tilePayload)
  local txId = persist_data_item(tileDataJson)  -- 需自行实现/集成

  -- 4) 更新进程状态（可重放）
  Tiles[tostring(nextId)] = { tx = txId, offsetX = offsetX }
  LastTileId = nextId

  -- 5) 回复前端
  ao.send({
    Target = msg.From,
    Action = "STEP-OK",
    Data = json.encode({
      id = nextId,
      tx = txId,
      offsetX = offsetX,
      tileWidth = TILE_W
    })
  })
end)