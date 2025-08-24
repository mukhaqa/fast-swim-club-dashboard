/**
 * Главная страница FastSwim приложения
 * Редиректит пользователей на панель управления
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Waves } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  // Автоматически перенаправляем на панель управления
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="text-center">
        <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6">
          <Waves className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">FastSwim</h1>
        <p className="text-xl text-muted-foreground mb-6">Плавательный клуб для достижения новых высот</p>
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground mt-4">Переходим к панели управления...</p>
      </div>
    </div>
  );
};

export default Index;
