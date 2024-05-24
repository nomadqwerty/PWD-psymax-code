const { Schema, model } = require('mongoose');

const MeetingScheduleSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'Which User does the schedule belong to?'],
  },
  scheduledDate: {
    type: String,
    required: [true, 'meeting needs a scheduled date'],
  },
  title: { type: String, required: [true, 'meeting needs a title'] },
  accessKey: {
    type: String,
    required: [true, 'meeting needs an access key'],
  },
});

const MeetingSchedule = model('MeetingSchedule', MeetingScheduleSchema);

module.exports = MeetingSchedule;
