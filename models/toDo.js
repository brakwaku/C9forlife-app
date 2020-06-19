const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const toDoSchema = new Schema({
    activities: [
        {
            type: Schema.Types.ObjectId, required: true,
            ref: 'Activity'
        }
    ],
    user: {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
});

toDoSchema.methods.removeToDo = function (toDoId) {
    this.activities = this.activities.filter(a => a.toString() !== toDoId.toString())
    return this.save();
};

toDoSchema.methods.addToToDo = function (toDoId) {
    // const toDoActivityIndex = this.activities._id
    this.activities = this.activities.filter(a => a.toString() === toDoId.toString())
    return this.save();
}

module.exports = mongoose.model('ToDos', toDoSchema);