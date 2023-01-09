import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { createUserSession, getUserId } from '~/session.server';
import { authWithPassword } from '~/models/user.server';
import { safeRedirect, validateEmail } from '~/utils';

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect('/home');
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/home');
  const remember = formData.get('remember');

  if (!validateEmail(email)) {
    return json(
      { errors: { email: 'Email is invalid', password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      { errors: { email: null, password: 'Password is required' } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: 'Password is too short' } },
      { status: 400 }
    );
  }

  const { user, token } = await authWithPassword(email, password);

  if (!user) {
    return json(
      { errors: { email: 'Invalid email or password', password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === 'on' ? true : false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: 'Login',
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/home';
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex flex-col justify-center min-h-full">
      <div className="w-full max-w-md px-8 mx-auto">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full px-2 py-1 text-lg border border-gray-500 rounded"
              />
              {actionData?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full px-2 py-1 text-lg border border-gray-500 rounded"
              />
              {actionData?.errors?.password && (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400"
          >
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="block ml-2 text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm text-center text-gray-500">
              Don't have an account?{' '}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: '/signup',
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
