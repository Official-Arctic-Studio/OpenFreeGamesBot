const { ShardingManager } = require('discord.js-light');

const {
    token
} = require("./config.json");

const manager = new ShardingManager('./bot.js', {
    // 'auto' handles shard count automatically
    totalShards: "auto", 
    token: token
});

// Spawn your shards
manager.spawn().catch(error => console.error(`[ERROR/SHARD] Shard failed to spawn.`));

manager.on('shardCreate', (shard) => {
    shard.on("ready", () => {
        console.log(`[DEBUG/SHARD] Shard ${shard.id} connected to Discord's Gateway.`)
        // Sending the data to the shard.
        //shard.send({type: "shardId", data: {shardId: shard.id}});
        if(shard.id == manager.totalShards-1){
            console.log(`[DEBUG/SHARD] All shards online!`)
            //process.send('ready')
        }
    });
});
