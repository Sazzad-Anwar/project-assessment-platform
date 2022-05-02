const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assessmentSchema = new Schema({
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Mentor is required"] },
    deadline: { type: Date, required: [true, "Deadline is required"] },
    submission: [{ type: Schema.Types.ObjectId, ref: "Submission" }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Assessment', assessmentSchema);