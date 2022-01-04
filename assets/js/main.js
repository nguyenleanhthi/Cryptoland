window.onscroll = function () {
  changeOpacityHeader();
};
window.onload = function () {
  changeOpacityHeader();
  setIcoBar();
  setCarousel();
};

function changeOpacityHeader() {
  const positionScoll = document.documentElement.scrollTop;
  const header = document.getElementById('header');
  if (positionScoll === 0) {
    header.classList.add('header--transparent');
  } else {
    header.classList.remove('header--transparent');
  }
}

function setIcoBar() {
  const icoBar = document.getElementById('ico-bar');
  const icoBarValue = icoBar.getAttribute('value');
  const icoBarValueMax = icoBar.getAttribute('value-max');
  var icoBarStyle = icoBar.style;
  icoBarStyle.setProperty('--valuePercent', `${(1 - icoBarValue / icoBarValueMax) * 100}%`);
  icoBarStyle.setProperty('--valueMaxString', `${12000 / 1000}M USD MAX`);

  const icoBarMarkets = document.getElementsByClassName('ico__bar-market');
  for (var i = 0; i < icoBarMarkets.length; i++) {
    const icoBarMarket = icoBarMarkets[i];
    const valueIcoBarMarket = icoBarMarket.getAttribute('value');
    icoBarMarket.style.setProperty('left', `${(valueIcoBarMarket / icoBarValueMax) * 100}%`);
  }
}

function setCarousel() {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach((carousel, carouselIndex) => {
    const stage = carousel.querySelector('.carousel__stage');
    const outer = carousel.querySelector('.carousel__outer');
    const carouselOuterWidth = outer.offsetWidth;
    const pagination = carousel.querySelector('.carousel__pagination');
    const itemOnePage = carousel.getAttribute('item-one-page');
    const itemTotal = carousel.querySelectorAll('.carousel__item').length;
    const itemWidth = carouselOuterWidth / itemOnePage;
    const carouselStageWidth = itemTotal * itemWidth;
    stage.style.width = carouselStageWidth + 'px';

    let isPressedDown = false;
    let stageClientXMouseDown = 0;
    let cursorXSpace = 0;
    let stageLeftCurrent = 0;
    const stageLeftMin = -(carouselStageWidth - carouselOuterWidth);
    const pageTotal = Math.ceil(carouselStageWidth / carouselOuterWidth);
    let page = 1;

    setCarouselPagination();

    outer.addEventListener('mousedown', (e) => {
      isPressedDown = true;
      stage.style.transition = 'none';
      stageClientXMouseDown = positiveNumber(e.clientX);
      stage.style.transition = '0px';
    });

    outer.addEventListener('mouseup', (e) => {
      isPressedDown = false;
      stage.style.transition = '0.4s';
      stageLeftCurrent = stageLeftCurrent + cursorXSpace;
      boundCarouselMouseUp();
    });

    outer.addEventListener('mousemove', (e) => {
      if (!isPressedDown) return;
      stageClientXCurrent = positiveNumber(e.clientX);
      cursorXSpace = stageClientXCurrent - stageClientXMouseDown;
      stage.style.left = `${stageLeftCurrent + cursorXSpace}px`;
      boundCarouselMouseMove();
    });

    function boundCarouselMouseUp() {
      console.log(stageLeftCurrent, -carouselOuterWidth);
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
      page = Math.ceil((Math.abs(stageLeftCurrent) + 0.01) / carouselOuterWidth);
      carousel.querySelector('.carousel__pagination__item--selected').classList.remove('carousel__pagination__item--selected');
      document.getElementById(`carousel-${carouselIndex}-pagination-item-${page}`).classList.add('carousel__pagination__item--selected');
    }

    function boundCarouselMouseMove() {
      const outerRect = outer.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      console.log(stageLeftCurrent, cursorXSpace, stageLeftMin);
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
          document.getElementById(`carousel-${carouselIndex}-pagination-item-${p}`).addEventListener('click', (e) => {
            if (p === page) return;
            page = p;
            stage.style.transition = '0.4s';
            stageLeftCurrent = -(carouselOuterWidth * (page - 1));
            stageLeftCurrent = stageLeftCurrent < stageLeftMin ? stageLeftMin : stageLeftCurrent;
            stage.style.left = `${stageLeftCurrent}px`;
            carousel.querySelector('.carousel__pagination__item--selected').classList.remove('carousel__pagination__item--selected');
            document.getElementById(`carousel-${carouselIndex}-pagination-item-${page}`).classList.add('carousel__pagination__item--selected');
          });
        }, 0);
      }
    }
  });
}
