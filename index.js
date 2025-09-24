      (function(){
        const items = Array.from(document.querySelectorAll('.nav-item'));
        function setActive(el){
          items.forEach(i=>{
            const isActive = i === el;
            i.classList.toggle('is-active', isActive);
            if(isActive) i.setAttribute('aria-current','page');
            else i.removeAttribute('aria-current');
          });
        }
        document.querySelector('.bottom-nav').addEventListener('click', (e)=>{
          const target = e.target.closest('.nav-item');
          if(!target) return;
          if(target.getAttribute('href') === '#') {
            e.preventDefault();
            setActive(target);
          }
        });
        items.forEach((el, idx)=>{
          el.addEventListener('keydown', (e)=>{
            if(e.key === 'ArrowRight'){
              e.preventDefault();
              const next = items[(idx+1)%items.length];
              next.focus();
            }else if(e.key === 'ArrowLeft'){
              e.preventDefault();
              const prev = items[(idx-1+items.length)%items.length];
              prev.focus();
            }else if(e.key === 'Enter' || e.key === ' '){
              e.preventDefault();
              setActive(el);
            }
          });
        });
      })();
      