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
import MiddleAdmin from 'views/admin/addUser/components/MiddleAdmin';
import MiddleAdminImei from 'views/admin/addUser/components/MiddleAdminImei';
import MiddleAdminDashboard from 'views/admin/addUser/components/MiddleAdminDashboard'; // Import the new component
import ChangeUserImei from 'views/admin/addUser/components/ChangeUserImei';
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
  {
    name: 'Add User',
    layout: '/admin',
    path: '/add-user',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <AddUser />,
    display: true, // Show in sidebar
  },
  {
    name: 'Add Client',
    layout: '/admin',
    path: '/add-client',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <MiddleAdmin />,
    display: true, // Show in sidebar
  },
  {
    name: 'Change User password',
    layout: '/admin',
    path: '/change-user-imei',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <ChangeUserImei />,
    display: true, // Show in sidebar
  },
  {
    name: 'Middle Admin IMEI',
    layout: '/admin',
    path: '/middle-admin-imei',
    icon: <Icon as={MdOutlineShoppingCart} width="20px" height="20px" color="inherit" />,
    component: <MiddleAdminImei />,
    display: true, // Show in sidebar
  },
  {
    name: 'Middle Admin Dashboard',
    layout: '/admin',
    path: '/middle-admin-dashboard',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <MiddleAdminDashboard />,
    display: true, // Hide from sidebar, but keep route accessible
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
    display: false, // Hide from sidebar
  },
  {
    name: 'Forgot Password',
    layout: '/auth',
    path: '/forgot-password',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <ForgetPassword />,
    display: false, // Hide from sidebar
  },
  {
    name: 'Reset Password',
    layout: '/auth',
    path: '/reset-password/:resetToken',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <ResetPassword />,
    display: false, // Hide from sidebar
  },
];

export default routes;