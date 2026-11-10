# Vehicle Sounds

Drop-in resource to give multiple vehicles their own pops (upshift), backfire (downshift), burble (on throttle release), and 2-step (W+handbrake). Audio is synced to nearby players.

## Install
1) Put this folder in `resources/[local]/vehicle_sounds_template`
2) Add to `server.cfg`: `ensure vehicle_sounds_template`
3) Put your `.ogg` files into `html/sounds/` and reference them in `config.lua` per vehicle key (spawn name).
4) no need to mess with the server.lua or the client.lua or the fxmanifest.lua unless you know what your doing you ***WILL*** break the scripts and nothing will work

                               HOW TO ADD CUSTOM CAR SOUNDS

***STEP 1-- use anytype of rec software "STREAMLABS" "OBS" etc rec a yotube video of any car sound***

***STEP 2-- drag the video into any editing software 'SONY VEGAS" "CAPCUT" etc trim it to your liking***

***STEP 3-- make it a mp3, search up "MP3 TO .OGG" convert it to .OGG then drag it to HTML/SOUNDS/ open the sounds folder and drop it in***
                                                                                                                                             
***STEP 4-- then copy the txt "mycarsound.ogg" and place it into the config.lua with what ever the sound you wanted it backfire, burble, 2 step***
                                                                                                                                                  
***STEP 5-- go in game if your not already open the f8 menu type restart VehicleSounds and BAM done! you now have custom car sounds***

## Configure Vehicles
Edit `config.lua`:
```lua
VehicleSounds = {
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
  }
}
```

## Test Commands (in-game)
- `/vs_test_backfire`
- `/vs_test_burble`

## Notes
- Sounds must be `.ogg` and placed in `html/sounds/`.
- Sync radius is set by `SyncRadius` in `config.lua` (default 60m).
- 2-step only runs when enabled for that vehicle and while holding **W + handbrake** under ~11 MPH
