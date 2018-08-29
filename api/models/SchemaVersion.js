module.exports = {
    attributes: {
        id: {
            type: 'string',
            unique: true
        },
        version: {
            type: 'number',
            defaultsTo: 1
        }
    }
};
