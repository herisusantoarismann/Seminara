require("dotenv").config();
const mongoose = require("mongoose");
const cuid = require("cuid");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

mongoose
  .connect(process.env.API_DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

const SeminarSchema = new Schema({
  itemid: String,
  title: String,
  partner: String,
  speaker: String,
  moderator: String,
  date: Date,
  starthour: String,
  durationMinutes: Number,
  qutoa: Number,
});
SeminarSchema.plugin(mongoosePaginate);

const ParticipantsSchema = new Schema({
  seminaritemid: String,
  itemid: String,
  name: String,
  email: String,
  agency: String,
  phone: String,
  option: String,
  proof: String,
  verified: Boolean,
});
ParticipantsSchema.plugin(mongoosePaginate);

module.exports.collection = mongoose.model("seminars", SeminarSchema);
module.exports.collectionParticipants = mongoose.model(
  "participants",
  ParticipantsSchema
);

module.exports.generateid = function generateId() {
  return cuid().toUpperCase();
};
