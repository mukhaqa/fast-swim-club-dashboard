/**
 * Страница профиля пользователя FastSwim приложения
 * Показывает информацию о пользователе и позволяет редактировать данные
 */

import { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { User, Mail, Users, Calendar, Shield, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Страница профиля пользователя
 */
const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  // Загружаем профиль при монтировании компонента
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        setProfile(data);
        setEditedProfile(data);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить профиль пользователя",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [toast]);

  // Сохранение изменений профиля
  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      // В реальном приложении здесь будет API вызов для сохранения профиля
      console.log('Сохранение профиля:', editedProfile);
      
      setProfile(editedProfile);
      setIsEditing(false);
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      });
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    }
  };

  // Отмена редактирования
  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Получение роли на русском
  const getRoleInRussian = (role: string) => {
    switch (role) {
      case 'swimmer': return 'Пловец';
      case 'trainer': return 'Тренер';
      case 'admin': return 'Администратор';
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Загружаем профиль...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Профиль не найден</h2>
            <p className="text-muted-foreground">Не удалось загрузить данные профиля</p>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Мой профиль</h1>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Редактировать</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Отмена</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Сохранить</span>
                  </Button>
                </div>
              )}
            </div>
            <p className="text-muted-foreground mt-2">
              Управляйте своими данными и настройками аккаунта
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основная информация */}
            <div className="lg:col-span-2 space-y-6">
              {/* Карточка основных данных */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Основная информация</h2>
                
                <div className="space-y-6">
                  {/* Имя */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Полное имя
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile?.name || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? {...prev, name: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{profile.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email адрес
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile?.email || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? {...prev, email: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{profile.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Группа */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Группа
                    </label>
                    {isEditing ? (
                      <select
                        value={editedProfile?.group || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? {...prev, group: e.target.value} : null)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Начинающие">Начинающие</option>
                        <option value="Средний уровень">Средний уровень</option>
                        <option value="Продвинутые">Продвинутые</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{profile.group}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Боковая панель */}
            <div className="space-y-6">
              {/* Статус и роль */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Статус</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Роль:</span>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {getRoleInRussian(profile.role)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Дата регистрации:</span>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground">
                        {formatDate(profile.joinDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Статистика */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Активность</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Дней в клубе:</span>
                    <span className="font-bold text-primary">
                      {Math.floor((new Date().getTime() - new Date(profile.joinDate).getTime()) / (1000 * 3600 * 24))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Статус:</span>
                    <span className="text-green-600 font-medium">Активный</span>
                  </div>
                </div>
              </div>

              {/* Быстрые действия */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Действия</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Сменить пароль
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Настройки уведомлений
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
                    Удалить аккаунт
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;