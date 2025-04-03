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
import ListUserImei from 'views/admin/addUser/components/ListUserImei'; 
import ForgetPassword from 'views/auth/signIn/ForgetPassword';
import ResetPassword from 'views/auth/signIn/ResetPassword'; 
import Profile from 'views/admin/profile';
import ChangePassword from 'views/auth/signIn/ChangePassword';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    display: true, // Show in sidebar
  },
  // {
  //   name: 'Profile',
  //   layout: '/admin',
  //   path: '/profile',
  //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //   component: <Profile />,
  //   display: true, // Show in sidebar
  // },
  {
    name: 'Add User',
    layout: '/admin',
    path: '/add-user',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <AddUser />,
    display: true, // Show in sidebar
  },
  {
    name: 'List User IMEI',
    layout: '/admin',
    path: '/list-user-imei',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <ListUserImei />,
    display: true, // Show in sidebar
  },
  {
    name: 'Change Password',
    layout: '/admin',
    path: '/change-password',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <ChangePassword />,
    display: false, // Hide from sidebar, but keep route accessible
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    display: false, // Changed to false to hide from sidebar
  },
  {
    name: 'Forgot Password',  // Updated name for consistency
    layout: '/auth',
    path: '/forgot-password', // Changed from /forget-password to /forgot-password
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <ForgetPassword />,
    display: false, // Hide from sidebar, but keep route accessible
  },
  {
    name: 'Reset Password',
    layout: '/auth',
    path: '/reset-password/:resetToken', // Dynamic route for reset token
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <ResetPassword />, 
    display: false, // Hide from sidebar, but keep route accessible
  },
];

export default routes;