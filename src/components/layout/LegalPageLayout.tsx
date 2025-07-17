import React from 'react';
import MainLayout from './MainLayout';

interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, children }) => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 pb-4 border-b">{title}</h1>
        <div className="prose prose-slate max-w-none">
          {children}
        </div>
      </div>
    </MainLayout>
  );
};

export default LegalPageLayout;
