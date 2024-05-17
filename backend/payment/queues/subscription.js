const Queue = require('bull');
const dayjs = require('dayjs');
const { SubscriptionSchema } = require('../../models/subscriptionModel');
const { UserSchema } = require('../../models/userModel');
const { sendSMTPMail } = require('../../utils/common');

// Create a Bull queue connected to Redis for daily tasks
const dailyQueue = new Queue('daily-tasks', {
  redis: {
    host: 'localhost',
    port: '6379',
    // Redis connection options
  },
});

// Schedule a daily task to reset referralBonusCycles
dailyQueue.add(
  {},
  {
    repeat: {
      cron: '0 0 * * *', // Run daily at midnight
    },
  }
);

/**
 * @type {import('bull').ProcessPromiseFunction<{}>}
 */
const processNonCommittedUserDelete = async (job) => {
  try {
    // Get the current date
    const maxTrialEndDate = dayjs().startOf('day').subtract(84, 'days');

    const subscriptions = await SubscriptionSchema.find({
      // where user last pay was 84 days
      lastPaymentDate: { $lt: maxTrialEndDate.toDate() },
    });

    // Fetch users associated with subscriptions and reset referralBonusCycles
    const userPromises = subscriptions.map(async (subscription) => {
      // Hard Delete User Data
      const user = await UserSchema.findByIdAndDelete(subscription.userId, {
        new: true,
      });
      // TODO: Convert to GERMAN
      const subject = 'Your account has been deleted';
      const message =
        'As stated in the last few mails earlier, after 83 days of unpaid subscription, your account has been permanently deleted.';

      sendSMTPMail(user.email, subject, message);
    });

    // Execute user queries in parallel
    await Promise.all(userPromises);

    console.log('Long standing non-committed users hard deleted successfully.');
  } catch (error) {
    console.error('Error deleting non-committed users:', error);
    // Retry the job if there was an error
    job.retry();
  }
};

/**
 * @type {import('bull').ProcessPromiseFunction<{}>}
 */
const processBonusCycleReset = async (job) => {
  try {
    // Get the current date
    const currentDate = dayjs().startOf('day');

    // Get tomorrow's date
    const tomorrowDate = dayjs().add(1, 'day').startOf('day');

    // Query for subscriptions starting from today but not including tomorrow
    const subscriptions = await SubscriptionSchema.find({
      startDate: { $gte: currentDate.toDate(), $lt: tomorrowDate.toDate() },
    });

    // Fetch users associated with subscriptions and reset referralBonusCycles
    const userPromises = subscriptions.map(async (subscription) => {
      const user = await UserSchema.findById(subscription.userId);
      if (user && user.referralBonusCycles !== 0) {
        await UserSchema.findByIdAndUpdate(user._id, {
          referralBonusCycles: 0,
        });
      }
    });

    // Execute user queries in parallel
    await Promise.all(userPromises);

    console.log('Referral bonus cycles reset successfully.');
  } catch (error) {
    console.error('Error resetting referral bonus cycles:', error);
    // Retry the job if there was an error
    job.retry();
  }
};

module.exports = {
  processBonusCycleReset,
  processNonCommittedUserDelete,
  dailyQueue,
};
