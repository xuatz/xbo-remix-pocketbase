import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { logout } from '~/session.server';

export async function action({ request }: ActionArgs) {
  console.log('xz:action');
  return logout(request);
}

export async function loader() {
  return redirect('/');
}
