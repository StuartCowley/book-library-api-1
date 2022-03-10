module.exports = (connection, DataTypes) => {
    const schema = {
        author: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'We need an author in so that we can create one'
                },
                notEmpty: {
                    args: [true],
                    msg: 'We need an author in so that we can create one'
                }
            }
        }
    };

    const AuthorModel = connection.define('Author', schema);

    return AuthorModel;
};