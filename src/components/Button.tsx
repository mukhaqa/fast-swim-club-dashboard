/**
 * Переиспользуемый компонент кнопки для FastSwim приложения
 * Поддерживает различные варианты стилизации
 */

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Компонент кнопки с различными стилями
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Базовые стили
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          
          // Варианты стилей
          {
            // Основная кнопка (плавательный синий)
            "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary shadow-sm hover:shadow-md": variant === 'primary',
            
            // Второстепенная кнопка (плавательный бирюзовый)
            "bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent shadow-sm hover:shadow-md": variant === 'secondary',
            
            // Кнопка с контуром
            "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground focus:ring-primary": variant === 'outline',
            
            // Призрачная кнопка
            "text-primary hover:bg-primary/10 focus:ring-primary": variant === 'ghost',
          },
          
          // Размеры
          {
            "h-8 px-3 text-sm": size === 'sm',
            "h-10 px-4 text-sm": size === 'md',
            "h-12 px-6 text-base": size === 'lg',
          },
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;