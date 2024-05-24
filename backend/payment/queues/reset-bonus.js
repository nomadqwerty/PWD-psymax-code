const Queue = require('bull');
const { SubscriptionSchema } = require('../../models/subscriptionModel');
const { UserSchema } = require('../../models/userModel');
const dayjs = require('dayjs');

// Function to reset bonus points
async function resetBonusPoints() {
  const tomorrowDate = dayjs().add(1, 'day').startOf('day').toDate();

  const subscriptionsStartingTomorrow = await SubscriptionSchema.find({
    startDate: tomorrowDate,
  });

  const userIds = subscriptionsStartingTomorrow.map((sub) => sub.userId);

  await UserSchema.updateMany(
    { _id: { $in: userIds } },
    { $set: { referralBonusCycles: 0 } }
  );

  console.log(
    `Reset bonus points for users with subscriptions starting on ${tomorrowDate.toISOString().split('T')[0]}`
  );
}

// Create a Bull queue for the daily task
const resetBonusPointsQueue = new Queue('reset-bonus-points', {
  redis: {
    host: '127.0.0.1', // Adjust the host and port as needed
    port: 6379,
  },
});

// Process jobs in the daily queue
resetBonusPointsQueue.process(async () => {
  await resetBonusPoints();
});

// Schedule the job to run at the end of every day
resetBonusPointsQueue.add({}, { repeat: { cron: '0 0 * * *' } }); // Every day at midnight

module.exports = resetBonusPointsQueue;
