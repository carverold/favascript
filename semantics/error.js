error = (message, location) => {
    if (!error.quiet) {
        if (location && location.line) {
            message += ` at line ${location.line}`;
            if (location.col) {
                message += `, column ${location.col}`
            }
        }
        console.log(`Error: ${message}`)
    }
    error.count++;
}

error.quiet = false;

error.count = 0;

module.exports = error;
