const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos ver logs');
    }


}

module.exports = {
    dbConnection
}


/* mongoose.connect('// mongodb+srv://mean_user:vd7UDt0kyqjI5UNY@cluster0.6kmbf.mongodb.net/hospitaldb', { useNewUrlParser: true, useUnifiedTopology: true });

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow')); */