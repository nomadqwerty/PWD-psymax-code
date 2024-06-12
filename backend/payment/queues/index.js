const deleteNonCommittedUsersQueue = require('./delete-non-committed');
const resetBonusPointsQueue = require('./reset-bonus');
const { invoiceQueue } = require('./wire-transfer');

// Function to initialize queues
function initializeQueues() {
  resetBonusPointsQueue.on('ready', () => {
    console.log('Daily Bonus Reset queue is ready');
  });

  deleteNonCommittedUsersQueue.on('ready', () => {
    console.log('Delete non-committed users queue is ready');
  });

  invoiceQueue.on('ready', () => {
    console.log('Invoice queue is ready');
  });

  resetBonusPointsQueue.on('failed', (job, err) => {
    console.error(`Job failed ${job.id}`, err);
  });

  deleteNonCommittedUsersQueue.on('failed', (job, err) => {
    console.error(`Job failed ${job.id}`, err);
  });

  invoiceQueue.on('failed', (job, err) => {
    console.error(`Job failed ${job.id}`, err);
  });
}

module.exports = {
  initializeQueues,
};
