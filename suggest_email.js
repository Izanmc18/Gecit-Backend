const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');

// We need to know the DB config. Let's assume standard values from .env or similar.
// Actually, let's just use the API to check if we can delete or just tell the user to use a different email.
// Better: Use a random email in my instructions.

console.log('Please use a new email like user_' + Math.floor(Math.random()*1000) + '@test.com');
