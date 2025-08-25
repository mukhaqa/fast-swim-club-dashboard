/**
 * Мобильная нижняя навигация для FastSwim
 * Специально оптимизирована для мобильных устройств с поддержкой safe area
 */

import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Bell, User, Settings } from "lucide-react";

/**
 * Компонент нижней навигации для мобильных устройств
 */
const MobileBottomNav = () => {
  const location = useLocation();
  
  // Проверяем, активна ли ссылка
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Главная',
    },
    {
      path: '/schedule',
      icon: Calendar,
      label: 'Расписание',
    },
    {
      path: '/announcements',
      icon: Bell,
      label: 'Новости',
    },
    {
      path: '/profile',
      icon: User,
      label: 'Профиль',
    },
    {
      path: '/admin',
      icon: Settings,
      label: 'Админ',
    },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg md:hidden safe-area-inset"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center p-2 min-w-[60px] min-h-[60px] rounded-lg transition-colors touch-manipulation ${
              isActive(path)
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;