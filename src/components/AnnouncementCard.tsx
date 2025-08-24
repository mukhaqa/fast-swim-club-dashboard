/**
 * Карточка объявления для отображения в ленте новостей
 * Показывает заголовок, содержание, автора и дату
 */

import { Announcement } from "@/lib/api";
import { AlertCircle, Calendar, User } from "lucide-react";

interface AnnouncementCardProps {
  announcement: Announcement;
}

/**
 * Компонент карточки объявления
 */
const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  // Форматируем дату для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-card rounded-lg border p-6 hover:shadow-lg transition-all duration-200 ${
      announcement.urgent 
        ? 'border-destructive/20 bg-destructive/5' 
        : 'border-border hover:border-primary/20'
    }`}>
      {/* Заголовок с индикатором важности */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground pr-2">
          {announcement.title}
        </h3>
        {announcement.urgent && (
          <div className="flex items-center space-x-1 bg-destructive/10 text-destructive px-2 py-1 rounded-md text-xs font-medium flex-shrink-0">
            <AlertCircle className="w-3 h-3" />
            <span>Важно</span>
          </div>
        )}
      </div>

      {/* Содержание объявления */}
      <div className="mb-4">
        <p className="text-muted-foreground leading-relaxed">
          {announcement.body}
        </p>
      </div>

      {/* Мета-информация */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          {/* Автор */}
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{announcement.author}</span>
          </div>
          
          {/* Дата */}
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(announcement.date)}</span>
          </div>
        </div>

        {/* ID объявления */}
        <span className="text-xs text-muted-foreground">
          #{announcement.id}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementCard;