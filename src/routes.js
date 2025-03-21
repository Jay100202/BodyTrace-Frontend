import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import AddUser from 'views/admin/addUser/components/AddUser';
import ListUserImei from 'views/admin/addUser/components/ListUserImei'; // Import ListUserImei component

import Profile from 'views/admin/profile';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Add User',
    layout: '/admin',
    path: '/add-user',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <AddUser />,
  },
  {
    name: 'List User IMEI',
    layout: '/admin',
    path: '/list-user-imei',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />, // Choose an appropriate icon
    component: <ListUserImei />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;