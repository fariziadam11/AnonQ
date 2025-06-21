import React from 'react';
import { 
  MessageCircle, 
  Settings, 
  TrendingUp, 
  Users, 
  Home,
  Star,
  Heart,
  Zap,
  Target
} from 'lucide-react';

export const SidebarDemoPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 p-4 border-4 shadow-neo transform -rotate-1 bg-neoAccent text-neoDark border-neoDark">
            Sidebar Demo
          </h1>
          <p className="text-lg font-bold p-3 border-2 shadow-neo transform rotate-1 bg-white text-neoDark border-neoDark">
            Modern and responsive sidebar with neo-brutalist design
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-4 shadow-neo transform hover:-rotate-2 transition-all duration-300 bg-neoAccent2 text-white border-neoDark">
            <MessageCircle className="h-12 w-12 mb-4 mx-auto" />
            <h3 className="text-xl font-black mb-2 text-center">Responsive Design</h3>
            <p className="text-center font-bold">
              Works perfectly on desktop, tablet, and mobile devices
            </p>
          </div>

          <div className="p-6 border-4 shadow-neo transform hover:rotate-2 transition-all duration-300 bg-neoAccent3 text-neoDark border-neoDark">
            <Zap className="h-12 w-12 mb-4 mx-auto" />
            <h3 className="text-xl font-black mb-2 text-center">Collapsible</h3>
            <p className="text-center font-bold">
              Toggle between full and collapsed states on desktop
            </p>
          </div>

          <div className="p-6 border-4 shadow-neo transform hover:-rotate-1 transition-all duration-300 bg-neoAccent text-neoDark border-neoDark">
            <Target className="h-12 w-12 mb-4 mx-auto" />
            <h3 className="text-xl font-black mb-2 text-center">Active States</h3>
            <p className="text-center font-bold">
              Visual highlighting for current page and hover effects
            </p>
          </div>

          <div className="p-6 border-4 shadow-neo transform hover:rotate-1 transition-all duration-300 bg-white text-neoDark border-neoDark">
            <Star className="h-12 w-12 mb-4 mx-auto" />
            <h3 className="text-xl font-black mb-2 text-center">Modern Icons</h3>
            <p className="text-center font-bold">
              Beautiful Lucide React icons for each menu item
            </p>
          </div>

          <div className="p-6 border-4 shadow-neo transform hover:-rotate-2 transition-all duration-300 bg-neoAccent2 text-white border-neoDark">
            <Heart className="h-12 w-12 mb-4 mx-auto" />
            <h3 className="text-xl font-black mb-2 text-center">Dark Mode</h3>
            <p className="text-center font-bold">
              Built-in dark mode toggle with smooth transitions
            </p>
          </div>

          <div className="p-6 border-4 shadow-neo transform hover:rotate-2 transition-all duration-300 bg-neoAccent3 text-neoDark border-neoDark">
            <Users className="h-12 w-12 mb-4 mx-auto" />
            <h3 className="text-xl font-black mb-2 text-center">User Context</h3>
            <p className="text-center font-bold">
              Dynamic menu items based on authentication status
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 border-4 shadow-neo bg-white text-neoDark border-neoDark">
          <h2 className="text-2xl font-black mb-4 text-center">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neoAccent2">Desktop Features:</h3>
              <ul className="space-y-2 font-bold">
                <li>• Click the chevron button to collapse/expand</li>
                <li>• Hover over menu items for smooth animations</li>
                <li>• Active page is highlighted with color</li>
                <li>• Dark mode toggle in the footer</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neoAccent3">Mobile Features:</h3>
              <ul className="space-y-2 font-bold">
                <li>• Tap the menu button to open sidebar</li>
                <li>• Tap outside to close automatically</li>
                <li>• Smooth slide-in animation</li>
                <li>• Full-width overlay when open</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <div className="p-6 border-4 shadow-neo bg-neoAccent text-neoDark border-neoDark">
            <h3 className="text-xl font-black mb-3">Navigation Items</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Home className="h-8 w-8 mx-auto mb-2" />
                <span className="font-bold text-sm">Home</span>
              </div>
              <div className="text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                <span className="font-bold text-sm">Messages</span>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <span className="font-bold text-sm">Popular</span>
              </div>
              <div className="text-center">
                <Settings className="h-8 w-8 mx-auto mb-2" />
                <span className="font-bold text-sm">Settings</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-4 shadow-neo bg-neoAccent2 text-white border-neoDark">
            <h3 className="text-xl font-black mb-3">Design System</h3>
            <p className="font-bold mb-4">
              The sidebar uses a neo-brutalist design system with:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 border-2 border-white">
                <span className="font-black">Neo Colors</span>
                <p className="text-sm">Custom color palette</p>
              </div>
              <div className="text-center p-3 border-2 border-white">
                <span className="font-black">Neo Shadows</span>
                <p className="text-sm">Bold shadow effects</p>
              </div>
              <div className="text-center p-3 border-2 border-white">
                <span className="font-black">Neo Borders</span>
                <p className="text-sm">Thick border styling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 