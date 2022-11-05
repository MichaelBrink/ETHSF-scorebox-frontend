import Header from '@scorebox/src/components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='flex flex-col w-full min-h-screen font-sans justify-between z-10 tracking-tight'>
      <Header />
      <main className='w-full horizontal_padding_wide md:pt-0 pt-10 z-10'>
        {children}
      </main>
    </div>
  );
}
