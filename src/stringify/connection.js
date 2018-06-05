const MainEvent = require('./main.js');

class ConnectionEvent extends MainEvent {

    constructor() {
        super();
    }

    parse_adress() {
        return this.entry.data.argument[1];
    }

    parse_port() {
        return this.entry.data.argument[2];
    }

    parse(config, entry) {
        this.__proto__.parse(config, entry);
        
        this.adress = this.parse_adress();
        this.port = this.parse_port();
        
        return this.config.template.format(this);
    }

}

module.exports = ConnectionEvent;