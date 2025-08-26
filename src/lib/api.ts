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
  isPersonal?: boolean;
  reminder?: boolean;
  status?: 'scheduled' | 'cancelled' | 'rescheduled';
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
  trainer: string;
  age: number;
  joinDate: string;
  role: 'swimmer' | 'trainer' | 'admin';
  phone?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  sessionId: string;
  date: string;
  attended: boolean;
  note?: string;
}

export interface MakeupGroup {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  trainer: string;
  availableSpots: number;
  totalSpots: number;
}

export interface TrainerNote {
  id: string;
  userId: string;
  trainerId: string;
  date: string;
  note: string;
  type: 'info' | 'medical' | 'absence';
}

export interface PaymentInfo {
  qrCode: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface AdminStats {
  totalMembers: number;
  activeMembers: number;
  attendanceRate: number;
  upcomingPayments: number;
  groups: GroupStats[];
}

export interface GroupStats {
  name: string;
  memberCount: number;
  attendanceRate: number;
  trainer: string;
}

/**
 * Получить предстоящие тренировки
 */
export async function getUpcomingTrainings(): Promise<TrainingSession[]> {
  return [
    {
      id: '1',
      date: '2024-08-25',
      time: '08:00',
      location: 'Бассейн №1',
      group: 'Начинающие',
      trainer: 'Анна Иванова',
      type: 'Техника плавания',
      status: 'scheduled'
    },
    {
      id: '2',
      date: '2024-08-25',
      time: '10:00',
      location: 'Бассейн №2',
      group: 'Продвинутые',
      trainer: 'Сергей Петров',
      type: 'Скоростные тренировки',
      isPersonal: true,
      reminder: true,
      status: 'scheduled'
    },
    {
      id: '3',
      date: '2024-08-26',
      time: '18:00',
      location: 'Бассейн №1',
      group: 'Средний уровень',
      trainer: 'Мария Козлова',
      type: 'Выносливость',
      status: 'rescheduled'
    }
  ];
}

/**
 * Получить все тренировки на неделю
 */
export async function getWeeklyTrainings(): Promise<TrainingSession[]> {
  return [
    ...(await getUpcomingTrainings()),
    {
      id: '4',
      date: '2024-08-27',
      time: '07:30',
      location: 'Бассейн №1',
      group: 'Начинающие',
      trainer: 'Анна Иванова',
      type: 'Основы плавания',
      status: 'scheduled'
    },
    {
      id: '5',
      date: '2024-08-28',
      time: '19:00',
      location: 'Бассейн №2',
      group: 'Продвинутые',
      trainer: 'Сергей Петров',
      type: 'Соревновательная подготовка',
      status: 'cancelled'
    }
  ];
}

/**
 * Получить объявления клуба
 */
export async function getAnnouncements(): Promise<Announcement[]> {
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
  return {
    id: 'user1',
    name: 'Александр Михайлов',
    email: 'alexander@example.com',
    group: 'Средний уровень',
    trainer: 'Мария Козлова',
    age: 16,
    joinDate: '2024-01-15',
    role: 'swimmer',
    phone: '+7 (999) 123-45-67'
  };
}

/**
 * Получить посещаемость пользователя
 */
export async function getUserAttendance(): Promise<AttendanceRecord[]> {
  return [
    {
      id: '1',
      userId: 'user1',
      sessionId: '1',
      date: '2024-08-20',
      attended: true
    },
    {
      id: '2',
      userId: 'user1',
      sessionId: '2',
      date: '2024-08-22',
      attended: false,
      note: 'Заболел'
    },
    {
      id: '3',
      userId: 'user1',
      sessionId: '3',
      date: '2024-08-24',
      attended: true
    }
  ];
}

/**
 * Получить доступные группы для отработки
 */
export async function getMakeupGroups(): Promise<MakeupGroup[]> {
  return [
    {
      id: '1',
      name: 'Начинающие (отработка)',
      date: '2024-08-27',
      time: '16:00',
      location: 'Бассейн №1',
      trainer: 'Анна Иванова',
      availableSpots: 3,
      totalSpots: 8
    },
    {
      id: '2',
      name: 'Средний уровень (отработка)',
      date: '2024-08-28',
      time: '20:00',
      location: 'Бассейн №2',
      trainer: 'Сергей Петров',
      availableSpots: 1,
      totalSpots: 6
    }
  ];
}

/**
 * Получить заметки тренера
 */
export async function getTrainerNotes(): Promise<TrainerNote[]> {
  return [
    {
      id: '1',
      userId: 'user1',
      trainerId: 'trainer1',
      date: '2024-08-22',
      note: 'Пропустил занятие по болезни',
      type: 'medical'
    }
  ];
}

/**
 * Добавить заметку для тренера
 */
export async function addTrainerNote(note: Omit<TrainerNote, 'id'>): Promise<TrainerNote> {
  const newNote: TrainerNote = {
    ...note,
    id: Date.now().toString()
  };
  
  console.log('Добавлена заметка для тренера:', newNote);
  return newNote;
}

/**
 * Получить информацию об оплате
 */
export async function getPaymentInfo(): Promise<PaymentInfo> {
  return {
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=',
    amount: 2500,
    description: 'Оплата за месяц тренировок',
    dueDate: '2024-09-01',
    status: 'pending'
  };
}

/**
 * Получить статистику для админа
 */
export async function getAdminStats(): Promise<AdminStats> {
  return {
    totalMembers: 45,
    activeMembers: 42,
    attendanceRate: 87,
    upcomingPayments: 12,
    groups: [
      {
        name: 'Начинающие',
        memberCount: 15,
        attendanceRate: 92,
        trainer: 'Анна Иванова'
      },
      {
        name: 'Средний уровень',
        memberCount: 18,
        attendanceRate: 85,
        trainer: 'Мария Козлова'
      },
      {
        name: 'Продвинутые',
        memberCount: 12,
        attendanceRate: 88,
        trainer: 'Сергей Петров'
      }
    ]
  };
}

/**
 * Создать новую тренировку (только для тренеров)
 */
export async function createTrainingSession(session: Omit<TrainingSession, 'id'>): Promise<TrainingSession> {
  const newSession: TrainingSession = {
    ...session,
    id: Date.now().toString()
  };
  
  console.log('Создана новая тренировка:', newSession);
  return newSession;
}

/**
 * Создать новое объявление (только для тренеров/админов)
 */
export async function createAnnouncement(announcement: Omit<Announcement, 'id'>): Promise<Announcement> {
  const newAnnouncement: Announcement = {
    ...announcement,
    id: Date.now().toString()
  };
  
  console.log('Создано новое объявление:', newAnnouncement);
  return newAnnouncement;
}