import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-center">
          <div className="text-sm md:text-base text-zinc-700">
            Developed By:{" "}
            <Link
              href="https://gaurabchhetri.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              Gaurab Chhetri
            </Link>
          </div>
          <div className="hidden md:block text-zinc-400">|</div>
          <div className="text-sm md:text-base text-zinc-700">
            Supported by{" "}
            <Link
              href="https://ait-lab.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              AIT Lab
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Texas Traffic Crash Dashboard. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
