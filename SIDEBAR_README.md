# Modern Responsive Sidebar Component

A modern, responsive sidebar component built with React, TypeScript, and Tailwind CSS. Features a neo-brutalist design system with smooth animations and full mobile support.

## 🚀 Features

### Core Functionality
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Collapsible**: Toggle between full (256px) and collapsed (64px) states on desktop
- **Mobile Overlay**: Full-screen overlay with slide-in animation on mobile
- **Active State Highlighting**: Visual indication of current page
- **Dark Mode Support**: Built-in dark mode toggle with smooth transitions
- **Custom Scrollbar**: Styled scrollbar for better UX

### Design System
- **Neo-Brutalist Style**: Bold colors, thick borders, and strong shadows
- **Custom Color Palette**: 
  - `neoBg`: Light background (#f9f7f3)
  - `neoAccent`: Primary accent (#ffb800)
  - `neoAccent2`: Secondary accent (#ff5e5b)
  - `neoAccent3`: Tertiary accent (#00cecb)
  - `neoDark`: Dark text (#222)
- **Custom Shadows**: `shadow-neo` and `shadow-neo-lg` for depth
- **Custom Border Radius**: `rounded-neo` for consistent styling

### Navigation Features
- **Dynamic Menu Items**: Changes based on authentication status
- **Icon Support**: Lucide React icons for each menu item
- **Hover Effects**: Smooth animations on hover
- **Unread Count Badges**: Support for notification badges
- **Tooltips**: Show labels when collapsed

## 📱 Responsive Behavior

### Desktop (md and up)
- Sidebar is always visible
- Collapsible with chevron button
- Main content adjusts margin automatically
- Smooth transitions between states

### Mobile (below md)
- Sidebar is hidden by default
- Toggle button in top-left corner
- Full-screen overlay when open
- Tap outside to close
- Slide-in animation from left

## 🎨 Customization

### Colors
The sidebar uses the existing neo-brutalist color system defined in `tailwind.config.js`:

```javascript
colors: {
  neoBg: '#f9f7f3',
  neoAccent: '#ffb800',
  neoAccent2: '#ff5e5b',
  neoAccent3: '#00cecb',
  neoDark: '#222',
}
```

### Menu Items
Menu items are dynamically generated based on user authentication status:

**Authenticated Users:**
- Home
- Messages (with unread count)
- Popular
- Profile Settings
- Sidebar Demo
- User List (admin only)

**Unauthenticated Users:**
- Home
- Sidebar Demo
- Login
- Register

### Styling Classes
The component uses several custom CSS classes:

- `.sidebar-transition`: Smooth transitions
- `.sidebar-item-hover`: Hover effects
- `.sidebar-scrollbar`: Custom scrollbar styling
- `.animate-fade-in`: Fade-in animation
- `.animate-slide-in-left`: Slide-in animation

## 🔧 Usage

### Basic Implementation

```tsx
import { Sidebar } from './components/layout/Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neoBg dark:bg-neoDark">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onCollapsedChange={setSidebarCollapsed}
      />
      
      <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls mobile sidebar visibility |
| `onToggle` | function | Yes | Callback for mobile toggle |
| `onCollapsedChange` | function | No | Callback when collapsed state changes |

### Context Dependencies

The sidebar requires these React contexts:
- `AuthContext`: For user authentication status
- `ProfileContext`: For user profile data
- `MessagesContext`: For unread message count

## 🎯 Demo

Visit `/demo` to see the sidebar in action with a comprehensive showcase of all features.

## 📁 File Structure

```
src/
├── components/
│   └── layout/
│       ├── Sidebar.tsx          # Main sidebar component
│       └── Layout.tsx           # Layout wrapper
├── pages/
│   └── SidebarDemoPage.tsx      # Demo page
├── index.css                    # Custom animations and styles
└── App.tsx                      # Routes configuration
```

## 🎨 CSS Animations

Custom animations are defined in `src/index.css`:

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-left {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.sidebar-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🔄 State Management

The sidebar manages several internal states:

- `isCollapsed`: Desktop collapse state
- `isDark`: Dark mode state
- `menuOpen`: Mobile menu state (managed by parent)

## 🎯 Accessibility

- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Semantic HTML structure

## 🚀 Performance

- Efficient re-renders with React.memo
- Optimized transitions with CSS transforms
- Lazy loading of icons
- Minimal DOM manipulation

## 🔧 Development

To modify the sidebar:

1. **Add new menu items**: Update the `menuItems` array in `Sidebar.tsx`
2. **Change colors**: Modify the color classes or update `tailwind.config.js`
3. **Add animations**: Extend the CSS in `index.css`
4. **Modify behavior**: Update the component logic in `Sidebar.tsx`

## 📱 Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile browsers with touch event support
- Progressive enhancement for older browsers

## 🎉 Conclusion

This sidebar component provides a modern, responsive navigation solution that fits perfectly with the neo-brutalist design system. It's fully customizable, accessible, and provides an excellent user experience across all devices. 