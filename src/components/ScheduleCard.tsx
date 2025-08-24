/**
 * Карточка тренировки для отображения в расписании
 * Показывает дату, время, место и информацию о группе
 */

import { TrainingSession } from "@/lib/api";
import { Calendar, Clock, MapPin, Users, User } from "lucide-react";

interface ScheduleCardProps {
  session: TrainingSession;
}

/**
 * Компонент карточки тренировки
 */
const ScheduleCard = ({ session }: ScheduleCardProps) => {
  // Форматируем дату для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Форматируем время
  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // Убираем секунды
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      {/* Заголовок с типом тренировки */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {session.type}
        </h3>
        <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
          <Users className="w-4 h-4" />
          <span>{session.group}</span>
        </div>
      </div>

      {/* Информация о тренировке */}
      <div className="space-y-3">
        {/* Дата */}
        <div className="flex items-center space-x-3 text-muted-foreground">
          <Calendar className="w-4 h-4 text-accent" />
          <span className="text-sm">{formatDate(session.date)}</span>
        </div>

        {/* Время */}
        <div className="flex items-center space-x-3 text-muted-foreground">
          <Clock className="w-4 h-4 text-accent" />
          <span className="text-sm">{formatTime(session.time)}</span>
        </div>

        {/* Место */}
        <div className="flex items-center space-x-3 text-muted-foreground">
          <MapPin className="w-4 h-4 text-accent" />
          <span className="text-sm">{session.location}</span>
        </div>

        {/* Тренер */}
        <div className="flex items-center space-x-3 text-muted-foreground">
          <User className="w-4 h-4 text-accent" />
          <span className="text-sm">Тренер: {session.trainer}</span>
        </div>
      </div>

      {/* Нижняя часть с действиями */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            ID: {session.id}
          </span>
          <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            Записаться →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;