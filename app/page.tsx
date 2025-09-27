import WalrusImageDemo from '../components/WalrusImageDemo';
import WhitelistManager from '../components/WhitelistManager';
import { UserProfile } from '../components/UserProfile';
// Import mock SuiNS setup (runs automatically)
import '../utils/mockSuiNS';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* User Profile Section */}
        <section>
          <UserProfile />
        </section>
        
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
