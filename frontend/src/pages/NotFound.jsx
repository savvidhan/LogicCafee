import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
    <p className="text-6xl font-bold text-zinc-700">404</p>
    <p className="text-lg text-zinc-400">Page not found</p>
    <Link to="/" className="mt-2 text-sm text-indigo-400 hover:underline">
      Go home
    </Link>
  </div>
);

export default NotFound;
