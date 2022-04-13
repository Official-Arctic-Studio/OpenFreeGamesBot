# FreeGamesBot
Free Games Bot for Discord

# Before build
Requires a running instance of mysql, I run mariaDB
Update params files (config.json and modules/my_conf.json) with your variables, I currently don't pass them as ENVs but you can if you want

# First Start
For first start of the docker you will need to set ENTRYPOINT to sleep 1000 and then manually run 'npm run setup'

# After setup
Your entrypoint after setup will be 'npm run start'