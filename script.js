'use strict';

// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = e => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Learn more button to scroll to section 1
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation and smooth sccrolling
const nav = document.querySelector('.nav');
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Operations tabbed component
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // used closest method coz of span element
  // guard clause
  if (!clicked) return;

  // remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));

  // activate content area
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Navbar fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const hoveredLink = e.target;
    const siblings = hoveredLink.closest('.nav').querySelectorAll('.nav__link');
    // const logo = hoveredLink.closest('.nav').querySelector('img');
    siblings.forEach(ele => {
      if (ele !== hoveredLink) ele.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navbar
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const obsCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);

// Revealing elements on scroll
const allSections = document.querySelectorAll('.section');
const reveal = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(reveal, {
  root: null,
  threshold: 0.2,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const allSectionImages = document.querySelectorAll('.features__img');
const lazyLoad = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  // replace low res image with original image
  entry.target.setAttribute('src', entry.target.dataset.src);

  // unblur image after completely loading original image
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '100px',
});
allSectionImages.forEach(image => imgObserver.observe(image));

// Testimonials Slider component
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
let currSlide = 0;

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const activateDot = slide => {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDot(currSlide);

const changeSlide = slide => {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
  );
};
changeSlide(currSlide);

const nextSlide = () => {
  if (currSlide === slides.length - 1) currSlide = 0;
  else currSlide++;
  changeSlide(currSlide);
  activateDot(currSlide);
};

const prevSlide = () => {
  if (currSlide <= 0) currSlide = slides.length - 1;
  else currSlide--;
  activateDot(currSlide);
  changeSlide(currSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    activateDot(slide);
    changeSlide(slide);
  }
});
