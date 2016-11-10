const chalk = require('chalk')

pinklog = {
    log(txt) {
            if (process.env.VERBOSE !== 'false') {
                console.log(chalk.magenta(txt));
            }

        },
        error(txt) {
            console.log(chalk.bold.red(txt));
        }

}

module.exports = pinklog;
