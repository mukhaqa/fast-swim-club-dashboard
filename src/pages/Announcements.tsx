/**
 * Страница объявлений FastSwim приложения
 * Показывает ленту всех объявлений клуба с фильтрацией
 */

import { useEffect, useState } from "react";
import { getAnnouncements, Announcement } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementCard from "@/components/AnnouncementCard";
import Button from "@/components/Button";
import { MessageSquare, Filter, AlertCircle, Search } from "lucide-react";

/**
 * Страница объявлений клуба
 */
const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Загружаем объявления при монтировании компонента
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setIsLoading(true);
        const data = await getAnnouncements();
        setAnnouncements(data);
        setFilteredAnnouncements(data);
      } catch (error) {
        console.error('Ошибка загрузки объявлений:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  // Фильтруем объявления при изменении фильтров
  useEffect(() => {
    let filtered = [...announcements];

    // Фильтр по важности
    if (showUrgentOnly) {
      filtered = filtered.filter(announcement => announcement.urgent);
    }

    // Поиск по тексту
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(announcement => 
        announcement.title.toLowerCase().includes(query) ||
        announcement.body.toLowerCase().includes(query) ||
        announcement.author.toLowerCase().includes(query)
      );
    }

    // Сортируем по дате (новые сначала)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredAnnouncements(filtered);
  }, [announcements, showUrgentOnly, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Загружаем объявления...</p>
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
              <MessageSquare className="w-8 h-8 text-accent" />
              <h1 className="text-3xl font-bold text-foreground">Объявления клуба</h1>
            </div>
            <p className="text-muted-foreground">
              Важные новости и информация от администрации FastSwim
            </p>
          </div>

          {/* Панель фильтров */}
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Поиск */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Поиск по объявлениям..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Фильтры */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Фильтры:</span>
                </div>
                
                <Button
                  variant={showUrgentOnly ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setShowUrgentOnly(!showUrgentOnly)}
                  className="flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Только важные</span>
                </Button>
              </div>
            </div>

            {/* Статистика */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Показано: {filteredAnnouncements.length} из {announcements.length} объявлений
                </span>
                <span>
                  Важных: {announcements.filter(a => a.urgent).length}
                </span>
              </div>
            </div>
          </div>

          {/* Список объявлений */}
          <div className="space-y-6">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))
            ) : (
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery.trim() || showUrgentOnly ? 'Объявления не найдены' : 'Объявлений пока нет'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery.trim() 
                    ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.`
                    : showUrgentOnly 
                      ? 'Важных объявлений пока нет. Попробуйте показать все объявления.'
                      : 'Пока что администрация не опубликовала ни одного объявления.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {(searchQuery.trim() || showUrgentOnly) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setShowUrgentOnly(false);
                      }}
                    >
                      Сбросить фильтры
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Информационная панель */}
          {announcements.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-border p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Следите за новостями</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Здесь публикуются все важные новости клуба, изменения в расписании, 
                    информация о соревнованиях и другие актуальные объявления от администрации.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Совет: добавьте страницу в закладки, чтобы быстро получать доступ к последним новостям.
                  </p>
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

export default Announcements;