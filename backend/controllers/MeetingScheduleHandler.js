const MeetingSchedule = require('../models/MeetingSchedule');
const { UserSchema } = require('../models/userModel');

exports.getMeetingDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const meetings = await MeetingSchedule.find({ userId: userId });
    if (meetings) {
      let detailObject = {
        status: 'success',
        data: { meetings },
      };

      return res.status(200).json(detailObject);
    } else {
      throw new Error('failed to create meeting schedule');
    }
  } catch (error) {
    let errorObject = {
      status: 'failed',
      message: error.message,
    };

    return res.status(400).json(errorObject);
  }
};

exports.storeMeetingDetails = async (req, res) => {
  try {
    const meetingDetails = req.body;

    const newMeeting = await MeetingSchedule.create(meetingDetails);
    if (newMeeting) {
      let detailObject = {
        status: 'success',
        message: 'created meeting schedule',
      };

      return res.status(200).json(detailObject);
    } else {
      throw new Error('failed to create meeting schedule');
    }
  } catch (error) {
    let errorObject = {
      status: 'failed',
      message: error.message,
    };

    return res.status(400).json(errorObject);
  }
};

exports.deleteMeetingDetails = async (req, res) => {
  try {
    const meetingId = req.params?.meetingId;
    console.log(meetingId);
    const removedMeeting = await MeetingSchedule.findOneAndDelete({
      _id: meetingId,
    });

    if (removedMeeting) {
      let detailObject = {
        status: 'success',
        message: 'removed meeting schedule',
      };

      return res.status(204).json(detailObject);
    } else {
      throw new Error('failed to remove meeting schedule');
    }
  } catch (error) {
    let errorObject = {
      status: 'failed',
      message: error.message,
    };

    return res.status(400).json(errorObject);
  }
};
