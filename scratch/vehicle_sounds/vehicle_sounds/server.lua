local function getPlayersInRange(src, radius)
    local targets = {}
    local srcPed = GetPlayerPed(src)
    if srcPed == 0 then return targets end
    local sx, sy, sz = table.unpack(GetEntityCoords(srcPed))
    for _, id in ipairs(GetPlayers()) do
        local pid = tonumber(id)
        if pid ~= src then
            local ped = GetPlayerPed(pid)
            if ped ~= 0 then
                local x, y, z = table.unpack(GetEntityCoords(ped))
                local dist = #(vector3(sx, sy, sz) - vector3(x, y, z))
                if dist <= (SyncRadius or 60.0) then
                    table.insert(targets, pid)
                end
            end
        end
    end
    return targets
end

RegisterNetEvent("vehSounds:sync", function(file)
    local src = source
    local targets = getPlayersInRange(src, SyncRadius or 60.0)
    for _, t in ipairs(targets) do
        TriggerClientEvent("vehSounds:play", t, file, 0.5)
    end
end)
