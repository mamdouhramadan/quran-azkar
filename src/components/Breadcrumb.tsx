"use client";

import Link from 'next/link';
import { House, CaretRight } from '@phosphor-icons/react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground font-medium" dir="ltr">
      <Link href="/" aria-label="Home" className="hover:text-primary transition-colors">
        <House weight="fill" className="text-xl" />
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            <CaretRight weight="bold" className="text-muted-foreground/50 rtl:rotate-180 text-sm" />
            {isLast || !item.href ? (
              <span className="text-primary">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};
