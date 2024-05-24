const Queue = require('bull');
const { UserSchema } = require('../../models/userModel');
const { SubscriptionSchema } = require('../../models/subscriptionModel');
const dayjs = require('dayjs');
const { sendSMTPMail } = require('../../utils/common');

const DELETION_GRACE_DAYS = 86;

function sendNotificationEmail(email) {
  // TODO: Convert to GERMAN
  const subject = 'Your account has been deleted'; // translate!
  const message = `As stated in the last few mails earlier, after ${DELETION_GRACE_DAYS} days of unpaid subscription, your account has been permanently deleted.`; // translate!

  return sendSMTPMail(email, subject, message);
}

// Function to delete old users and send notification emails
async function deleteOldUsers() {
  const cutoffDate = dayjs()
    .startOf('day')
    .subtract(DELETION_GRACE_DAYS, 'days')
    .toDate();

  // Find users whose last subscription payment date was 86 days ago
  const oldSubscriptions = await SubscriptionSchema.find({
    lastPaymentDate: { $lte: cutoffDate },
  });

  const userIds = oldSubscriptions.map((sub) => sub.userId);

  // Find user emails before deleting them
  const usersToDelete = await UserSchema.find({ _id: { $in: userIds } });

  // Send notification emails
  for (const user of usersToDelete) {
    await sendNotificationEmail(user.email);
  }

  // Delete users
  await UserSchema.deleteMany({ _id: { $in: userIds } });

  console.log(`Deleted users with last payment date before ${cutoffDate}`);
}

// Create a Bull queue for the daily task
const deleteNonCommittedUsersQueue = new Queue('delete-non-committed-users', {
  redis: {
    host: '127.0.0.1', // Adjust the host and port as needed
    port: 6379,
  },
});

// Process jobs in the queue
deleteNonCommittedUsersQueue.process(async () => {
  await deleteOldUsers();
});

// Schedule the job to run at the end of every day
deleteNonCommittedUsersQueue.add({}, { repeat: { cron: '0 0 * * *' } }); // Every day at midnight

module.exports = deleteNonCommittedUsersQueue;
