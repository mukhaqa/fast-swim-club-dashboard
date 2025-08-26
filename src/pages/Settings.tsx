/**
 * Страница настроек FastSwim приложения
 * Мобильно-адаптированная страница с настройками приложения
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings2, 
  Bell, 
  Moon, 
  Sun, 
  Volume2, 
  Languages, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Smartphone,
  Clock,
  Calendar,
  MessageSquare,
  Vibrate,
  Save
} from "lucide-react";

interface SettingsData {
  notifications: {
    enabled: boolean;
    training: boolean;
    announcements: boolean;
    payments: boolean;
    reminders: boolean;
    sound: boolean;
    vibration: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: 'ru' | 'en';
  };
  privacy: {
    profileVisible: boolean;
    shareStats: boolean;
  };
  app: {
    autoSync: boolean;
    offlineMode: boolean;
    soundVolume: number;
  };
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      enabled: true,
      training: true,
      announcements: true,
      payments: true,
      reminders: true,
      sound: true,
      vibration: true,
    },
    appearance: {
      theme: 'system',
      language: 'ru',
    },
    privacy: {
      profileVisible: true,
      shareStats: false,
    },
    app: {
      autoSync: true,
      offlineMode: false,
      soundVolume: 80,
    }
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Загружаем настройки из localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('fastswim-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
      }
    }
  }, []);

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newSettings;
    });
    setHasChanges(true);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('fastswim-settings', JSON.stringify(settings));
      setHasChanges(false);
      toast({
        title: "Настройки сохранены",
        description: "Ваши настройки успешно применены",
      });
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    }
  };

  const resetSettings = () => {
    const defaultSettings: SettingsData = {
      notifications: {
        enabled: true,
        training: true,
        announcements: true,
        payments: true,
        reminders: true,
        sound: true,
        vibration: true,
      },
      appearance: {
        theme: 'system',
        language: 'ru',
      },
      privacy: {
        profileVisible: true,
        shareStats: false,
      },
      app: {
        autoSync: true,
        offlineMode: false,
        soundVolume: 80,
      }
    };
    
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "Настройки сброшены",
      description: "Применены настройки по умолчанию",
    });
  };

  return (
    <div className="px-4 py-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Настройки</h1>
        <p className="text-muted-foreground">Настройте приложение под себя</p>
      </div>

      <div className="space-y-6">
        {/* Уведомления */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Уведомления</span>
            </CardTitle>
            <CardDescription>
              Управление уведомлениями и их типами
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Включить уведомления</p>
                  <p className="text-sm text-muted-foreground">Основные уведомления приложения</p>
                </div>
              </div>
              <Switch
                checked={settings.notifications.enabled}
                onCheckedChange={(checked) => updateSetting('notifications.enabled', checked)}
              />
            </div>

            {settings.notifications.enabled && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Тренировки</span>
                  </div>
                  <Switch
                    checked={settings.notifications.training}
                    onCheckedChange={(checked) => updateSetting('notifications.training', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span>Объявления</span>
                  </div>
                  <Switch
                    checked={settings.notifications.announcements}
                    onCheckedChange={(checked) => updateSetting('notifications.announcements', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Напоминания</span>
                  </div>
                  <Switch
                    checked={settings.notifications.reminders}
                    onCheckedChange={(checked) => updateSetting('notifications.reminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <span>Звук</span>
                  </div>
                  <Switch
                    checked={settings.notifications.sound}
                    onCheckedChange={(checked) => updateSetting('notifications.sound', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Vibrate className="w-4 h-4 text-muted-foreground" />
                    <span>Вибрация</span>
                  </div>
                  <Switch
                    checked={settings.notifications.vibration}
                    onCheckedChange={(checked) => updateSetting('notifications.vibration', checked)}
                  />
                </div>

                {settings.notifications.sound && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Громкость звука</label>
                    <Slider
                      value={[settings.app.soundVolume]}
                      onValueChange={([value]) => updateSetting('app.soundVolume', value)}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Тихо</span>
                      <span>{settings.app.soundVolume}%</span>
                      <span>Громко</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Внешний вид */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sun className="w-5 h-5" />
              <span>Внешний вид</span>
            </CardTitle>
            <CardDescription>
              Настройка темы и языка приложения
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Тема</label>
              <Select
                value={settings.appearance.theme}
                onValueChange={(value: 'light' | 'dark' | 'system') => updateSetting('appearance.theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4" />
                      <span>Светлая</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center space-x-2">
                      <Moon className="w-4 h-4" />
                      <span>Темная</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <span>Системная</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Язык</label>
              <Select
                value={settings.appearance.language}
                onValueChange={(value: 'ru' | 'en') => updateSetting('appearance.language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">
                    <div className="flex items-center space-x-2">
                      <Languages className="w-4 h-4" />
                      <span>Русский</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="en">
                    <div className="flex items-center space-x-2">
                      <Languages className="w-4 h-4" />
                      <span>English</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Приватность */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Приватность</span>
            </CardTitle>
            <CardDescription>
              Управление конфиденциальностью данных
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Видимость профиля</p>
                <p className="text-sm text-muted-foreground">Позволить другим видеть ваш профиль</p>
              </div>
              <Switch
                checked={settings.privacy.profileVisible}
                onCheckedChange={(checked) => updateSetting('privacy.profileVisible', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Делиться статистикой</p>
                <p className="text-sm text-muted-foreground">Позволить использовать вашу статистику для улучшения сервиса</p>
              </div>
              <Switch
                checked={settings.privacy.shareStats}
                onCheckedChange={(checked) => updateSetting('privacy.shareStats', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Приложение */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings2 className="w-5 h-5" />
              <span>Приложение</span>
            </CardTitle>
            <CardDescription>
              Общие настройки приложения
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Автосинхронизация</p>
                <p className="text-sm text-muted-foreground">Автоматическое обновление данных</p>
              </div>
              <Switch
                checked={settings.app.autoSync}
                onCheckedChange={(checked) => updateSetting('app.autoSync', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Оффлайн режим</p>
                <p className="text-sm text-muted-foreground">Сохранять данные для работы без интернета</p>
              </div>
              <Switch
                checked={settings.app.offlineMode}
                onCheckedChange={(checked) => updateSetting('app.offlineMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Действия */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Помощь и поддержка</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-2" />
              Справка
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Обратная связь
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Выход из аккаунта
            </Button>
          </CardContent>
        </Card>

        {/* Кнопки управления */}
        <div className="flex space-x-3">
          <Button 
            onClick={saveSettings} 
            disabled={!hasChanges}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
          <Button 
            variant="outline" 
            onClick={resetSettings}
          >
            Сбросить
          </Button>
        </div>

        {hasChanges && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                <Settings2 className="w-4 h-4" />
                <span className="text-sm">У вас есть несохраненные изменения</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Settings;