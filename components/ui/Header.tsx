import Link from 'next/link';
import { UserButton, currentUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import Tooltip from '@mui/material/Tooltip';
import Tooltips from './SubsTooltips';

export default async function Header() {
  const user: User | null = await currentUser();
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-40 bg-white w-full border-b border-b-slate-200 shadow-sm">
      <div className="h-16 py-4 container mx-auto">
        <nav className="flex justify-between mx-10">
          <Link
            href="/"
            className="hover:text-slate-600 cursor-pointer flex items-center mr-2"
          >
            <Logo />
            {/* <span className="text-2xl mb-2 font-medium">PDFtoChat</span> */}
          </Link>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div>
                  <Tooltips />
                </div>
                <Tooltip title="Manage Subscriptions">
                  <button className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-lg shadow rounded-md hover:border-1 hover:rounded-lg bg-gradient-to-r from-[#0b8d8c] to-[#f77a1b] hover:from-white hover:to-white hover:text-[#099f9e] transition ease-in-out duration-150 cursor-pointer text-white">
                    <Link href="/subscription">Subscription</Link>
                  </button>
                </Tooltip>
                <Link href="/dashboard">Dashboard</Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <Link href="/sign-in">Log in</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="">
      <img
        src="/white-bg-logo.png"
        alt="Naati Ninja"
        width={73}
        height={73}
      />
    </div>
  );
}
