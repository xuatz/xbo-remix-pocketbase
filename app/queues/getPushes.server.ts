import { getPushes } from '~/models/pushbullet.server';
import { Queue } from '~/utils/queue.server';

type QueueData = {
  emailAddress: string;
};

export const queue = Queue<QueueData>('notifier', async (job) => {
  console.log(`Sending email to ${job.data.emailAddress}`);

  const res = await getPushes({
    access_token: 'o.lergHbCBeR05Ftc55nxDoG6HAeDuabmb',
    // modified_after: '1073108401.2492878',
  });

  console.log(
    'xz:res',
    res.pushes.map((push) => ({
      iden: push.iden,
      title: push.title,
      created: push.created,
      createdDateTime: new Date(push.created * 1000),
      modified: push.modified,
      modifiedDateTime: new Date(push.modified * 1000),
    }))
  );
  console.log('xz:res.pushes.length', res.pushes.length);
  console.log('xz:res.cursor', res.cursor);

  console.log(`Email sent to ${job.data.emailAddress}`);
});
