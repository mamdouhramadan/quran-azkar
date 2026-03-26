"use client";

import { APP_BRAND } from '@/components/config/appBrand';

// Footer renders the app's brand links, social links, and legal metadata.
export const Footer = () => {
  return (
    <footer className="w-full mt-10 bg-card border-t border-primary/10 rounded-t-[2.5rem] pt-12 pb-32">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Side: Brand Logo */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3 text-primary">
              <APP_BRAND.LogoIcon weight="fill" className="text-4xl drop-shadow-sm" />
              <span className="font-black text-2xl tracking-tight">
                  {APP_BRAND.siteName}
              </span>
          </div>
          <p className="text-muted-foreground text-sm text-center md:text-start max-w-sm leading-relaxed">
             {APP_BRAND.description}
          </p>
        </div>

        {/* Right Side: Links & Socials aligned dynamically */}
        <div className="flex flex-col items-center md:items-end gap-6">
          {/* Social Links Component */}
          <div className="flex items-center gap-3">
            {APP_BRAND.socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <social.icon weight="fill" className="text-2xl" />
                <span className="sr-only">{social.label}</span>
              </a>
            ))}
          </div>
          
          {/* Copyrights Stack */}
          <div className="flex flex-col items-center md:items-end gap-3 text-sm text-muted-foreground">
             <div className="flex items-center gap-4">
               {APP_BRAND.legalLinks.map((link, index) => (
                 <div key={link.label} className="flex items-center gap-4">
                   {index > 0 ? <div className="h-4 w-px bg-primary/20"></div> : null}
                   <a href={link.href} className="hover:text-foreground hover:font-bold transition-all">{link.label}</a>
                 </div>
               ))}
             </div>
             <p>
               Copyright © {APP_BRAND.copyright.year}{' '}
               <a href={APP_BRAND.copyright.ownerUrl} className="font-bold hover:text-primary transition-colors">
                 {APP_BRAND.copyright.ownerName}
               </a>
               . {APP_BRAND.copyright.rightsText}
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
