const core = require('../../core.js');
const config = core.config.main.discord.command.message;

class MessageListener {

    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.command = {};

        this.load_commands();
    }

    load_commands() {
        let commands_config = this.config.command;
        let list = commands_config.list;
        let self = this;
        list.forEach((command) => {
            let config = commands_config[command];
            let command_module = require(self.config.require.format(config));
            config.name.forEach((name) => {
                self.command[name] = {
                    module: command_module,
                    config: config
                };
            });
        });
    }


    call(self, message) {
        try {
            let content = message.content;
            let channel = message.channel;
            let author = message.member;

            if (!content
                || !content.startsWith(self.config.prefix)
                || !channel.guild
                || !author.permissions.has(self.config.permission))
                return;

            let args = content.split(self.config.split);
            let command = args[0].substring(self.config.prefix.length);

            let command_module = self.command[command];
            if (command_module)
                command_module.module.call({
                    message: message,
                    content: content,
                    channel: channel,
                    author: author,
                    args: args,
                    config: command_module.config
                });
        } catch (e) {
            core.warn(`smth went wrong when reading command`, e);
        }
    }

}

module.exports = MessageListener;