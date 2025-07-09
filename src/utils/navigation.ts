export const getDashboardPath = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'seller':
      return '/seller/dashboard';
    case 'affiliate':
      return '/affiliate/dashboard';
    default:
      return '/';
  }
};
