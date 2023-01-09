import type { LoaderArgs } from '@remix-run/node';
import { Response } from '@remix-run/node';
import { authWithPassword } from '~/models/user.server';

// https://github.com/remix-run/examples/tree/main/bullmq-task-queue

export async function loader({ params }: LoaderArgs) {
  const user = await authWithPassword('test1@email.com', '11223344');

  return new Response('OK');
}
