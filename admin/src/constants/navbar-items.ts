import * as Icon from 'react-feather'

const navBarItems = [
  {
    to: '/',
    label: 'Dashboard',
    Icon: Icon.Activity,
  },
  {
    to: '/user-manager',
    label: 'User Management',
    Icon: Icon.User,
  },
  {
    label: 'Blog Management',
    Icon: Icon.Bold,
    children: [
      {
        to: '/category-manager',
        label: 'Category',
      },
      {
        to: '/blog-manager',
        label: 'Blog',
      },
    ],
  },
  {
    to: '/package-version-manager',
    label: 'Package Version Management',
    Icon: Icon.Package,
  },
]

export { navBarItems }
