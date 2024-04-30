const Queue = require('bull');
const dayjs = require('dayjs');
const { SubscriptionSchema } = require('../../models/subscriptionModel');
const { UserSchema } = require('../../models/userModel');

// Create a Bull queue connected to Redis for daily tasks
const dailyQueue = new Queue('daily-tasks', {
  redis: {
    host: '6379',
    port: 'localhost',
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
const processDailyJob = async (job) => {
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

module.exports = { processDailyJob, dailyQueue };
