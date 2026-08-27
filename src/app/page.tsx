import Header from '@/components/Header';
import Downloader from '@/components/Downloader';
import About from '@/components/About';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <Header />
      <main className="flex-1 space-y-8">
        <Downloader />
        <About />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
