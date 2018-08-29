module.exports = {
    attributes: {
        id: {
            type: 'string',
            unique: true
        },
        username: {
            type: 'string',
            unique: true,
        },
        email: {
            type: 'string',
            unique: true,
        },
        imageRealName: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        },
        age: {
            type: 'integer',
            defaultsTo: 1
        }
    }
};
