/**
 * Страница расписания тренировок FastSwim приложения
 * Показывает список всех тренировок с возможностью фильтрации по неделям
 */

import { useEffect, useState } from "react";
import { getWeeklyTrainings, TrainingSession } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScheduleCard from "@/components/ScheduleCard";
import Button from "@/components/Button";
import { Calendar, Filter, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Страница расписания тренировок
 */
const Schedule = () => {
  const [trainings, setTrainings] = useState<TrainingSession[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number>(0); // 0 = текущая неделя
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Загружаем тренировки при монтировании компонента
  useEffect(() => {
    const loadTrainings = async () => {
      try {
        setIsLoading(true);
        const data = await getWeeklyTrainings();
        setTrainings(data);
        setFilteredTrainings(data);
      } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainings();
  }, []);

  // Фильтруем тренировки при изменении фильтров
  useEffect(() => {
    let filtered = [...trainings];

    // Фильтр по группе
    if (selectedGroup !== 'all') {
      filtered = filtered.filter(training => training.group === selectedGroup);
    }

    setFilteredTrainings(filtered);
  }, [trainings, selectedGroup]);

  // Получаем уникальные группы для фильтра
  const uniqueGroups = Array.from(new Set(trainings.map(training => training.group)));

  // Форматируем период недели для отображения
  const getWeekPeriod = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)); // Понедельник
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Воскресенье

    const formatDate = (date: Date) => date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short' 
    });

    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  const getWeekTitle = (weekOffset: number) => {
    if (weekOffset === 0) return 'Текущая неделя';
    if (weekOffset === 1) return 'Следующая неделя';
    if (weekOffset === -1) return 'Прошлая неделя';
    return weekOffset > 0 ? `Через ${weekOffset} недель` : `${Math.abs(weekOffset)} недель назад`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Загружаем расписание...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Заголовок страницы */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Расписание тренировок</h1>
            </div>
            <p className="text-muted-foreground">
              Планируйте свои тренировки и следите за расписанием занятий
            </p>
          </div>

          {/* Панель управления */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Навигация по неделям */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWeek(prev => prev - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="text-center min-w-0 flex-1 lg:min-w-64">
                  <div className="font-semibold text-foreground">
                    {getWeekTitle(selectedWeek)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getWeekPeriod(selectedWeek)}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWeek(prev => prev + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Фильтр по группам */}
              <div className="flex items-center space-x-3">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Все группы</option>
                  {uniqueGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Список тренировок */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTrainings.length > 0 ? (
              filteredTrainings.map((training) => (
                <ScheduleCard key={training.id} session={training} />
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-card rounded-lg border border-border p-12 text-center">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Тренировок не найдено
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {selectedGroup === 'all' 
                      ? 'На выбранную неделю тренировки не запланированы'
                      : `Для группы "${selectedGroup}" на выбранную неделю тренировок нет`
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedWeek(0)}
                    >
                      Текущая неделя
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedGroup('all')}
                    >
                      Все группы
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Статистика */}
          {trainings.length > 0 && (
            <div className="mt-8 bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Статистика</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{trainings.length}</div>
                  <div className="text-sm text-muted-foreground">Всего тренировок</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{uniqueGroups.length}</div>
                  <div className="text-sm text-muted-foreground">Групп</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Array.from(new Set(trainings.map(t => t.trainer))).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Тренеров</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {Array.from(new Set(trainings.map(t => t.location))).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Локаций</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Schedule;