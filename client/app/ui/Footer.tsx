import { FaTwitter, FaDiscord, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0f0c29] text-white py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-400">DreamMint</h2>
          <p className="mt-2 text-sm text-gray-400">
            Discover, collect, and sell extraordinary NFTs on the world’s most secure NFT marketplace.
          </p>
        </div>

        {/* Marketplace Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Marketplace</h3>
          <ul className="text-sm space-y-1 text-gray-300">
            <li><a href="#">Explore</a></li>
            <li><a href="#">Trending</a></li>
            <li><a href="#">Featured</a></li>
            <li><a href="#">Recently Added</a></li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Community</h3>
          <ul className="text-sm space-y-1 text-gray-300">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Events</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#"><FaTwitter size={20} className="hover:text-indigo-400" /></a>
            <a href="#"><FaDiscord size={20} className="hover:text-indigo-400" /></a>
            <a href="#"><FaInstagram size={20} className="hover:text-indigo-400" /></a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} DreamMint. All rights reserved.
      </div>
    </footer>
  );
}
