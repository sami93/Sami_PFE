import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const testSchema = new mongoose.Schema({

  },{strict: false}
);

// Before saving the user, hash the password
const Test = mongoose.model('Test', testSchema);

export default Test;

