const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: { 
        type: String, 
        unique: true, 
        required: [true, 'The category is necessary'] 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }
})


module.exports = mongoose.model('Category', categorySchema);