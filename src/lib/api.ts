/**
 * API функции для FastSwim приложения
 * Пока что возвращают мок данные, в будущем будут подключены к Supabase
 */

export interface TrainingSession {
  id: string;
  date: string;
  time: string;
  location: string;
  group: string;
  trainer: string;
  type: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  urgent: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  group: string;
  joinDate: string;
  role: 'swimmer' | 'trainer' | 'admin';
}

/**
 * Получить предстоящие тренировки
 */
export async function getUpcomingTrainings(): Promise<TrainingSession[]> {
  // Мок данные - в будущем заменить на реальный API вызов
  return [
    {
      id: '1',
      date: '2024-08-25',
      time: '08:00',
      location: 'Бассейн №1',
      group: 'Начинающие',
      trainer: 'Анна Иванова',
      type: 'Техника плавания'
    },
    {
      id: '2',
      date: '2024-08-25',
      time: '10:00',
      location: 'Бассейн №2',
      group: 'Продвинутые',
      trainer: 'Сергей Петров',
      type: 'Скоростные тренировки'
    },
    {
      id: '3',
      date: '2024-08-26',
      time: '18:00',
      location: 'Бассейн №1',
      group: 'Средний уровень',
      trainer: 'Мария Козлова',
      type: 'Выносливость'
    }
  ];
}

/**
 * Получить все тренировки на неделю
 */
export async function getWeeklyTrainings(): Promise<TrainingSession[]> {
  // Мок данные - расширенный список тренировок
  return [
    ...(await getUpcomingTrainings()),
    {
      id: '4',
      date: '2024-08-27',
      time: '07:30',
      location: 'Бассейн №1',
      group: 'Начинающие',
      trainer: 'Анна Иванова',
      type: 'Основы плавания'
    },
    {
      id: '5',
      date: '2024-08-28',
      time: '19:00',
      location: 'Бассейн №2',
      group: 'Продвинутые',
      trainer: 'Сергей Петров',
      type: 'Соревновательная подготовка'
    }
  ];
}

/**
 * Получить объявления клуба
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  // Мок данные - объявления клуба
  return [
    {
      id: '1',
      title: 'Новое расписание тренировок',
      body: 'С 1 сентября вводится новое расписание тренировок. Все изменения можно посмотреть в разделе "Расписание".',
      author: 'Администрация клуба',
      date: '2024-08-20',
      urgent: true
    },
    {
      id: '2',
      title: 'Соревнования по плаванию',
      body: 'Приглашаем всех участников на городские соревнования по плаванию, которые состоятся 15 сентября в спорткомплексе "Водный мир".',
      author: 'Сергей Петров',
      date: '2024-08-18',
      urgent: false
    },
    {
      id: '3',
      title: 'Обновление бассейна №2',
      body: 'В период с 25 по 30 августа бассейн №2 будет закрыт на техническое обслуживание. Все тренировки переносятся в бассейн №1.',
      author: 'Техническая служба',
      date: '2024-08-15',
      urgent: true
    }
  ];
}

/**
 * Получить профиль пользователя
 */
export async function getUserProfile(): Promise<UserProfile> {
  // Мок данные - профиль пользователя
  return {
    id: 'user1',
    name: 'Александр Михайлов',
    email: 'alexander@example.com',
    group: 'Средний уровень',
    joinDate: '2024-01-15',
    role: 'swimmer'
  };
}

/**
 * Создать новую тренировку (только для тренеров)
 */
export async function createTrainingSession(session: Omit<TrainingSession, 'id'>): Promise<TrainingSession> {
  // Мок создания - в реальности будет сохранено в базу данных
  const newSession: TrainingSession = {
    ...session,
    id: Date.now().toString() // Временный ID
  };
  
  console.log('Создана новая тренировка:', newSession);
  return newSession;
}

/**
 * Создать новое объявление (только для тренеров/админов)
 */
export async function createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement> {
  // Мок создания - в реальности будет сохранено в базу данных
  const newAnnouncement: Announcement = {
    ...announcement,
    id: Date.now().toString() // Временный ID
  };
  
  console.log('Создано новое объявление:', newAnnouncement);
  return newAnnouncement;
}