
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  imageSrc: string;
  linkTo: string;
  bgColor: string;
}

const CategoryCard = ({ title, description, imageSrc, linkTo, bgColor }: CategoryCardProps) => {
  return (
    <Link to={linkTo} className="group block">
      <Card className={`card-hover overflow-hidden h-full ${bgColor} transition-all duration-300 hover:shadow-lg`}>
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <p className="text-gray-600 text-sm">{description}</p>
          <div className="mt-4 text-primary font-medium flex items-center">
            <span>Browse Products</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
