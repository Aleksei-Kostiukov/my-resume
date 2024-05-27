import { createCube } from "./cube.js"
createCube();

function general () {

  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  // Скролл

  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

//  Активный якорь

  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  
  //  Перелистывание по якорям
  
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

//  Кнопка вверх
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  // переключатель навигации
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  // прелоадер
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  // Библиотка ручной печати
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 20,
      backDelay: 2000
    });
  }

  // Анимация скилов
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  // Слайдер портфолио
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  // Анимация скролла
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  new PureCounter();

}

general();
// Таймер 
document.addEventListener("DOMContentLoaded", function () {
  let seconds = 0;
  let minutes = 0;

  const timerElement = document.getElementById("timer");

  function updateTimer() {
      seconds++;
      if (seconds === 60) {
          seconds = 0;
          minutes++;
          if (minutes === 60) {
              minutes = 0;
          }
      }

      timerElement.textContent = 
       (minutes < 10 ? "0" + minutes : minutes) + ":" + 
          (seconds < 10 ? "0" + seconds : seconds);
  }

  setInterval(updateTimer, 1000);
});

// Возраст
document.addEventListener("DOMContentLoaded", function () {
  const birthDate = new Date('1992-03-30');
  const ageElement = document.getElementById("age");

  function calculateAge(birthDate) {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
  }

  ageElement.textContent = calculateAge(birthDate);
});

// Принт резюме

window.jsPDF = window.jspdf.jsPDF;

function Convert_HTML_To_PDF() {
  console.log('function Convert_HTML_To_PDF()')
  const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
  });

  const pageHeight = 297;
  const margin = 10;
  let currentPageHeight = margin;

  const sections = document.querySelectorAll('section');

  async function addSectionToPDF(section) {
      const canvas = await html2canvas(section);
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210 - 2 * margin;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      if (currentPageHeight + imgHeight > pageHeight - margin) {
          pdf.addPage();
          currentPageHeight = margin;
      }

      pdf.addImage(imgData, 'PNG', margin, currentPageHeight, imgWidth, imgHeight);
      currentPageHeight += imgHeight + margin;
  }

  async function processSections() {
      for (let i = 0; i < sections.length; i++) {
          await addSectionToPDF(sections[i], i);
      }
      pdf.save('Костюков Алексей резюме фронт джуниор.pdf');
  }

  processSections();
}
window.Convert_HTML_To_PDF = Convert_HTML_To_PDF;
window.addEventListener('scroll', () => {
  const button = document.getElementById('printButton');
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) { 
      button.style.display = 'block';
  }
});

