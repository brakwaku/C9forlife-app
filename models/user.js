const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  bucket: {
    items: [
      {
        activityId: {
          type: Schema.Types.ObjectId,
          ref: 'Activity',
          required: true
        },
        // quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToBucket = function (activity) {
  const bucketActivityIndex = this.bucket.items.findIndex(cp => {
    return cp.activityId.toString() === activity._id.toString();
  });
  let newQuantity = 1;
  const updatedBucketItems = [...this.bucket.items];

  if (bucketActivityIndex >= 0) {
    newQuantity = this.bucket.items[bucketActivityIndex].quantity + 1;
    updatedBucketItems[bucketActivityIndex].quantity = newQuantity;
  } else {
    updatedBucketItems.push({
      activityId: activity._id,
      quantity: newQuantity
    });
  }
  const updatedBucket = {
    items: updatedBucketItems
  };
  this.bucket = updatedBucket;
  return this.save();
};

userSchema.methods.removeFromBucket = function (activityId) {
  const updatedBucketItems = this.bucket.items.filter(item => {
    return item.activityId.toString() !== activityId.toString();
  });
  this.bucket.items = updatedBucketItems;
  return this.save();
};

userSchema.methods.clearBucket = function () {
  this.bucket = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
