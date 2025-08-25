/**
 * Футер FastSwim приложения
 * Содержит копирайт и полезные ссылки
 */

import { Link } from "react-router-dom";
import { Waves } from "lucide-react";

/**
 * Компонент нижнего колонтитула
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto safe-area-inset" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">FastSwim</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Современный плавательный клуб для спортсменов всех уровней. 
              Присоединяйтесь к нашему сообществу и достигайте новых высот в плавании.
            </p>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Панель управления
                </Link>
              </li>
              <li>
                <Link 
                  to="/schedule" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Расписание тренировок
                </Link>
              </li>
              <li>
                <Link 
                  to="/announcements" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Объявления клуба
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="tel:+79001234567" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +7 (900) 123-45-67
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@fastswim.ru" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  info@fastswim.ru
                </a>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  г. Москва, ул. Спортивная, 15
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Разделитель */}
        <div className="border-t border-border my-6"></div>

        {/* Копирайт */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} FastSwim. Все права защищены.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link 
              to="/privacy" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link 
              to="/terms" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;