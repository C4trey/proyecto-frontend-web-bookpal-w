import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface BookSectionProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function BookSection({ 
  title, 
  subtitle, 
  viewAllLink, 
  icon,
  children 
}: BookSectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-sm mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Ver todos →
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}