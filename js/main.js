// Loader
$(window).on('load', ()=> {
    $('.loading').fadeOut('slow');
})
// Cursor 
$(document).ready(()=> {
    // Some help functions.
        const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
        const lineEq = (y2, y1, x2, x1, currentVal) => {
            let m = (y2 - y1) / (x2 - x1); 
            let b = y1 - m * x1;
            return m * currentVal + b;
        };
        const lerp = (a, b, n) => (1 - n) * a + n * b;
        const body = document.body;
        const bodyColor = getComputedStyle(body).getPropertyValue('--color-bg').trim() || 'white';
        const getMousePos = (e) => {
            let posx = 0;
            let posy = 0;
            if (!e) e = window.event;
            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            }
            else if (e.clientX || e.clientY)     {
                posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
            }
            return { x : posx, y : posy }
        }
    
        // Window sizes.
        let winsize;
        const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
        calcWinsize();
        // Recalculate window sizes on resize.
        window.addEventListener('resize', calcWinsize);
     class CursorFx {
            constructor(el) {
                this.DOM = {el: el};
                this.DOM.dot = this.DOM.el.querySelector('.cursor__inner--dot');
                this.DOM.circle = this.DOM.el.querySelector('.cursor__inner--circle');
                this.bounds = {dot: this.DOM.dot.getBoundingClientRect(), circle: this.DOM.circle.getBoundingClientRect()};
                this.scale = 1;
                this.opacity = 1;
                this.mousePos = {x:0, y:0};
                this.lastMousePos = {dot: {x:0, y:0}, circle: {x:0, y:0}};
                this.lastScale = 1;
                this.lastOpacity = 1;
                
                this.initEvents();
                requestAnimationFrame(() => this.render());
            }
            initEvents() {
                window.addEventListener('mousemove', ev => this.mousePos = getMousePos(ev));
            }
            render() {
                this.lastMousePos.dot.x = lerp(this.lastMousePos.dot.x, this.mousePos.x - this.bounds.dot.width/2, 1);
                this.lastMousePos.dot.y = lerp(this.lastMousePos.dot.y, this.mousePos.y - this.bounds.dot.height/2, 1);
                this.lastMousePos.circle.x = lerp(this.lastMousePos.circle.x, this.mousePos.x - this.bounds.circle.width/2, 0.15);
                this.lastMousePos.circle.y = lerp(this.lastMousePos.circle.y, this.mousePos.y - this.bounds.circle.height/2, 0.15);
                this.lastScale = lerp(this.lastScale, this.scale, 0.15);
                this.lastOpacity = lerp(this.lastOpacity, this.opacity, 0.1);
                this.DOM.dot.style.transform = `translateX(${(this.lastMousePos.dot.x)}px) translateY(${this.lastMousePos.dot.y}px)`;
                this.DOM.circle.style.transform = `translateX(${(this.lastMousePos.circle.x)}px) translateY(${this.lastMousePos.circle.y}px) scale(${this.lastScale})`;
                this.DOM.circle.style.opacity = this.lastOpacity
                requestAnimationFrame(() => this.render());
            }
            enter() {
                cursor.scale = 2.7;
            }
            leave() {
                cursor.scale = 1;
            }
            click() {
                this.lastScale = 1;
                this.lastOpacity = 0;
            }
        }
        const cursor = new CursorFx(document.querySelector('.cursor'));
    
       [...document.querySelectorAll('[href]')].forEach((link) => {
            link.addEventListener('mouseenter', () => cursor.enter() );
            link.addEventListener('mouseleave', () => cursor.leave() );
            link.addEventListener('click', () => cursor.click() );
        });
});
// MENU ----
$(document).ready(() => {
    $('body').css('overflow-y', 'scroll');
    $('html').css('overflow-y', 'scroll');
    const header = $("header");
    const indicator = $('.nav-indicator');
    const items = $('.nav-item');
    const sections = $('section');
    const menu = $('.menu');
    const navlist = $('.navlist');
    const contactBtn = $('.btn-contact a');
    const rtrn = $('.return');
    const title = $('.logo');
    function handleIndicator(el) {
        items.removeClass('is-active').removeAttr('style');
    
        if (el && el.length) {
            indicator.css({
                'width': el.innerWidth(),
                'left': el.position().left,
                'backgroundColor': el.attr('active-color')
            });
    
            el.addClass('is-active').css('color', el.attr('active-color'));
        }
    }
    function updateNavigation() {
        sections.each(function() {
            const section = $(this);
            const offset = section.offset().top;
            const height = section.height();
            const scroll = $(document).scrollTop();

            if (scroll >= offset && scroll < offset + height) {
                const correspondingNavItem = items.filter(`[href="#${section.attr('id')}"]`);
                handleIndicator(correspondingNavItem);
            }
        });
    }
    contactBtn.on('click', function() {
        const contactBtnOffset = contactBtn.offset().left;
        const windowWidth = $(window).width();
    
        // Déplacer l'indicateur en dehors du nav avec un left plus grand
        indicator.css({'left': contactBtnOffset + windowWidth,
        'backgroundColor': 'transparent'
    });
    });
    items.on('click', function() {
        handleIndicator($(this));
    });
    items.filter('.is-active').each(function() {
        handleIndicator($(this));
    });
    $(document).scroll(() => {
        updateNavigation();
    });
    menu.on('click', () => {
        if(menu.hasClass('open')) menu.removeClass('open'), navlist.removeClass('open');
        else menu.addClass('open'), navlist.addClass('open'); 
    });
    $(window).on("scroll", ()=> {
        header.toggleClass("sticky", window.scrollY > 80);
        menu.removeClass('open'), navlist.removeClass('open');
        // navlist.removeClass('open');
    });
    $( '.js-input' ).keyup(function() {
        if( $(this).val() ) {
           $(this).addClass('not-empty');
        } else {
           $(this).removeClass('not-empty');
        }
    });
    rtrn.on( "mouseenter", () => {title.addClass("hidden")} )
    rtrn.on( "mouseleave", () => {title.removeClass("hidden")} );
    
});