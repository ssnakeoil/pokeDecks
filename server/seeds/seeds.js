const db = require('../config/connection');
const { User } = require('../models');

const userData = require('./userSeeds.json');

db.once('open', async () => {
    await User.deleteMany({});
    const users = await Tech.insertMany(userData);
    
    console.log('Seeded');
    process.exit(0);
});