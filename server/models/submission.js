const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    link: { type: String, required: [true, "File is required"] },
    student: { type: Schema.Types.ObjectId, ref: "User", required: [true, "User is required"] },
    grade: {
        mark: { type: Number },
        remark: { type: String },
    },
    submittedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);