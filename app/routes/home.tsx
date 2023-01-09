import { Link } from '@remix-run/react';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center min-h-full">
      nothing here but chicken
      <Link
        className="text-blue-500 underline"
        to={{
          pathname: '/login',
        }}
      >
        Log in
      </Link>
      <Link
        className="text-blue-500 underline"
        to={{
          pathname: '/raichu',
        }}
      >
        raichu
      </Link>
      <form action="/logout" method="post">
        <button type="submit" className="button">
          Logout
        </button>
      </form>
    </div>
  );
}
