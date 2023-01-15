import { Link } from '@remix-run/react';

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col justify-center">
      nothing here but chicken
      <Link
        className="text-blue-500 underline"
        to={{
          pathname: '/login',
        }}
      >
        Log in
      </Link>
      <form action="/logout" method="post">
        <button type="submit" className="button">
          Logout
        </button>
      </form>
    </div>
  );
}
