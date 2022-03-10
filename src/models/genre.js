module.exports = (connection, DataTypes) => {
    const schema = {
        genre: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'We need a genre in so that we can create one'
                },
                notEmpty: {
                    args: [true],
                    msg: 'We need a genre in so that we can create one'
                }
            }
        }
    };

    const GenreModel = connection.define('Genre', schema);

    return GenreModel;
};