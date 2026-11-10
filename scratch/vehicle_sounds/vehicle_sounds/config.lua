-- ===============================
-- Vehicle Sounds Config
-- ===============================
-- Add your vehicles here. Keys are model spawn names (lowercase).
-- For each vehicle you can override volumes and behavior flags.
Config = {}
print("Model:", modelName)
if not cfg then
    print("No config found for", modelName)
else
    print("Found config for", modelName)
end



Config.VehicleSounds = {
    -- Examples//// i made it easier to edit just replace backfire burble two_step etc and add your own car so you dont have to manually add all of the lines :)/////
    ['2ncsbmwm8'] = {
        backfire = 'backfire_gunshot.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['16charger'] = {
        backfire = 'backfire_gunshot.ogg',
        burble = 'charger_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['18performan'] = {
        backfire = 'backfire_gunshot.ogg',
        burble = 'lambo_pop_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['audi rs7'] = {
        backfire = 'gunshot_sound.ogg',
        burble = 'rs7_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['350z'] = {
        backfire = 'gunshot_sound.ogg',
        burble = '350z_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['488'] = {
        backfire = 'car_backfire_any.ogg',
        burble = '488_mclaren_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['488sp'] = {
        backfire = 'car_backfire_any.ogg',
        burble = '488_mclaren_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['911turbos'] = {
        backfire = 'car_backfire_any.ogg',
        burble = '911_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['1016urus'] = {
        burble = 'urus_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['bmw m5'] = {
        backfires = 'car_backfire_any.ogg',
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['a80'] = {
        backfire = 'supra_2_step_converted.ogg', 
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['a90sh'] = {
        backfire = 'supra_2_step_converted.ogg',
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['abhawk'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = 'trackhawk_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['agerars'] = {
        burble = '488_mclaren_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['amggtbs'] = {
        burble = 'amg_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['autobio'] = {
        burble = 'amg_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['autobio'] = {
        burble = 'amg_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['bentaygam'] = {
        burble = 'amg_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['benzsl63'] = {
        burble = 'amg_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['benzsl63'] = {
        burble = 'amg_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['s560'] = { --m8
        burble = 'm8_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['subaru'] = { --e39 bmw
        backfire = 'gunshot_sound.ogg',
        burble = 'm8_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['boss429'] = {
        backfire = '5_0_gunshot.ogg',
        burble = '5_0_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true

    },
    ['c63hr'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'amg_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true

    },
    ['cayen19'] = {
        burble = 'urus_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true

    },
    ['cb650r'] = {
        backfire = 'car_backfire_any.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true

    },
    ['chironsuper'] = {
        backfire = 'gunshot_sound.ogg',
        burble = 'urus_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true

    },
    ['civic2020'] = {
        backfire = 'si_civic_2_step.ogg',
        burble = '2020_civic_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true

    },
    ['demon'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = 'trackhawk_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['dle39m5'] = { --e39 bmw
        backfire = 'gunshot_sound.ogg',
        burble = 'm8_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['dlm2'] = { --e39 bmw
        backfire = 'gunshot_sound.ogg',
        burble = 'm8_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['drag1'] = {
        backfire = 'drag_car_pack_2_step.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['drag2'] = {
        backfire = 'rx7_2_step.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['drag4'] = {
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['drag6'] = {
        backfire = 'gunshot_sound.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['drag7'] = {
        backfire = 'drag_car_pack_2_step.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['dvc63darwin'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'amg_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['eleanor'] = {
        backfire = '5_0_gunshot.ogg',
        burble = '5_0_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['eve'] = {
        backfire = 'car_backfire_any.ogg',
        burble = '488_mclaren_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['evo'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'evo_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['evo9drift'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'evo_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65, 
        },
        enable_two_step = true
    },
    ['f1'] = {
        backfire = 'car_backfire_any.ogg',
        burble = '488_mclaren_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['f812'] = {
        backfire = 'car_backfire_any.ogg',
        burble = '488_mclaren_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['fgt'] = {
        backfire = '5_0_gunshot.ogg',
        burble = '5_0_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['fnfmk4'] = {
        backfire = 'better_2_step_mk4_supra.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['fpaceprior'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['g81hr'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['giulia 2021'] = {
        backfire = 'gunshot_sound.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['godzramtrx6'] = {
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['godzramtrx6'] = {
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['gt86trust'] = {
        backfire = 'gunshot_sound.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['pontiac gto'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['hellcatf9'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = 'trackhawk_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['hycaders6'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['hyundaivelo'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['hyundaivelo'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['kart'] = {
        backfire = 'gunshot_sound.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['mach1'] = {
        backfire = '5_0_gunshot.ogg',
        burble = '5_0_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['mk4hycade'] = {
        backfire = 'supra_2_step_converted.ogg', 
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['mustang65'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = '5_0_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['mx-5'] = {
        backfire = 'si_civic_2_step.ogg',
        burble = '2020_civic_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['nismo20'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'trackhawk_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['rmodf40'] = {
        backfire = 'car_backfire_any.ogg',
        burble = '488_mclaren_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['rmodsvj'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'trackhawk_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65, 
        },
        enable_two_step = true
    },
    ['rmodzl1'] = {
        backfire = 'zl1_2_step.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['rs7wide'] = {
        backfire = 'gunshot_sound.ogg',
        burble = 'rs7_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['s15'] = {
        backfire = 'supra_2_step_converted.ogg', 
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['s15lunar'] = {
        backfire = 'supra_2_step_converted.ogg', 
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['s15lunar'] = {
        backfire = 'supra_2_step_converted.ogg', 
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = truee
    },
    ['scubieblob'] = {
        backfire = 'car_backfire_any.ogg', 
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['senna'] = {
        backfire = 'car_backfire_any.ogg',
        burble = '488_mclaren_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['sf90'] = {
        backfire = 'car_backfire_any.ogg',
        burble = '488_mclaren_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['sinacp'] = {
        backfire = 'car_backfire_any.ogg',
        burble = '488_mclaren_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['skyline'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },

    ['specialtf'] = {
        backfire = 'gunshot_sound.ogg',
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['swl'] = {
        backfire = 'subi_2_step.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['trhawk'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = 'trackhawk_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['trx'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = 'trackhawk_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['ttsto'] = {
        backfire = 'backfire_gunshot.ogg',
        burble = 'lambo_pop_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['urus stretc'] = {
        burble = 'urus_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['v60hr'] = {
        backfire = 'backfire_gunshot.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['vanztt'] = {
        backfire = 'backfire_gunshot.ogg',
        burble = 'lambo_pop_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['fenyr'] = {
        backfire = 'backfire_gunshot.ogg',
        burble = 'lambo_pop_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['zentenario'] = {
        backfire = 'backfire_gunshot.ogg',
        burble = 'lambo_pop_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['brainshack'] = {
        backfire = 'backfire_gunshot.ogg',
        burble = 'bmw_burble_tune.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['casup'] = {
        backfire = 'supra_2_step_converted.ogg',
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['cozycoupe'] = {
        backfire = 'car_backfire_any.ogg',
        burble = 'm5_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['gclapped'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = 'trackhawk_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['hellcat15'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = 'trackhawk_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['r8v10abt'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = 'audi_r8_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['streetz28'] = {
        backfire = 'trackhawk_backfires.ogg',
        burble = 'trackhawk_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['tdb370z'] = {
        backfire = 'gunshot_sound.ogg',
        burble = '350z_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['urusperf23'] = {
        burble = 'urus_burbles.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['cb650r'] = {
        backfire = 'bike_2_step.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true
    },
    ['claw'] = {
        backfire = 'bike_2_step.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true

    },
    ['kawagala'] = {
        backfire = 'bike_2_step.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true

    },
    ['lpchopper2'] = {
        backfire = 'bike_2_step.ogg',
        two_step = 'better_2_step_mk4_supra.ogg',
        burble_over_mph = 80,
        burble_delay_ms = 800,
        burble_duration_ms = 900,
        volumes = {
            backfire = 0.55,
            burble = 0.45,
            two_step = 0.65,
        },
        enable_two_step = true

    },


}

-- General radius (meters) to sync sounds to other players
SyncRadius = 60.0

-- 2-step settings (shared; only active if per-vehicle enable_two_step = true)
TwoStep = {
    max_speed_ms = 5.0,       -- about 11 mph
    pop_cooldown_ms = 7000,
    tick_ms = 120,
    rpm_min = 0.42,
    rpm_max = 0.56
}
