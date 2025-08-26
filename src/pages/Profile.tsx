/**
 * Личный кабинет FastSwim приложения
 * Мобильно-адаптированная страница с профилем, посещаемостью, оплатой и админкой
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "@/lib/auth";
import { getUserProfile, getUserAttendance, getMakeupGroups, getPaymentInfo, getAdminStats, addTrainerNote, UserProfile, AttendanceRecord, MakeupGroup, PaymentInfo, AdminStats, TrainerNote } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Calendar, 
  CreditCard, 
  Settings2, 
  Phone, 
  Mail, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus,
  QrCode,
  TrendingUp,
  BarChart3,
  UserCheck,
  AlertCircle,
  MessageSquare,
  Loader2,
  LogOut
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [makeupGroups, setMakeupGroups] = useState<MakeupGroup[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [trainerNote, setTrainerNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { toast } = useToast();

  // Проверяем авторизацию
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const [profileData, attendanceData, makeupData, paymentData] = await Promise.all([
          getUserProfile(),
          getUserAttendance(),
          getMakeupGroups(),
          getPaymentInfo()
        ]);

        setProfile(profileData);
        setAttendance(attendanceData);
        setMakeupGroups(makeupData);
        setPaymentInfo(paymentData);

        // Загружаем админ статистику если пользователь тренер/админ
        if (profileData.role === 'trainer' || profileData.role === 'admin') {
          const stats = await getAdminStats();
          setAdminStats(stats);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных профиля:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные профиля",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated()) {
      loadProfileData();
    }
  }, [toast]);

  const handleAddTrainerNote = async () => {
    if (!trainerNote.trim() || !profile) return;

    try {
      setIsAddingNote(true);
      await addTrainerNote({
        userId: profile.id,
        trainerId: profile.id,
        date: new Date().toISOString().split('T')[0],
        note: trainerNote,
        type: 'info'
      });

      setTrainerNote("");
      toast({
        title: "Заметка добавлена",
        description: "Заметка для тренера успешно отправлена",
      });
    } catch (error) {
      console.error('Ошибка добавления заметки:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить заметку",
        variant: "destructive",
      });
    } finally {
      setIsAddingNote(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Загружаем профиль...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Профиль не найден</h2>
          <p className="text-muted-foreground">Не удалось загрузить данные профиля</p>
        </div>
      </div>
    );
  }

  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.attended).length / attendance.length) * 100)
    : 0;

  return (
    <div className="px-4 py-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Личный кабинет</h1>
        <p className="text-muted-foreground">Добро пожаловать, {profile.name}!</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full mb-6 ${
          (profile.role === 'trainer' || profile.role === 'admin') ? 'grid-cols-4' : 'grid-cols-3'
        }`}>
          <TabsTrigger value="profile" className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center gap-1 py-2">
              <User className="w-4 h-4" />
              <span className="text-xs">Профиль</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center gap-1 py-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Посещения</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="payment" className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center gap-1 py-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs">Оплата</span>
            </div>
          </TabsTrigger>
          {(profile.role === 'trainer' || profile.role === 'admin') && (
            <TabsTrigger value="admin" className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center gap-1 py-2">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs">Админ</span>
              </div>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Профиль */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Основная информация</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ФИО</label>
                  <p className="text-foreground font-medium">{profile.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Возраст</label>
                  <p className="text-foreground font-medium">{profile.age} лет</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Группа</label>
                  <p className="text-foreground font-medium">{profile.group}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Тренер</label>
                  <p className="text-foreground font-medium">{profile.trainer}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{profile.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Заметка для тренера */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Заметка для тренера</span>
              </CardTitle>
              <CardDescription>
                Сообщите тренеру о пропуске занятия или других важных моментах
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Например: Не смогу прийти на тренировку 25 августа из-за болезни"
                value={trainerNote}
                onChange={(e) => setTrainerNote(e.target.value)}
                className="min-h-[80px]"
              />
              <Button 
                onClick={handleAddTrainerNote}
                disabled={!trainerNote.trim() || isAddingNote}
                className="w-full"
              >
                {isAddingNote ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Отправить заметку
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Посещаемость */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Посещаемость</span>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {attendanceRate}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {record.attended ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{formatDate(record.date)}</p>
                        {record.note && (
                          <p className="text-sm text-muted-foreground">{record.note}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={record.attended ? "default" : "destructive"}>
                      {record.attended ? "Посетил" : "Пропуск"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Свободные группы для отработки */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Отработка пропусков</span>
              </CardTitle>
              <CardDescription>
                Доступные группы для отработки пропущенных занятий
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {makeupGroups.map((group) => (
                <div key={group.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{group.name}</h3>
                    <Badge variant="outline">
                      {group.availableSpots}/{group.totalSpots} мест
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(group.date)} в {group.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{group.trainer}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full mt-3"
                    disabled={group.availableSpots === 0}
                  >
                    {group.availableSpots > 0 ? "Записаться" : "Нет мест"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Оплата */}
        <TabsContent value="payment" className="space-y-4">
          {paymentInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Оплата тренировок</span>
                </CardTitle>
                <CardDescription>{paymentInfo.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-muted p-6 rounded-lg">
                  <QrCode className="w-32 h-32 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Сканируйте QR-код для оплаты</p>
                  <p className="text-2xl font-bold text-foreground">{paymentInfo.amount} ₽</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Срок оплаты:</span>
                    <span className="font-medium">{formatDate(paymentInfo.dueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Статус:</span>
                    <Badge variant={
                      paymentInfo.status === 'paid' ? 'default' : 
                      paymentInfo.status === 'overdue' ? 'destructive' : 'secondary'
                    }>
                      {paymentInfo.status === 'paid' ? 'Оплачено' : 
                       paymentInfo.status === 'overdue' ? 'Просрочено' : 'Ожидает оплаты'}
                    </Badge>
                  </div>
                </div>

                <Button className="w-full">
                  Открыть в банковском приложении
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Админ панель */}
        {(profile.role === 'trainer' || profile.role === 'admin') && adminStats && (
          <TabsContent value="admin" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{adminStats.totalMembers}</p>
                      <p className="text-xs text-muted-foreground">Всего участников</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{adminStats.activeMembers}</p>
                      <p className="text-xs text-muted-foreground">Активные</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{adminStats.attendanceRate}%</p>
                      <p className="text-xs text-muted-foreground">Посещаемость</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{adminStats.upcomingPayments}</p>
                      <p className="text-xs text-muted-foreground">Ожидают оплаты</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Статистика по группам</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {adminStats.groups.map((group, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">Тренер: {group.trainer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{group.memberCount} чел.</p>
                      <p className="text-sm text-muted-foreground">{group.attendanceRate}% посещ.</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;