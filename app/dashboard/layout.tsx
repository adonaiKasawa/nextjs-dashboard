import SideNav from '@/app/ui/dashboard/sidenav';
import Navbar from '../ui/dashboard/nav-bar';
import { redirect } from 'next/navigation';
import { auth } from '../api/auth/[...nextauth]';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect('/login')
  }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-[#111827]">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>

      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <div className='w-full'>
          <Navbar />
        </div>
        {children}
      </div>
    </div>
  );
}