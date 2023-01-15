import type { ClientResponseError } from 'pocketbase';
import { pb } from '~/pocketbase.server';

export type User = {
  id: string;
  email: string;
};

async function authAdmin() {
  if (
    process.env.POCKETBASE_ADMIN_EMAIL &&
    process.env.POCKETBASE_ADMIN_PASSWORD
  ) {
    await pb.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL,
      process.env.POCKETBASE_ADMIN_PASSWORD
    );
  }
}

export async function getUserById(id: User['id']) {
  try {
    await authAdmin();
    const res = await pb.collection('users').getList(1, 1, {
      filter: `id = "${id}"`,
    });
    return res.items[0] || undefined;
  } catch (err) {
    console.log('xz:err', err);
    return;
  }
}

export async function getUserByEmail(email: User['email']) {
  try {
    await authAdmin();
    const res = await pb.collection('users').getList(1, 1, {
      filter: `email = "${email}"`,
    });

    return res.items[0] || undefined;
  } catch (err) {
    // TODO this does not work, i should make a ticket and an mvp for this bug
    // if (err instanceof ClientResponseError)

    const error = err as ClientResponseError;
    console.error(error.data);
    console.error(error.data.data);

    throw err;
  }
}

export async function createUser(email: User['email'], password: string) {
  try {
    const data = {
      email,
      password,
      passwordConfirm: password,
    };
    return await pb.collection('users').create(data);
  } catch (err) {
    // TODO this does not work, i should make a ticket and an mvp for this bug
    // if (err instanceof ClientResponseError)

    const error = err as ClientResponseError;
    console.error(error.data);
    console.error(error.data.data);

    throw err;
  }
}

export async function authWithPassword(email: User['email'], password: string) {
  const { record: user, token } = await pb
    .collection('users')
    .authWithPassword(email, password);
  return { user, token };
}
