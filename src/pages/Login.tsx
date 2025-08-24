/**
 * Страница авторизации FastSwim приложения
 * Пока что только UI, в будущем будет подключена к Supabase
 */

import { useState } from "react";
import Button from "@/components/Button";
import { signInWithEmail } from "@/lib/auth";
import { Waves, Mail, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Страница входа в систему
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите email адрес",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signInWithEmail(email);
      
      if (result.success) {
        toast({
          title: "Ссылка отправлена",
          description: result.message,
        });
        setEmail("");
      } else {
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при отправке ссылки",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      toast({
        title: "Ошибка",
        description: "Произошла неожиданная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-4">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">FastSwim</h1>
          <p className="text-muted-foreground">
            Войдите в свой аккаунт плавательного клуба
          </p>
        </div>

        {/* Форма входа */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Поле email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email адрес
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Кнопка входа */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Войти через Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Информация о magic link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Мы отправим вам ссылку для входа на указанный email адрес
              </p>
            </div>
          </form>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Впервые в FastSwim?{" "}
            <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Свяжитесь с администратором
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;