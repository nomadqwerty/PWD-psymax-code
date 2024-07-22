const { Schema, model } = require('mongoose');

const MeetingScheduleSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'Which User does the schedule belong to?'],
  },
  meetingTime: {
    type: Schema.Types.Mixed,
    required: [true, 'meeting needs a scheduled date'],
  },

  Geburtsdatum: { type: String, required: [true, 'meeting needs a title'] },
  url: { type: String, required: [true, 'meeting needs a title'] },
  Nachname: { type: String, required: [true, 'meeting client Last name'] },
  Vorname: { type: String, required: [true, 'meeting client first name'] },
  email: { type: String, required: [true, 'meeting client first name'] },
  accessKey: {
    type: String,
    required: [true, 'meeting needs an access key'],
  },
});

const MeetingSchedule = model('MeetingSchedule', MeetingScheduleSchema);

module.exports = MeetingSchedule;
