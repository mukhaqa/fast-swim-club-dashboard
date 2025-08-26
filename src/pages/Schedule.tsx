/**
 * Страница расписания тренировок FastSwim приложения
 * Мобильно-адаптированная страница с табличным представлением и фильтрами
 */

import { useEffect, useState } from "react";
import { getMonthlyTrainings, TrainingSession } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Calendar, ChevronLeft, ChevronRight, Filter, Users, MapPin, User, Clock, Bell, AlertCircle, CheckCircle2 } from "lucide-react";

const Schedule = () => {
  const [trainings, setTrainings] = useState<TrainingSession[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTrainer, setSelectedTrainer] = useState<string>("all");
  const [selectedPool, setSelectedPool] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [reminders, setReminders] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadTrainings = async () => {
      try {
        setIsLoading(true);
        const data = await getMonthlyTrainings(currentDate.getFullYear(), currentDate.getMonth() + 1);
        setTrainings(data);
      } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainings();
  }, [currentDate]);

  useEffect(() => {
    let filtered = [...trainings];

    if (selectedTrainer !== "all") {
      filtered = filtered.filter(training => training.trainer === selectedTrainer);
    }
    if (selectedPool !== "all") {
      filtered = filtered.filter(training => training.location === selectedPool);
    }
    if (selectedGroup !== "all") {
      filtered = filtered.filter(training => training.group === selectedGroup);
    }

    setFilteredTrainings(filtered);
  }, [trainings, selectedTrainer, selectedPool, selectedGroup]);

  const uniqueTrainers = Array.from(new Set(trainings.map(training => training.trainer)));
  const uniquePools = Array.from(new Set(trainings.map(training => training.location)));
  const uniqueGroups = Array.from(new Set(trainings.map(training => training.group)));

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Добавляем пустые дни в начале месяца
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(null);
    }
    
    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getTrainingsForDay = (day: number) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredTrainings.filter(training => training.date === dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const toggleReminder = (sessionId: string) => {
    setReminders(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
    
    const session = trainings.find(t => t.id === sessionId);
    if (session?.isPersonal) {
      toast({
        title: reminders[sessionId] ? "Напоминание отключено" : "Напоминание включено",
        description: `Персональная тренировка ${session.date} в ${session.time}`,
      });
    }
  };

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Загружаем расписание...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Расписание</h1>
        <p className="text-muted-foreground">Тренировки на месяц</p>
      </div>

      {/* Фильтры */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Фильтры
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тренера" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все тренеры</SelectItem>
                {uniqueTrainers.map(trainer => (
                  <SelectItem key={trainer} value={trainer}>{trainer}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPool} onValueChange={setSelectedPool}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите бассейн" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все бассейны</SelectItem>
                {uniquePools.map(pool => (
                  <SelectItem key={pool} value={pool}>{pool}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите группу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все группы</SelectItem>
                {uniqueGroups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(selectedTrainer !== "all" || selectedPool !== "all" || selectedGroup !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedTrainer("all");
                setSelectedPool("all");
                setSelectedGroup("all");
              }}
              className="w-full"
            >
              Сбросить фильтры
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Навигация по месяцам */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="font-semibold text-lg">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Календарь */}
      <Card>
        <CardContent className="p-2">
          {/* Заголовки дней недели */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Дни месяца */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((day, index) => {
              const dayTrainings = day ? getTrainingsForDay(day) : [];
              const isToday = day && 
                new Date().getDate() === day && 
                new Date().getMonth() === currentDate.getMonth() && 
                new Date().getFullYear() === currentDate.getFullYear();

              return (
                <div
                  key={index}
                  className={`min-h-[60px] p-1 border rounded-md ${
                    !day ? 'bg-muted/30' : ''
                  } ${
                    isToday ? 'bg-primary/10 border-primary' : 'border-border'
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-xs font-medium mb-1 ${
                        isToday ? 'text-primary' : 'text-foreground'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayTrainings.slice(0, 2).map(training => (
                          <div
                            key={training.id}
                            className={`text-xs p-1 rounded text-center ${
                              training.status === 'cancelled' 
                                ? 'bg-destructive/20 text-destructive' 
                                : training.status === 'rescheduled'
                                ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                                : training.isPersonal
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'bg-primary/20 text-primary'
                            }`}
                          >
                            <div className="font-medium">{training.time}</div>
                            <div className="truncate">{training.group}</div>
                            {training.isPersonal && (
                              <div className="flex items-center justify-center mt-1">
                                <Bell 
                                  className={`w-3 h-3 ${
                                    reminders[training.id] ? 'text-primary' : 'text-muted-foreground'
                                  }`} 
                                />
                                <Switch
                                  checked={reminders[training.id] || false}
                                  onCheckedChange={() => toggleReminder(training.id)}
                                  className="ml-1 scale-75"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        {dayTrainings.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dayTrainings.length - 2} еще
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Список тренировок на сегодня */}
      {(() => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const todayTrainings = filteredTrainings.filter(training => training.date === todayStr);
        
        if (todayTrainings.length > 0) {
          return (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Сегодня
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayTrainings.map(training => (
                  <div key={training.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{training.type}</h4>
                        <p className="text-sm text-muted-foreground">{training.group}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {training.status === 'cancelled' && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Отменена
                          </Badge>
                        )}
                        {training.status === 'rescheduled' && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Перенесена
                          </Badge>
                        )}
                        {training.isPersonal && (
                          <Badge variant="outline" className="text-xs">
                            Персональная
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {training.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {training.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {training.trainer}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default Schedule;