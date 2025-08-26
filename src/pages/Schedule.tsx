/**
 * Страница расписания тренировок FastSwim приложения
 * Мобильно-адаптированная страница со списком тренировок на день и фильтрами
 */

import { useEffect, useState } from "react";
import { getMonthlyTrainings, TrainingSession } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Filter, MapPin, User, Clock, Bell, AlertCircle } from "lucide-react";

const Schedule = () => {
  const [trainings, setTrainings] = useState<TrainingSession[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTrainer, setSelectedTrainer] = useState<string>("all");
  const [selectedPool, setSelectedPool] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [reminders, setReminders] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadTrainings = async () => {
      try {
        setIsLoading(true);
        const date = new Date(selectedDate);
        const data = await getMonthlyTrainings(date.getFullYear(), date.getMonth() + 1);
        setTrainings(data);
      } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainings();
  }, [selectedDate]);

  useEffect(() => {
    let filtered = trainings.filter(training => training.date === selectedDate);

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
  }, [trainings, selectedDate, selectedTrainer, selectedPool, selectedGroup]);

  const uniqueTrainers = Array.from(new Set(trainings.map(training => training.trainer)));
  const uniquePools = Array.from(new Set(trainings.map(training => training.location)));
  const uniqueGroups = Array.from(new Set(trainings.map(training => training.group)));

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
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
        <p className="text-muted-foreground">Тренировки на {formatDate(selectedDate)}</p>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Дата</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>

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

      {/* Список тренировок */}
      <div className="space-y-4">
        {filteredTrainings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Нет тренировок</h3>
              <p className="text-muted-foreground">На выбранную дату тренировки не найдены</p>
            </CardContent>
          </Card>
        ) : (
          filteredTrainings.map(training => (
            <Card key={training.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{training.type}</h3>
                    <p className="text-muted-foreground">{training.group}</p>
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
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Время:</span>
                    <span>{training.time}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Бассейн:</span>
                    <span>{training.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Тренер:</span>
                    <span>{training.trainer}</span>
                  </div>
                </div>

                {training.isPersonal && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Напоминание</span>
                      </div>
                      <Switch
                        checked={reminders[training.id] || false}
                        onCheckedChange={() => toggleReminder(training.id)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Получать уведомления о персональной тренировке
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;