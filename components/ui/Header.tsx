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
            className="hover:text-slate-600 cursor-pointer flex items-center mr-1"
          >
            <Logo />
          </Link>
          <div className="flex items-center gap-1">
            {isLoggedIn ? (
              <>
                <div>
                  <Tooltips />
                </div>
                <Tooltip title="Manage Subscriptions">
                  <button className="inline-flex items-center px-2 py-2 font-semibold leading-6 text-lg shadow rounded-md hover:border-1 hover:rounded-lg bg-gradient-to-r from-[#0b8d8c] to-[#f77a1b] hover:from-white hover:to-white hover:text-[#099f9e] transition ease-in-out duration-150 cursor-pointer text-white">
                    <Link href="/subscription">Subscription</Link>
                  </button>
                </Tooltip>
                <button className="inline-flex items-center px-2 py-2 font-semibold leading-6 text-lg shadow border-2 border-[#099f9e] text-[#099f9e] bg-white rounded-md transition ease-in-out duration-150 hover:border-black hover:text-black">
                  <Link href="/dashboard">Dashboard</Link>
                </button>
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
      <img src="/white-bg-logo.png" alt="Naati Ninja" width={73} height={73} />
    </div>
  );
}
