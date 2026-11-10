fx_version 'cerulean'
game 'gta5'

name 'vehicle_sounds_template'
author 'nksflick'
description 'Template: per-vehicle DSG, backfire, burble, and 2-step with synced audio'
version '1.0.0'

ui_page 'html/index.html'

client_scripts {
    'config.lua',
    'client.lua'
}

server_script 'server.lua'

files {
    'html/index.html',
    'html/sounds/*.ogg'
}
