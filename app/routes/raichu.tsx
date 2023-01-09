import { ActionArgs, json, LoaderArgs, MetaFunction } from '@remix-run/node';
import { pb } from '~/pocketbase.server';
import { getUserPocketBaseToken } from '~/session.server';
import cookie from 'cookie';

export async function loader({ request }: LoaderArgs) {
  console.log('xz:======================');
  console.log('xz:pb.authStore.isValid', pb.authStore.isValid);
  console.log('xz:pb.authStore.model?.email', pb.authStore.model?.email);

  const remixCookie = request.headers.get('Cookie');
  if (remixCookie) {
    const parsedCookie = cookie.parse(remixCookie);
    console.log('xz:parsedCookie', parsedCookie);
    pb.authStore.loadFromCookie(
      cookie.serialize('pb_auth', parsedCookie?.pb_auth)
    );
  }

  console.log('xz:pb.authStore.isValid', pb.authStore.isValid);
  console.log('xz:pb.authStore.model?.email', pb.authStore.model?.email);

  return json(pb.authStore, { status: 200 });
}

export default function RaichuPage() {
  return <div>this is a empty page ^^</div>;
}
