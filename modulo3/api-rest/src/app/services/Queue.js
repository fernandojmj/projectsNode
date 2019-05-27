const kue = require('kue')
const redisConfig = require('../../config/redis')

const job = require('../jobs/PurchaseMail')

const Queue = kue.createQueue({ redis: redisConfig })

Queue.process(job.key, job.handle)

module.exports = Queue
