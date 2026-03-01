import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShieldCheck, Activity, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout({ children }: { children: ReactNode }) {
  const { username, logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Scan Engine", icon: ShieldCheck },
    { href: "/history", label: "History & Metrics", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/25">
                <ShieldCheck className="w-6 h-6 text-background" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">PHIVORA</h1>
                <p className="text-xs text-primary font-mono tracking-widest uppercase">System Online</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href} className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white text-muted-foreground group">
                    <span className="flex items-center gap-2 relative z-10">
                      <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "group-hover:text-primary/70")} />
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User & Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-white/5">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-white/80">{username}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors group"
                title="Disconnect"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
