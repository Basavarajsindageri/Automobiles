import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-xs text-slate-500 py-3 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="flex items-center gap-1 hover:text-brand-600 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {item.link ? (
            <Link to={item.link} className="hover:text-brand-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-semibold truncate max-w-xs">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
