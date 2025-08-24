/**
 * Страница администратора FastSwim приложения
 * Позволяет создавать тренировки и объявления (только для тренеров/админов)
 */

import { useState, useEffect } from "react";
import { createTrainingSession, createAnnouncement } from "@/lib/api";
import { isTrainerOrAdmin } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { Settings, Plus, Calendar, MessageSquare, Users, Clock, MapPin, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Страница административной панели
 */
const Admin = () => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'training' | 'announcement'>('training');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Форма создания тренировки
  const [trainingForm, setTrainingForm] = useState({
    date: '',
    time: '',
    location: '',
    group: '',
    trainer: '',
    type: ''
  });

  // Форма создания объявления
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    body: '',
    author: '',
    urgent: false
  });

  // Проверяем права доступа при монтировании
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const access = await isTrainerOrAdmin();
        setHasAccess(access);
      } catch (error) {
        console.error('Ошибка проверки прав доступа:', error);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, []);

  // Создание новой тренировки
  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!trainingForm.date || !trainingForm.time || !trainingForm.location || 
        !trainingForm.group || !trainingForm.trainer || !trainingForm.type) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await createTrainingSession(trainingForm);
      
      toast({
        title: "Тренировка создана",
        description: "Новая тренировка успешно добавлена в расписание",
      });
      
      // Очищаем форму
      setTrainingForm({
        date: '',
        time: '',
        location: '',
        group: '',
        trainer: '',
        type: ''
      });
    } catch (error) {
      console.error('Ошибка создания тренировки:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать тренировку",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Создание нового объявления
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!announcementForm.title || !announcementForm.body || !announcementForm.author) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await createAnnouncement({
        ...announcementForm,
        date: new Date().toISOString().split('T')[0] // Текущая дата
      });
      
      toast({
        title: "Объявление создано",
        description: "Новое объявление успешно опубликовано",
      });
      
      // Очищаем форму
      setAnnouncementForm({
        title: '',
        body: '',
        author: '',
        urgent: false
      });
    } catch (error) {
      console.error('Ошибка создания объявления:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать объявление",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Проверяем доступ
  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Проверяем права доступа...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center max-w-md">
            <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Доступ ограничен</h2>
            <p className="text-muted-foreground mb-6">
              Эта страница доступна только тренерам и администраторам клуба.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Вернуться назад
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Заголовок страницы */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Settings className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Панель администратора</h1>
            </div>
            <p className="text-muted-foreground">
              Управление тренировками и объявлениями клуба FastSwim
            </p>
          </div>

          {/* Табы */}
          <div className="bg-card rounded-lg border border-border mb-8">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('training')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'training'
                    ? 'text-primary bg-primary/5 border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Создать тренировку</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('announcement')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'announcement'
                    ? 'text-primary bg-primary/5 border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Создать объявление</span>
                </div>
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'training' ? (
                // Форма создания тренировки
                <form onSubmit={handleCreateTraining} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Дата */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Дата тренировки
                      </label>
                      <input
                        type="date"
                        value={trainingForm.date}
                        onChange={(e) => setTrainingForm(prev => ({...prev, date: e.target.value}))}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {/* Время */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Время начала
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="time"
                          value={trainingForm.time}
                          onChange={(e) => setTrainingForm(prev => ({...prev, time: e.target.value}))}
                          className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    {/* Место */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Место проведения
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                          value={trainingForm.location}
                          onChange={(e) => setTrainingForm(prev => ({...prev, location: e.target.value}))}
                          className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Выберите место</option>
                          <option value="Бассейн №1">Бассейн №1</option>
                          <option value="Бассейн №2">Бассейн №2</option>
                          <option value="Открытый бассейн">Открытый бассейн</option>
                        </select>
                      </div>
                    </div>

                    {/* Группа */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Группа участников
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                          value={trainingForm.group}
                          onChange={(e) => setTrainingForm(prev => ({...prev, group: e.target.value}))}
                          className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Выберите группу</option>
                          <option value="Начинающие">Начинающие</option>
                          <option value="Средний уровень">Средний уровень</option>
                          <option value="Продвинутые">Продвинутые</option>
                        </select>
                      </div>
                    </div>

                    {/* Тренер */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Тренер
                      </label>
                      <input
                        type="text"
                        value={trainingForm.trainer}
                        onChange={(e) => setTrainingForm(prev => ({...prev, trainer: e.target.value}))}
                        placeholder="Имя тренера"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {/* Тип тренировки */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Тип тренировки
                      </label>
                      <input
                        type="text"
                        value={trainingForm.type}
                        onChange={(e) => setTrainingForm(prev => ({...prev, type: e.target.value}))}
                        placeholder="Например: Техника плавания, Выносливость..."
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                      className="flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>Создать тренировку</span>
                    </Button>
                  </div>
                </form>
              ) : (
                // Форма создания объявления
                <form onSubmit={handleCreateAnnouncement} className="space-y-6">
                  <div className="space-y-6">
                    {/* Заголовок */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Заголовок объявления
                      </label>
                      <input
                        type="text"
                        value={announcementForm.title}
                        onChange={(e) => setAnnouncementForm(prev => ({...prev, title: e.target.value}))}
                        placeholder="Введите заголовок"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {/* Содержание */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Содержание объявления
                      </label>
                      <textarea
                        value={announcementForm.body}
                        onChange={(e) => setAnnouncementForm(prev => ({...prev, body: e.target.value}))}
                        placeholder="Введите текст объявления..."
                        rows={6}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        required
                      />
                    </div>

                    {/* Автор */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Автор объявления
                      </label>
                      <input
                        type="text"
                        value={announcementForm.author}
                        onChange={(e) => setAnnouncementForm(prev => ({...prev, author: e.target.value}))}
                        placeholder="Ваше имя или должность"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    {/* Важность */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="urgent"
                        checked={announcementForm.urgent}
                        onChange={(e) => setAnnouncementForm(prev => ({...prev, urgent: e.target.checked}))}
                        className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary focus:ring-2"
                      />
                      <label htmlFor="urgent" className="flex items-center space-x-2 text-sm font-medium text-foreground">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <span>Важное объявление</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={isLoading}
                      className="flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>Опубликовать объявление</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;