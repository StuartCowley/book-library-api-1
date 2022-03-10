module.exports = (connection, DataTypes) => {
    const schema = {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'We need a book title',
                  },
                  notEmpty: {
                    args: [true],
                    msg: 'The book title cannot be empty',
                  }
            }
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'We need a book author',
                  },
                  notEmpty: {
                    args: [true],
                    msg: 'The book author cannot be empty',
                  }
            }
        },
        
        ISBN: DataTypes.STRING
    };

    const BookModel = connection.define('Book', schema);

    return BookModel; 
}