/**
 * Главная панель управления FastSwim приложения
 * Показывает приветствие, предстоящие тренировки и последние объявления
 * Оптимизирована для мобильных устройств
 */

import { useEffect, useState } from "react";
import { getUpcomingTrainings, getAnnouncements, getUserProfile, TrainingSession, Announcement, UserProfile } from "@/lib/api";
import ScheduleCard from "@/components/ScheduleCard";
import AnnouncementCard from "@/components/AnnouncementCard";
import Button from "@/components/Button";
import { Link } from "react-router-dom";
import { Calendar, MessageSquare, Waves, TrendingUp } from "lucide-react";

/**
 * Главная страница панели управления
 */
const Dashboard = () => {
  const [upcomingTrainings, setUpcomingTrainings] = useState<TrainingSession[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Загружаем данные параллельно
        const [trainings, announcements, profile] = await Promise.all([getUpcomingTrainings(), getAnnouncements(), getUserProfile()]);
        setUpcomingTrainings(trainings.slice(0, 3)); // Показываем только первые 3 тренировки
        setRecentAnnouncements(announcements.slice(0, 2)); // Показываем только первые 2 объявления
        setUserProfile(profile);
      } catch (error) {
        console.error('Ошибка загрузки данных панели:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Загружаем панель управления...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Приветственный раздел - адаптирован для мобильных */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-accent rounded-xl p-4 md:p-8 mb-6 md:mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Добро пожаловать, {userProfile?.name || 'Пловец'}!
            </h1>
            <p className="text-white/90 text-base md:text-lg mb-4 md:mb-0">
              Готовы к новым достижениям в плавании? Вот что вас ждет сегодня.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
              <div className="flex items-center space-x-2">
                <Waves className="w-4 h-4 md:w-5 md:h-5" />
                <span>Группа: {userProfile?.group}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                <span>Статус: Активный</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block mt-4 md:mt-0">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Waves className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Предстоящие тренировки */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <h2 className="text-foreground text-xl md:text-2xl lg:text-3xl font-semibold">Расписание занятий</h2>
            </div>
            <Link to="/schedule">
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                Все тренировки
              </Button>
            </Link>
          </div>

          <div className="space-y-3 md:space-y-4">
            {upcomingTrainings.length > 0 ? (
              upcomingTrainings.map(training => (
                <ScheduleCard key={training.id} session={training} />
              ))
            ) : (
              <div className="bg-card rounded-lg border border-border p-6 md:p-8 text-center">
                <Calendar className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm md:text-base">
                  На сегодня тренировок не запланировано
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Последние объявления */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              <h2 className="text-lg md:text-xl font-bold text-foreground">Объявления</h2>
            </div>
            <Link to="/announcements">
              <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                Все
              </Button>
            </Link>
          </div>

          <div className="space-y-3 md:space-y-4">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map(announcement => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))
            ) : (
              <div className="bg-card rounded-lg border border-border p-4 md:p-6 text-center">
                <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-xs md:text-sm">
                  Новых объявлений нет
                </p>
              </div>
            )}
          </div>

          {/* Быстрые действия */}
          <div className="mt-6 md:mt-8 bg-card rounded-lg border border-border p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Быстрые действия</h3>
            <div className="space-y-2 md:space-y-3">
              <Link to="/profile" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-sm">
                  Редактировать профиль
                </Button>
              </Link>
              <Link to="/schedule" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-sm">
                  Посмотреть расписание
                </Button>
              </Link>
              {(userProfile?.role === 'trainer' || userProfile?.role === 'admin') && (
                <Link to="/admin" className="block">
                  <Button variant="secondary" size="sm" className="w-full justify-start text-sm">
                    Админ панель
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;