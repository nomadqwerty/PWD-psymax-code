const express = require('express');
const {
  getMeetingDetails,
  storeMeetingDetails,
  deleteMeetingDetails,
} = require('./controllers/MeetingScheduleHandler');

const meetingRouter = express.Router();
meetingRouter.get('/meetings/all/:id', getMeetingDetails);
meetingRouter.post('/meetings/create', storeMeetingDetails);
meetingRouter.delete('/meetings/delete/:meetingId', deleteMeetingDetails);

module.exports = meetingRouter;
