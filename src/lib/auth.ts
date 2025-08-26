/**
 * Функции аутентификации для FastSwim приложения
 * Пока что заглушки, в будущем будут подключены к Supabase
 */

import { UserProfile } from './api';

/**
 * Авторизация пользователя по email (magic link)
 */
export async function signInWithEmail(email: string): Promise<{ success: boolean; message: string }> {
  // Мок авторизации - пока что всегда успешно
  console.log('Попытка входа с email:', email);
  
  // Имитация отправки magic link
  return {
    success: true,
    message: 'Ссылка для входа отправлена на ваш email'
  };
}

/**
 * Выход пользователя
 */
export async function signOut(): Promise<void> {
  // Мок выхода
  console.log('Пользователь вышел из системы');
  // В реальности здесь будет очистка сессии Supabase
}

/**
 * Получить текущего пользователя
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  // Мок - возвращаем тестового пользователя
  // В реальности будет получение из Supabase сессии
  return {
    id: 'current-user',
    name: 'Александр Михайлов',
    email: 'alexander@example.com',
    group: 'Средний уровень',
    trainer: 'Мария Козлова',
    age: 16,
    joinDate: '2024-01-15',
    role: 'swimmer'
  };
}

/**
 * Проверить, авторизован ли пользователь
 */
export async function isAuthenticated(): Promise<boolean> {
  // Мок - всегда авторизован для демонстрации
  return true;
}

/**
 * Проверить, имеет ли пользователь права тренера/админа
 */
export async function isTrainerOrAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'trainer' || user?.role === 'admin';
}