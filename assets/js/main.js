'use strict';

const win = window,
  doc = document,
  docElem = doc.documentElement;
const deviceName = getDeviceType();
console.log(deviceName);
win.ondragstart = function () {
  return false;
};
win.onscroll = function () {
  changeOpacityHeader();
  setAnimation();
};
win.onload = function () {
  changeOpacityHeader();
  setHeaderMenu();
  setIcoBar();
  setCarousel();
  setAnimation();
};

function changeOpacityHeader() {
  let isOpen = doc.getElementById('header-menu').getAttribute('is-open') === 'true';
  if (isOpen) return;

  const positionScoll = docElem.scrollTop;
  const header = doc.getElementById('header');

  if (positionScoll === 0) {
    header.classList.add('header--transparent');
  } else {
    header.classList.remove('header--transparent');
  }
}

function setHeaderMenu() {
  const header = doc.getElementById('header');
  const headerMenu = doc.getElementById('header-menu');
  let isOpen = headerMenu.getAttribute('is-open') === 'true';
  const navigationLinks = header.querySelectorAll('.navigation .navigation__link');
  headerMenu.onclick = (e) => {
    if (isOpen) {
      header.style.height = null;
      headerMenu.innerHTML = '<i class="fas fa-bars fa-lg">';
      if (docElem.scrollTop === 0) {
        header.classList.add('header--transparent');
      }
    } else {
      header.style.height = '100%';
      headerMenu.innerHTML = '<i class="fas fa-times fa-lg"></i>';
      header.classList.remove('header--transparent');
    }
    isOpen = !isOpen;
  };

  navigationLinks.forEach((navigationLink) => {
    navigationLink.onclick = (e) => {
      header.style.height = null;
      headerMenu.innerHTML = '<i class="fas fa-bars fa-lg">';
      if (docElem.scrollTop === 0) {
        header.classList.add('header--transparent');
      }
      isOpen = false;
    };
  });
}

function setIcoBar() {
  const icoBar = doc.getElementById('ico-bar');
  const icoBarValue = icoBar.getAttribute('value');
  const icoBarValueMax = icoBar.getAttribute('value-max');
  var icoBarStyle = icoBar.style;
  icoBarStyle.setProperty('--valuePercent', `${(1 - icoBarValue / icoBarValueMax) * 100}%`);
  icoBarStyle.setProperty('--valueMaxString', `"${12000 / 1000}M USD MAX"`);

  const icoBarMarkets = doc.getElementsByClassName('ico__bar-market');
  for (var i = 0; i < icoBarMarkets.length; i++) {
    const icoBarMarket = icoBarMarkets[i];
    const valueIcoBarMarket = icoBarMarket.getAttribute('value');
    icoBarMarket.style.setProperty('left', `${(valueIcoBarMarket / icoBarValueMax) * 100}%`);
  }
}

function setCarousel() {
  const carousels = doc.querySelectorAll('.carousel');
  carousels.forEach((carousel, carouselIndex) => {
    const stage = carousel.querySelector('.carousel__stage');
    const outer = carousel.querySelector('.carousel__outer');
    const pagination = carousel.querySelector('.carousel__pagination');
    const carouselOuterWidth = outer.offsetWidth;
    const carouselStageWidth = stage.clientWidth;
    const itemWidth = carouselStageWidth / carousel.querySelectorAll('.carousel__item').length;
    let isPressedDown = false;
    let stageClientXMouseDown = 0;
    let cursorXSpace = 0;
    let stageLeftCurrent = 0;
    let stageClientXCurrent = 0;
    const stageLeftMin = -(carouselStageWidth - carouselOuterWidth);
    const pageTotal = Math.ceil(carouselStageWidth / carouselOuterWidth) - (carouselStageWidth % carouselOuterWidth < 100 && carouselStageWidth % carouselOuterWidth > 0 ? 1 : 0);
    let page = 1;
    setCarouselPagination();

    const eventNameClickdown = deviceName === 'desktop' ? 'mousedown' : 'pointerdown';
    outer.addEventListener(eventNameClickdown, (e) => {
      isPressedDown = true;
      stage.style.transition = 'none';
      stageClientXMouseDown = positiveNumber(e.clientX);
      stage.style.transition = '0px';
    });

    const eventNameClickup = deviceName === 'desktop' ? 'mouseup' : 'touchend';
    outer.addEventListener(eventNameClickup, (e) => {
      isPressedDown = false;
      stage.style.transition = '0.4s';
      stageLeftCurrent = stageLeftCurrent + cursorXSpace;
      boundCarouselMouseUp();
    });

    const eventNameClickmove = deviceName === 'desktop' ? 'mousemove' : 'touchmove';
    outer.addEventListener(eventNameClickmove, (e) => {
      if (!isPressedDown) return;
      stageClientXCurrent = positiveNumber(e.clientX || e.touches[0].clientX);
      cursorXSpace = stageClientXCurrent - stageClientXMouseDown;
      stage.style.left = `${stageLeftCurrent + cursorXSpace}px`;
      boundCarouselMouseMove();
    });

    function boundCarouselMouseUp() {
      if (stageLeftCurrent > 0) {
        stageLeftCurrent = 0;
      } else if (stageLeftCurrent < stageLeftMin) {
        stageLeftCurrent = stageLeftMin;
      } else {
        if (cursorXSpace < 0) {
          stageLeftCurrent = -Math.ceil(-stageLeftCurrent / itemWidth) * itemWidth;
        } else {
          stageLeftCurrent = -Math.floor(-stageLeftCurrent / itemWidth) * itemWidth;
        }
      }
      stage.style.left = `${stageLeftCurrent}px`;

      // Set page for carousel
      page = Math.ceil((Math.abs(stageLeftCurrent) + 20) / carouselOuterWidth);
      carousel.querySelector('.carousel__pagination__item--selected').classList.remove('carousel__pagination__item--selected');
      doc.getElementById(`carousel-${carouselIndex}-pagination-item-${page}`).classList.add('carousel__pagination__item--selected');
    }

    function boundCarouselMouseMove() {
      const outerRect = outer.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      if (parseInt(stage.style.left) > 0) {
        stage.style.left = `${cursorXSpace / 6}px`;
      } else if (outerRect.right > stageRect.right) {
        stage.style.left = `${stageLeftMin - (outerRect.right - stageRect.right) / 6}px`;
      }
    }

    function positiveNumber(inputNumber) {
      return inputNumber < 0 ? 0 : inputNumber;
    }

    function setCarouselPagination() {
      for (let p = 1; p <= pageTotal; p++) {
        if (p === page) {
          pagination.innerHTML += `<div id="carousel-${carouselIndex}-pagination-item-${p}" class="carousel__pagination__item carousel__pagination__item--selected " >`;
        } else {
          pagination.innerHTML += `<div id="carousel-${carouselIndex}-pagination-item-${p}" class="carousel__pagination__item">`;
        }

        setTimeout(() => {
          doc.getElementById(`carousel-${carouselIndex}-pagination-item-${p}`).addEventListener('click', (e) => {
            if (p === page) return;
            page = p;
            stage.style.transition = '0.4s';
            stageLeftCurrent = -(carouselOuterWidth * (page - 1));
            stageLeftCurrent = stageLeftCurrent < stageLeftMin ? stageLeftMin : stageLeftCurrent;
            stage.style.left = `${stageLeftCurrent}px`;
            carousel.querySelector('.carousel__pagination__item--selected').classList.remove('carousel__pagination__item--selected');
            doc.getElementById(`carousel-${carouselIndex}-pagination-item-${page}`).classList.add('carousel__pagination__item--selected');
          });
        }, 0);
      }
    }
  });
}

function setAnimation() {
  if (docElem.clientWidth < 1200) {
    const statisticNumberCounters = doc.querySelectorAll('.statistic__number__counter');
    statisticNumberCounters.forEach((statisticNumberCounter) => {
      statisticNumberCounter.innerText = statisticNumberCounter.getAttribute('value-target');
    });
    return;
  }

  const docViewTop = docElem.scrollTop;
  const docViewBottom = docViewTop + docElem.offsetHeight;
  const docClientHeight = docElem.clientHeight;

  animationSectionPromo();
  animationSectionAbout();
  animationSectionService();
  animationSectionRoadMap();
  animationSectionProcess();
  animationSectionStatistic();
  animationSectionIco();
  animationSectionFag();
  animationSectionPlatform();
  animationSectionToken();
  animationSectionDocument();
  animationSectionAdvisor();
  animationSectionTeam();
  animationSectionPress();
  animationSectionNews();
  animationSectionPartner1();
  animationSectionSubscribe();

  // Handle animation:

  // Promo
  function animationSectionPromo() {
    const animationPromos = doc.querySelectorAll('#section-promo .animation');
    for (let i = 0; i < animationPromos.length; i++) {
      const animationPromo = animationPromos[i];
      const isScrolled = isScrolledIntoView(animationPromo, 4);
      if (!isScrolled) continue;

      if (i === 0) {
        // Promo intro
        const animationClass = 'bottom-to-top';
        setAnimation(animationPromo, animationClass);
      } else {
        // Promo logo
        const animationClass = 'right-to-left';
        setAnimation(animationPromo, animationClass);
      }
    }
  }

  // About
  function animationSectionAbout() {
    const animationAbout1 = doc.querySelector('#section-about-1 .animation');
    const animationAbout2 = doc.querySelector('#section-about-2 .animation');
    const isScrolledAbout1 = isScrolledIntoView(animationAbout1, 3);
    const isScrolledAbout2 = isScrolledIntoView(animationAbout2, 3);

    if (isScrolledAbout1) {
      const animationClass = 'left-to-right';
      setAnimation(animationAbout1, animationClass);
    }

    if (isScrolledAbout2) {
      const animationClass = 'right-to-left';
      setAnimation(animationAbout2, animationClass);
    }
  }

  // Service
  function animationSectionService() {
    const animationServices = doc.querySelectorAll('#section-service .animation');
    for (let i = 0; i < animationServices.length; i++) {
      const animationService = animationServices[i];
      const isScrolled = isScrolledIntoView(animationService, 3);
      if (!isScrolled) continue;

      if (i >= 0 && i <= 1) {
        // Service subtile and title
        const animationClass = 'bottom-to-top';
        setAnimation(animationService, animationClass);
      } else {
        // Service Box
        const animationClass = 'bottom-to-top';
        setAnimation(animationService, animationClass);
      }
    }
  }

  // Road Map
  function animationSectionRoadMap() {
    const animationRoadMaps = doc.querySelectorAll('#section-road-map .animation');
    for (let i = 0; i < animationRoadMaps.length; i++) {
      const animationRoadMap = animationRoadMaps[i];
      const isScrolled = isScrolledIntoView(animationRoadMap, 3);
      if (!isScrolled) continue;

      if (i >= 0 && i <= 1) {
        // Process subtile and title
        const animationClass = 'bottom-to-top';
        setAnimation(animationRoadMap, animationClass);
      } else {
        // Road Map item
        const animationClass = 'right-to-left';
        setAnimation(animationRoadMap, animationClass);
      }
    }
  }

  // Process
  function animationSectionProcess() {
    const animationProcessList = doc.querySelectorAll('#section-process .animation');
    for (let i = 0; i < animationProcessList.length; i++) {
      const animationProcess = animationProcessList[i];
      const isScrolled = isScrolledIntoView(animationProcess, 3);
      if (!isScrolled) continue;

      if (i >= 0 && i <= 1) {
        // Process subtile and title
        const animationClass = 'bottom-to-top';
        setAnimation(animationProcess, animationClass);
      } else {
        // Process Step
        const animationClass = 'left-to-right';
        setAnimation(animationProcess, animationClass);
      }
    }
  }

  // Statistic
  function animationSectionStatistic() {
    const animationStatistics = doc.querySelectorAll('#section-statistic .animation');
    for (let i = 0; i < animationStatistics.length; i++) {
      const animationStatistic = animationStatistics[i];
      if (i === 0) {
        // Statistic description
        const isScrolled = isScrolledIntoView(animationStatistic, 3);
        if (!isScrolled) continue;

        const animationClass = 'left-to-right';
        setAnimation(animationStatistic, animationClass);
      } else {
        // Statistic Counter
        const isScrolled = isScrolledIntoView(animationStatistic);
        if (!isScrolled) continue;
        const target = +animationStatistic.getAttribute('value-target');
        const animationDuration = +animationStatistic.getAttribute('animation-duration'); // second
        const speed = animationDuration * 100; // // 10 * value speed = duration animation (milisecond)

        const updateCounter = () => {
          let valueCurrent = +animationStatistic.getAttribute('value-current');
          const increment = target / speed;
          valueCurrent += increment;

          if (valueCurrent < target) {
            animationStatistic.innerText = i === 1 ? valueCurrent.toFixed(6) : i >= 2 && i <= 3 ? valueCurrent.toFixed(3) : valueCurrent.toFixed(0);
            animationStatistic.setAttribute('value-current', valueCurrent);
            setTimeout(updateCounter, 10); // 10 * value speed = duration animation (milisecond)
          } else {
            animationStatistic.innerText = target;
          }
        };
        updateCounter();
      }
    }
  }

  // Ico
  function animationSectionIco() {
    const animationIcoList = doc.querySelectorAll('#section-ico .animation');
    for (let i = 0; i < animationIcoList.length; i++) {
      const animationIco = animationIcoList[i];
      const isScrolled = isScrolledIntoView(animationIco, 3);
      if (!isScrolled) continue;

      if (i >= 0 && i <= 1) {
        // Ico title // and Ico bar market head
        const animationClass = 'bottom-to-top';
        setAnimation(animationIco, animationClass);
      } else {
        // Ico bar market
        const animationClass = 'left-to-right';
        setAnimation(animationIco, animationClass);
      }
    }
  }

  // Fag
  function animationSectionFag() {
    const animationFagList = doc.querySelectorAll('#section-fag .animation');
    for (let i = 0; i < animationFagList.length; i++) {
      const animationFag = animationFagList[i];
      const isScrolled = isScrolledIntoView(animationFag, 3);
      if (!isScrolled) continue;

      if (i === 0) {
        // Fag subtitle
        const animationClass = 'left-to-right';
        setAnimation(animationFag, animationClass);
      } else if (i === 1) {
        // Fag title
        const animationClass = 'right-to-left';
        setAnimation(animationFag, animationClass);
      } else {
        // Fag bar market
        const animationClass = 'bottom-to-top';
        setAnimation(animationFag, animationClass);
      }
    }
  }

  // Platform
  function animationSectionPlatform() {
    const animationPlatForms = doc.querySelectorAll('#section-platform .animation');
    for (let i = 0; i < animationPlatForms.length; i++) {
      const animationPlatForm = animationPlatForms[i];
      const isScrolled = isScrolledIntoView(animationPlatForm, 3);
      if (!isScrolled) continue;

      if (i === 0) {
        // Platform description
        const animationClass = 'left-to-right';
        setAnimation(animationPlatForm, animationClass);
      } else {
        // Platform logo iphone
        const animationClass = 'right-to-left';
        setAnimation(animationPlatForm, animationClass);
      }
    }
  }

  // Token
  function animationSectionToken() {
    const animationTokens = doc.querySelectorAll('#section-token .animation');
    for (let i = 0; i < animationTokens.length; i++) {
      const animationToken = animationTokens[i];
      const isScrolled = isScrolledIntoView(animationToken, 3);
      if (!isScrolled) continue;

      const animationClass = 'bottom-to-top';
      setAnimation(animationToken, animationClass);
    }
  }

  // Document
  function animationSectionDocument() {
    const animationDocuments = doc.querySelectorAll('#section-document .animation');
    for (let i = 0; i < animationDocuments.length; i++) {
      const animationDocument = animationDocuments[i];
      const isScrolled = isScrolledIntoView(animationDocument, 3);
      if (!isScrolled) continue;

      const animationClass = 'right-to-left';
      setAnimation(animationDocument, animationClass);
    }
  }

  // Advisor
  function animationSectionAdvisor() {
    const animationAdvisors = doc.querySelectorAll('#section-advisor .animation');
    for (let i = 0; i < animationAdvisors.length; i++) {
      const animationAdvisor = animationAdvisors[i];
      const isScrolled = isScrolledIntoView(animationAdvisor, 3);
      if (!isScrolled) continue;

      if (i === 0 || i === 2) {
        const animationClass = 'left-to-right';
        setAnimation(animationAdvisor, animationClass);
      } else if (i === 1 || i === 4) {
        const animationClass = 'right-to-left';
        setAnimation(animationAdvisor, animationClass);
      } else {
        const animationClass = 'bottom-to-top';
        setAnimation(animationAdvisor, animationClass);
      }
    }
  }

  // Team
  function animationSectionTeam() {
    const animationTeams = doc.querySelectorAll('#section-team .animation');
    for (let i = 0; i < animationTeams.length; i++) {
      const animationTeam = animationTeams[i];
      const isScrolled = isScrolledIntoView(animationTeam, 3);
      if (!isScrolled) continue;

      if (i === 0 || i === 1 || (i >= 8 && i <= 13)) {
        // Process subtile and title and team-item bottom
        const animationClass = 'right-to-left';
        setAnimation(animationTeam, animationClass);
      } else if ((i >= 2) & (i <= 7)) {
        // team-item top
        const animationClass = 'left-to-right';
        setAnimation(animationTeam, animationClass);
      }
    }
  }

  // Press
  function animationSectionPress() {}

  // News
  function animationSectionNews() {}

  // Partner 1
  function animationSectionPartner1() {}

  // Subscribe
  function animationSectionSubscribe() {}

  // Method:

  function isScrolledIntoView(elem, part = 1) {
    const elemRect = elem.getBoundingClientRect();
    const elemRectTop = elemRect.top;
    const elemRectHeight = elemRect.height;

    return elemRectTop + elemRectHeight / part - docClientHeight <= 0;
  }

  function setAnimation(elem, animationClass) {
    const animationDuration = +elem.getAttribute('animation-duration'); // second
    elem.style.setProperty('animation-duration', `${animationDuration}s`);
    elem.classList.add(animationClass);
    elem.classList.add('opacity-1');
  }
}

function getDeviceType() {
  const userAgent = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}
