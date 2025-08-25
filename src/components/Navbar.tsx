/**
 * Навигационная панель FastSwim приложения
 * Содержит логотип, ссылки на страницы и кнопку выхода
 */

import { Link, useLocation } from "react-router-dom";
import Button from "./Button";
import { signOut } from "@/lib/auth";
import { LogOut, Waves } from "lucide-react";

/**
 * Компонент верхней навигации
 */
const Navbar = () => {
  const location = useLocation();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // В реальном приложении здесь будет редирект на страницу входа
      console.log('Выход выполнен успешно');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  // Проверяем, активна ли ссылка
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm safe-area-inset">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ minHeight: '64px', paddingTop: 'env(safe-area-inset-top)' }}>
          {/* Логотип и название */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <Link 
              to="/" 
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              FastSwim
            </Link>
          </div>

          {/* Навигационные ссылки */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-4 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px] flex items-center touch-manipulation ${
                isActive('/dashboard')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Панель
            </Link>
            <Link
              to="/schedule"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/schedule')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Расписание
            </Link>
            <Link
              to="/announcements"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/announcements')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Объявления
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Профиль
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Админ панель
            </Link>
          </div>

          {/* Кнопка выхода - адаптирована для сенсорного управления */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-2 min-h-[44px] min-w-[44px] p-3 touch-manipulation"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <div className="md:hidden border-t border-border bg-card">
        <div className="px-4 py-2 space-y-1">
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/dashboard')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Панель
          </Link>
          <Link
            to="/schedule"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/schedule')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Расписание
          </Link>
          <Link
            to="/announcements"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/announcements')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Объявления
          </Link>
          <Link
            to="/profile"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/profile')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Профиль
          </Link>
          <Link
            to="/admin"
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/admin')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Админ панель
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;