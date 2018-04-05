/**
 * @file
 * Defines db connectors.
 */

import casual from 'casual';
import mongoose from 'mongoose';
import initial_data from './initial'

mongoose.Promise = global.Promise;

const mongo = mongoose.connect('mongodb://mongo:27017/views', {
  useMongoClient: true
});

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ViewSchema = new Schema({
  postId: Number,
  views: Number,
});

const View = mongoose.model('views', ViewSchema);

casual.seed(123);

View.insertMany(
  initial_data,
  function (error, docs) {
    if (error) {
      console.log(error);
      console.log(docs);
    }
  }
);

// Add View to the exports.
export default View;
