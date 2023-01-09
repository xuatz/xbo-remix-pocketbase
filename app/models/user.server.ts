import bcrypt from 'bcryptjs';

import { ClientResponseError } from 'pocketbase';
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
    const user = await pb.collection('users').getOne(id);
    return user;
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
    // this does not work, i should make a ticket and an mvp for this bug
    // if (err instanceof ClientResponseError)
    const error = err as ClientResponseError;

    console.error(error.data);
    console.error(error.data.data);
  }
}

export async function createUser(email: User['email'], password: string) {
  // const hashedPassword = await bcrypt.hash(password, 10);

  // return prisma.user.create({
  //   data: {
  //     email,
  //     password: {
  //       create: {
  //         hash: hashedPassword,
  //       },
  //     },
  //   },
  // });
  try {
    const data = {
      email,
      password,
      passwordConfirm: password,
    };
    return await pb.collection('users').create(data);
  } catch (err) {
    // this does not work, i should make a ticket and an mvp for this bug
    // if (err instanceof ClientResponseError)

    console.error((err as ClientResponseError).data);
    console.error((err as ClientResponseError).data.data);

    throw err;
  }
}

// export async function deleteUserByEmail(email: User['email']) {
//   return prisma.user.delete({ where: { email } });
// }

export async function authWithPassword(email: User['email'], password: string) {
  const { record: user, token } = await pb
    .collection('users')
    .authWithPassword(email, password);

  const cookie = pb.authStore.exportToCookie();
  console.log('xz:cookie', cookie);
  return { user, token };
}
