/**
 * Главная панель управления FastSwim приложения
 * Показывает приветствие, предстоящие тренировки и последние объявления
 */

import { useEffect, useState } from "react";
import { getUpcomingTrainings, getAnnouncements, getUserProfile, TrainingSession, Announcement, UserProfile } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    return <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Загружаем панель управления...</p>
          </div>
        </main>
      </div>;
  }
  return <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Приветственный раздел */}
          <div className="bg-gradient-to-r from-primary via-primary/90 to-accent rounded-xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Добро пожаловать, {userProfile?.name || 'Пловец'}!
                </h1>
                <p className="text-white/90 text-lg">
                  Готовы к новым достижениям в плавании? Вот что вас ждет сегодня.
                </p>
                <div className="mt-4 flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Waves className="w-5 h-5" />
                    <span>Группа: {userProfile?.group}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Статус: Активный</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                  <Waves className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Предстоящие тренировки */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h2 className="text-foreground text-3xl font-semibold">Расписание занятий</h2>
                </div>
                <Link to="/schedule">
                  <Button variant="outline" size="sm">
                    Все тренировки
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingTrainings.length > 0 ? upcomingTrainings.map(training => <ScheduleCard key={training.id} session={training} />) : <div className="bg-card rounded-lg border border-border p-8 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      На сегодня тренировок не запланировано
                    </p>
                  </div>}
              </div>
            </div>

            {/* Последние объявления */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-bold text-foreground">Объявления</h2>
                </div>
                <Link to="/announcements">
                  <Button variant="ghost" size="sm">
                    Все объявления
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentAnnouncements.length > 0 ? recentAnnouncements.map(announcement => <AnnouncementCard key={announcement.id} announcement={announcement} />) : <div className="bg-card rounded-lg border border-border p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Новых объявлений нет
                    </p>
                  </div>}
              </div>

              {/* Быстрые действия */}
              <div className="mt-8 bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Быстрые действия</h3>
                <div className="space-y-3">
                  <Link to="/profile" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Редактировать профиль
                    </Button>
                  </Link>
                  <Link to="/schedule" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Посмотреть расписание
                    </Button>
                  </Link>
                  {(userProfile?.role === 'trainer' || userProfile?.role === 'admin') && <Link to="/admin" className="block">
                      <Button variant="secondary" size="sm" className="w-full justify-start">
                        Админ панель
                      </Button>
                    </Link>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default Dashboard;