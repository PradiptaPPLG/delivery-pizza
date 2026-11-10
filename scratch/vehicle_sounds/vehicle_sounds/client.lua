local VehicleSounds = Config.VehicleSounds
local printedModels = {}
local lastGear = {}
local throttleReleased = {}
local burbleActive = {}

-- Simple NUI trigger
local function nuiPlay(file, vol)
    SendNUIMessage({ transactionType = "playSound", transactionFile = file, transactionVolume = vol or 0.5 })
end

-- Sound + sync helpers

local function playTwoStep(modelName, cfg)
    if not cfg then return end

    local file = cfg.two_step or cfg.backfire -- fallback to backfire if two_step isn't defined
    if not file then return end

    TriggerServerEvent("vehSounds:sync", file)
    nuiPlay(file, (cfg.volumes and cfg.volumes.two_step) or (cfg.volumes and cfg.volumes.backfire) or 0.6)
end

local function playDSG(modelName, cfg)
    if not cfg or not cfg.dsg or #cfg.dsg == 0 then return end
    local idx = math.random(1, #cfg.dsg)
    local file = cfg.dsg[idx]
    TriggerServerEvent("vehSounds:sync", file)
    nuiPlay(file, (cfg.volumes and cfg.volumes.dsg) or 0.5)
end

local function playBackfire(modelName, cfg)
    if not cfg or not cfg.backfire then return end
    TriggerServerEvent("vehSounds:sync", cfg.backfire)
    nuiPlay(cfg.backfire, (cfg.volumes and cfg.volumes.backfire) or 0.5)
end

local function playBurble(modelName, cfg)
    if not cfg or not cfg.burble then return end
    TriggerServerEvent("vehSounds:sync", cfg.burble)
    nuiPlay(cfg.burble, (cfg.volumes and cfg.volumes.burble) or 0.4)
end

-- 2-step loop per vehicle (key combo: W + handbrake)
local function runTwoStepLoop(veh, cfg)
    if not cfg or not cfg.enable_two_step then return end
    CreateThread(function()
        local lastPop = 0
        while true do
            Wait(TwoStep.tick_ms or 120)
            local accelHeld = GetControlNormal(0, 71) > 0.1 or IsControlPressed(0, 71)
            local spaceHeld = IsControlPressed(0, 76)
            local speed = GetEntitySpeed(veh)

            if not (accelHeld and spaceHeld and speed <= (TwoStep.max_speed_ms or 5.0)) then
                break
            end

            -- Oscillate rpm
            local rpm = (TwoStep.rpm_min or 0.42) + math.random() * ((TwoStep.rpm_max or 0.56) - (TwoStep.rpm_min or 0.42))
            SetVehicleCurrentRpm(veh, rpm)
            -- Pop cooldown
            local now = GetGameTimer()
            if now - lastPop >= (TwoStep.pop_cooldown_ms or 180) then
                lastPop = now

                local model = GetEntityModel(veh)
                local modelName = GetDisplayNameFromVehicleModel(model):lower()
                playTwoStep(modelName, cfg)
            end
        end
    end)
end


-- Main loop
CreateThread(function()
    while true do
        Wait(100)
        local ped = PlayerPedId()
        local veh = GetVehiclePedIsIn(ped, false)
        if veh ~= 0 and GetPedInVehicleSeat(veh, -1) == ped then
        local model = GetEntityModel(veh)
        local modelName = GetDisplayNameFromVehicleModel(model)

        if modelName then
            modelName = modelName:lower()
            if not printedModels[modelName] then
                print("Raw Model Hash:", model)
                print("Model Name:", modelName)
                printedModels[modelName] = true
            end
        else
            print("Failed to get model name for vehicle")
        end

        local cfg = VehicleSounds[modelName]
        if not cfg and not printedModels[modelName .. "_nocfg"] then
            print("No config found for model:", modelName)
            printedModels[modelName .. "_nocfg"] = true
        end


            if cfg then
                local gear = GetVehicleCurrentGear(veh)
                local rpm = GetVehicleCurrentRpm(veh)
                local speed_mph = GetEntitySpeed(veh) * 2.236936
                -- shift logic
                if lastGear[veh] then
                    if gear > lastGear[veh] and gear > 1 then
                        playDSG(modelName, cfg)
                    elseif gear < lastGear[veh] and gear > 0 then
                        playBackfire(modelName, cfg)
                    end
                end
                lastGear[veh] = gear

                -- burble: delayed start on throttle release, only when over threshold
                local throttle = GetControlNormal(0, 71)
                throttleReleased[veh] = throttleReleased[veh] or false
                burbleActive[veh] = burbleActive[veh] or false
                local over_mph = cfg.burble_over_mph or 80
                if throttle < 0.05 and not throttleReleased[veh] and speed_mph > over_mph and rpm > 0.4 then
                    throttleReleased[veh] = true
                    CreateThread(function()
                        Wait(cfg.burble_delay_ms or 1000)
                        if GetControlNormal(0, 71) < 0.05 then
                            burbleActive[veh] = true
                            local start = GetGameTimer()
                            while burbleActive[veh] and (GetGameTimer() - start) < (cfg.burble_duration_ms or 1000) do
                                if GetControlNormal(0, 71) > 0.1 then break end
                                playBurble(modelName, cfg)
                                Wait(math.random(200, 300))
                            end
                            burbleActive[veh] = false
                        end
                    end)
                elseif throttle > 0.1 then
                    throttleReleased[veh] = false
                    burbleActive[veh] = false
                end

-- 2-step trigger (run loop when combo is held)
if cfg.enable_two_step then
    local accelHeld = GetControlNormal(0, 71) > 0.1 or IsControlPressed(0, 71)
    local spaceHeld = IsControlPressed(0, 76)
    local speed = GetEntitySpeed(veh)
    if accelHeld and spaceHeld and speed <= (TwoStep.max_speed_ms or 5.0) then
        runTwoStepLoop(veh, cfg)
    end
end


-- Sync listener
RegisterNetEvent("vehSounds:play", function(file, volume)
    nuiPlay(file, volume or 0.5)
end)

-- Test commands
RegisterCommand("vs_test_dsg", function()
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    if veh ~= 0 then
        local model = GetEntityModel(veh)
        local modelName = GetDisplayNameFromVehicleModel(model):lower()
        local cfg = VehicleSounds[modelName]
        if cfg then playDSG(modelName, cfg) end
    end
end, false)

RegisterCommand("vs_test_backfire", function()
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    if veh ~= 0 then
        local model = GetEntityModel(veh)
        local modelName = GetDisplayNameFromVehicleModel(model):lower()
        local cfg = VehicleSounds[modelName]
        if cfg then playBackfire(modelName, cfg) end
    end
end, false)

RegisterCommand("vs_test_burble", function()
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    if veh ~= 0 then
        local model = GetEntityModel(veh)
        local modelName = GetDisplayNameFromVehicleModel(model):lower()
        local cfg = VehicleSounds[modelName]
        if cfg then playBurble(modelName, cfg) end
    end
end, false)
            end
        end
    end
end)
