/**
 * Экран загрузки FastSwim
 * Отображается при запуске мобильного приложения
 */

import { useState, useEffect } from 'react';
import { Waves } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
}

/**
 * Компонент экрана загрузки
 */
const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Показываем splash screen в течение 2 секунд
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 300);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
        {/* Пустой контент для анимации исчезновения */}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary to-accent flex items-center justify-center safe-area-inset">
      <div className="flex flex-col items-center space-y-6 animate-pulse">
        {/* Логотип */}
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Waves className="w-12 h-12 text-white animate-bounce" />
        </div>
        
        {/* Название приложения */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">FastSwim</h1>
          <p className="text-white/80 text-lg">Плавательный клуб</p>
        </div>
        
        {/* Индикатор загрузки */}
        <div className="flex space-x-2 mt-8">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;