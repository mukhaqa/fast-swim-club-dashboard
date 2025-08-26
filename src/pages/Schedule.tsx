/**
 * Страница расписания тренировок FastSwim приложения
 * Мобильно-адаптированная страница с уведомлениями и напоминаниями
 */

import { useEffect, useState } from "react";
import ScheduleCard from "@/components/ScheduleCard";
import { getWeeklyTrainings, TrainingSession } from "@/lib/api";
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
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [reminders, setReminders] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadTrainings = async () => {
      try {
        setIsLoading(true);
        const data = await getWeeklyTrainings();
        setTrainings(data);
      } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainings();
  }, []);

  useEffect(() => {
    let filtered = [...trainings];

    if (selectedGroup !== "all") {
      filtered = filtered.filter(training => training.group === selectedGroup);
    }

    setFilteredTrainings(filtered);
  }, [trainings, selectedGroup]);

  const uniqueGroups = Array.from(new Set(trainings.map(training => training.group)));

  const getWeekPeriod = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

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
        <p className="text-muted-foreground">Ваши тренировки и уведомления</p>
      </div>

      {/* Панель управления */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                disabled={selectedWeek === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <h2 className="font-semibold text-foreground">
                  {getWeekTitle(selectedWeek)}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {getWeekPeriod(selectedWeek)}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(selectedWeek + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите группу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все группы</SelectItem>
              {uniqueGroups.map(group => (
                <SelectItem key={group} value={group}>{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Список тренировок */}
      <div className="space-y-4">
        {filteredTrainings.length > 0 ? (
          filteredTrainings.map(training => (
            <Card key={training.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{training.type}</h3>
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

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(training.date).toLocaleDateString('ru-RU', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })} в {training.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{training.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{training.trainer}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Button size="sm" className="flex-1 mr-2">
                    Записаться
                  </Button>
                  
                  {training.isPersonal && (
                    <div className="flex items-center space-x-2">
                      <Bell className={`w-4 h-4 ${reminders[training.id] ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Switch
                        checked={reminders[training.id] || false}
                        onCheckedChange={() => toggleReminder(training.id)}
                      />
                    </div>
                  )}
                </div>

                {training.status === 'cancelled' && (
                  <div className="mt-3 p-2 bg-destructive/10 rounded-md">
                    <p className="text-xs text-destructive">
                      Тренировка отменена. Свяжитесь с тренером для переноса.
                    </p>
                  </div>
                )}

                {training.status === 'rescheduled' && (
                  <div className="mt-3 p-2 bg-orange-100 dark:bg-orange-900/20 rounded-md">
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      Тренировка перенесена. Проверьте новое время в уведомлениях.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Тренировок не найдено
              </h3>
              <p className="text-muted-foreground mb-6">
                На выбранную неделю и группу тренировки не запланированы
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedGroup("all")}
                  disabled={selectedGroup === "all"}
                >
                  Показать все группы
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedWeek(0)}
                  disabled={selectedWeek === 0}
                >
                  Текущая неделя
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Schedule;