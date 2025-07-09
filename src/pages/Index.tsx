
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import UserRoleSection from '@/components/home/UserRoleSection';

const Index = () => {
  return (
    <MainLayout showSidebar={false}>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <UserRoleSection />
    </MainLayout>
  );
};

export default Index;
