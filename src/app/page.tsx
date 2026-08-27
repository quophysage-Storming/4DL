import Header from '@/components/Header';
import Downloader from '@/components/Downloader';
import About from '@/components/About';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <Header />
      <main className="flex-1 space-y-12">
        <Downloader />
        <About />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
