import WalrusImageDemo from '../components/WalrusImageDemo';
import WhitelistManager from '../components/WhitelistManager';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Whitelist Management Section */}
        <section>
          <WhitelistManager />
        </section>
        
        {/* Walrus Storage Demo Section */}
        <section>
          <WalrusImageDemo />
        </section>
      </div>
    </div>
  );
}
