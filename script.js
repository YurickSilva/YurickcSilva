document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. CONTROLE DO CURSOR CUSTOMIZADO
       ========================================================================== */
    const customCursor = document.getElementById('customCursor');
    const customCursorDot = document.getElementById('customCursorDot');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let isMoving = false;

    // Apenas ativa e rastreia o cursor se o dispositivo suportar hover (ex: mouse no Desktop)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (hasFinePointer && customCursor && customCursorDot) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // O ponto interno segue o mouse imediatamente
            customCursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            
            if (!isMoving) {
                isMoving = true;
                customCursor.style.opacity = '1';
                customCursorDot.style.opacity = '1';
            }
        });

        // Suavização (Lerp) para o anel externo do cursor
        const animateOuterCursor = () => {
            const lerpFactor = 0.15; // Velocidade de atraso do anel externo
            cursorX += (mouseX - cursorX) * lerpFactor;
            cursorY += (mouseY - cursorY) * lerpFactor;
            
            customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            
            requestAnimationFrame(animateOuterCursor);
        };
        requestAnimationFrame(animateOuterCursor);

        // Ocultar cursor nativo e mostrar os personalizados
        document.addEventListener('mouseleave', () => {
            customCursor.style.opacity = '0';
            customCursorDot.style.opacity = '0';
            isMoving = false;
        });

        document.addEventListener('mouseenter', () => {
            customCursor.style.opacity = '1';
            customCursorDot.style.opacity = '1';
        });

        // Adiciona classe de Hover para expandir o cursor
        const addHoverEffect = () => {
            const targets = document.querySelectorAll('.hover-target, a, button');
            targets.forEach(element => {
                // Evita adicionar ouvintes duplicados
                if (!element.classList.contains('cursor-bound')) {
                    element.classList.add('cursor-bound');
                    
                    element.addEventListener('mouseenter', () => {
                        customCursor.classList.add('hovered');
                        customCursorDot.classList.add('hovered');
                    });
                    
                    element.addEventListener('mouseleave', () => {
                        customCursor.classList.remove('hovered');
                        customCursorDot.classList.remove('hovered');
                    });
                }
            });
        };

        addHoverEffect();

        // Observa o DOM para novos elementos adicionados dinamicamente
        const observer = new MutationObserver(addHoverEffect);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ==========================================================================
       2. MENU OVERLAY (ABRIR / FECHAR)
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    if (menuToggle && menuOverlay) {
        const menuText = menuToggle.querySelector('.menu-text');
        const menuCloseText = menuToggle.querySelector('.menu-close-text');

        const toggleMenu = () => {
            const isActive = menuOverlay.classList.contains('active');
            
            if (isActive) {
                // Fechar Menu
                menuOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
                menuText.style.display = 'inline';
                menuCloseText.style.display = 'none';
            } else {
                // Abrir Menu
                menuOverlay.classList.add('active');
                document.body.classList.add('no-scroll');
                menuText.style.display = 'none';
                menuCloseText.style.display = 'inline';
            }
        };

        menuToggle.addEventListener('click', toggleMenu);

        // Fecha o menu ao clicar em qualquer link interno
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
                menuText.style.display = 'inline';
                menuCloseText.style.display = 'none';
            });
        });
    }

    /* ==========================================================================
       3. EFEITO DE ENTRADA DO LOGO E OUTROS MICRO-COMPORTAMENTOS
       ========================================================================== */
    // Muda o emoji aleatoriamente ao clicar na Logo
    const logoLink = document.getElementById('logoLink');
    const logoEmoji = document.getElementById('logoEmoji');
    const emojis = ['👋', '🚀', '💻', '⚡', '📊', '🔥'];

    if (logoLink && logoEmoji) {
        logoLink.addEventListener('click', (e) => {
            // Se clicado no início da página, apenas previne o salto se já estiver no topo
            if (window.scrollY === 0) {
                e.preventDefault();
            }
            const currentEmoji = logoEmoji.textContent;
            let newEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            
            while (newEmoji === currentEmoji) {
                newEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            }
            
            logoEmoji.textContent = newEmoji;
        });
    }

    /* ==========================================================================
       4. ANIMAÇÕES REVEAL ON SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
});
