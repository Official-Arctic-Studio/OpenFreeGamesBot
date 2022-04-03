module.exports = {
  admin(message) {
    return message.member.hasPermission("ADMINISTRATOR");
  },
  check_bot_perms(client, channel, permissions) {
    return new Promise(function (resolve, reject) {
      let missing = [];
      for (permission of permissions) {
        if (!channel.permissionsFor(client.user).has(permission)) {
          missing.push(permission);
        }
      }
      if (missing.length > 0)
        resolve([false, missing]);
      resolve([true, missing]);
    });
  },
};