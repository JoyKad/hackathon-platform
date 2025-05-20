import React, { useState, useEffect } from 'react';

const MinWidthWarning = () => {
    const [showWarning, setShowWarning] = useState(false);
    const minWidth = window.innerWidth * 0.5; // 50% от начальной ширины экрана
    
    useEffect(() => {
        const handleResize = () => {
            // Проверяем, что ширина меньше 50% от исходной
            const isTooNarrow = window.innerWidth < minWidth;
            setShowWarning(isTooNarrow);
            
            // Добавляем класс к body, если окно слишком узкое
            if (isTooNarrow) {
                document.body.classList.add('window-too-narrow');
            } else {
                document.body.classList.remove('window-too-narrow');
            }
            
            // Если ширина менее 20% от исходной, показываем более агрессивное предупреждение
            if (window.innerWidth < window.innerWidth * 0.2) {
                document.body.style.overflow = 'hidden'; // Блокируем скролл
            } else {
                document.body.style.overflow = ''; // Возвращаем скролл
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Проверяем сразу при монтировании
        
        // Добавляем стили для класса
        const style = document.createElement('style');
        style.innerHTML = `
            .window-too-narrow {
                min-width: 50vw !important;
            }
            
            @media (max-width: 600px) {
                .window-too-narrow::before {
                    content: "";
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 5px;
                    background-color: #dc3545;
                    z-index: 10000;
                }
            }
        `;
        document.head.appendChild(style);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.head.removeChild(style);
        };
    }, [minWidth]);

    if (!showWarning) return null;

    // Определяем размер и положение уведомления в зависимости от ширины окна
    const warningSize = window.innerWidth < 400 ? 'large' : 'normal';

    return (
        <div style={{
            position: 'fixed',
            bottom: warningSize === 'large' ? '50%' : '20px',
            left: warningSize === 'large' ? '50%' : '20px',
            transform: warningSize === 'large' ? 'translate(-50%, 50%)' : 'none',
            backgroundColor: warningSize === 'large' 
                ? 'rgba(220, 53, 69, 0.95)' 
                : 'rgba(220, 53, 69, 0.9)',
            color: 'white',
            padding: warningSize === 'large' ? '15px 20px' : '10px 15px',
            borderRadius: '5px',
            zIndex: 9999,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontSize: warningSize === 'large' ? '16px' : '14px',
            textAlign: 'center',
            maxWidth: warningSize === 'large' ? '90%' : 'auto',
            width: warningSize === 'large' ? 'auto' : 'auto'
        }}>
            {warningSize === 'large' ? 
                'Окно слишком узкое! Рекомендуется увеличить ширину для корректного отображения.' : 
                `Рекомендуемая минимальная ширина окна - ${Math.round(minWidth)}px`}
        </div>
    );
};

export default MinWidthWarning; 