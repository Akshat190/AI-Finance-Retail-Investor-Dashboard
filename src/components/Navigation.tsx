const links = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Predictions', path: '/predictions' },
  { name: 'Investments', path: '/investments' },
  { name: 'Settings', path: '/settings' },
  { name: 'Profile', path: '/profile' },
];

<Link
  to="/investments"
  className={`px-3 py-2 rounded-md text-sm font-medium ${
    location.pathname === '/investments'
      ? 'bg-gray-900 text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
  }`}
>
  Investments
</Link>

<Link
  to="/settings"
  className={`px-3 py-2 rounded-md text-sm font-medium ${
    location.pathname === '/settings'
      ? 'bg-gray-900 text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
  }`}
>
  Settings
</Link> 