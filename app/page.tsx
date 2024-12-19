import Footer from '@/components/home/Footer';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import DocTypes from '@/components/home/DocTypes';
import CTA from '@/components/home/CTA';
import { currentUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user: User | null = await currentUser();
  const isLoggedIn = !!user;
  if (isLoggedIn) {
    redirect('/dashboard');
  }

  return (
    <main className="sm:p-7 sm:pb-0">
      <Header />
      <Hero />
      <HowItWorks />
      <DocTypes />
      <CTA />
      <Footer />
    </main>
  );
}
