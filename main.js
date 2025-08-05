

class SliderLoop {
  constructor() { }

  initSliderLoop({
    sliderTrack,
    item,
    allItem,
    visibleSlide = 1
  }) {
    this.elemSliderTrack = sliderTrack;
    this.elementsItems = allItem;
    this.elemItem = item;

    this.slideVisible = visibleSlide;
    this.distanceMove = this.elemItem.offsetWidth;
    this.position = -this.distanceMove * this.slideVisible;
    this.currentIndex = 0;
    this.initialLengthItems = allItem.length

    console.log(this.distanceMove, 'this.distanceMove');
    this.cloneItems();
    this.initStartPosition(-this.distanceMove * this.slideVisible);
  }

  cloneItems() {
    for (let index = 0; index < this.slideVisible; index++) {
      const firstClones = this.elementsItems[index].cloneNode(true);
      firstClones.classList.add('clone');
      this.elemSliderTrack.append(firstClones);
    }

    for (let index = 1; index <= this.slideVisible; index++) {
      const lastClones = this.elementsItems[this.elementsItems.length - index].cloneNode(true);
      lastClones.classList.add('clone');
      this.elemSliderTrack.prepend(lastClones);
    }
  }

  removeCloneItems() {
    const clones = this.elemSliderTrack.querySelectorAll('.clone');
    clones.forEach(clone => clone.remove());
  }

  initStartPosition(distance) {
    console.log(distance);
    this.elemSliderTrack.style.transition = 'none';
    this.animateSlider(this.elemSliderTrack, distance);
    setTimeout(() => {
      this.initTransition();
    }, 100);
  }

  initTransition(transitionValue = 'transform 0.4s linear') {
    this.elemSliderTrack.style.transition = transitionValue;
    this.valueTransition = transitionValue
  }

  moveNext() {
    this.currentIndex++;
    this.position -= this.distanceMove;
    this.animateSlider(this.elemSliderTrack, this.position);


    if (this.currentIndex > this.initialLengthItems - 1) {
      console.log('клон');

      setTimeout(() => {
        this.currentIndex = 0;
        this.position = -this.distanceMove * this.slideVisible;
        this.initStartPosition(this.position);
      }, 400);

      setTimeout(() => {
        console.log('вернул');
        this.elemSliderTrack.style.transition = this.valueTransition;
      }, 420);
    }
  }

  movePrev() {
    this.currentIndex--;
    console.log(this.currentIndex);
    this.position += this.distanceMove;
    this.animateSlider(this.elemSliderTrack, this.position);
    if (this.currentIndex <= -this.slideVisible) {

      setTimeout(() => {
        this.currentIndex = this.initialLengthItems - this.slideVisible;
        this.position = -this.distanceMove * this.initialLengthItems;
        this.initStartPosition(this.position)
      }, 400);

      setTimeout(() => {
        this.elemSliderTrack.style.transition = this.valueTransition;
        console.log('вернул');
      }, 420);


    }
  }

  animateSlider(elem, valueTranslate) {
    requestAnimationFrame(() => {
      elem.style.transform = `translateX(${valueTranslate}px)`;
    });
  }


  reset() {
 
    this.distanceMove = this.elemItem.offsetWidth;
    this.currentIndex = 0;
    this.position = -this.distanceMove * this.slideVisible;
    this.elemSliderTrack.style.transform = `translateX(${this.position}px)`;
    this.removeCloneItems();
    this.cloneItems();
    this.initStartPosition(-this.distanceMove * this.slideVisible)

  }
}




const btnNextLoop = document.querySelector("#next-slide");
const btnPrevLoop = document.querySelector("#prev-slide");


let parametersLoopSlider = {
  sliderTrack: document.querySelector(".slider-loop__track"),
  allItem: document.querySelectorAll(".slider-loop__item"),
  item: document.querySelector(".slider-loop__item"),
  visibleSlide: 3
};
let sliderLoop = new SliderLoop();

sliderLoop.initSliderLoop(parametersLoopSlider);



let clickStart = 0
let dragStart = false;

btnNextLoop.addEventListener("click", () => {
  console.log("следующий слайд");
  sliderLoop.moveNext();
 
});
btnPrevLoop.addEventListener("click", () => {
  console.log("предыдущий слайд");
  sliderLoop.movePrev();
 
});

parametersLoopSlider.sliderTrack.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

parametersLoopSlider.sliderTrack.addEventListener('mousedown', (e) => {
  startDrag(e.clientX);
});
parametersLoopSlider.sliderTrack.addEventListener('mousemove', (e) => {
  moveDrag(e.clientX);
});
parametersLoopSlider.sliderTrack.addEventListener('mouseup', () => {
  endDrag();
});
parametersLoopSlider.sliderTrack.addEventListener('mouseleave', () => {  
  endDrag();
});
parametersLoopSlider.sliderTrack.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) { 
    startDrag(e.touches[0].clientX);
  }
});
parametersLoopSlider.sliderTrack.addEventListener('touchmove', (e) => {
  if (e.touches.length === 1) {
    moveDrag(e.touches[0].clientX);
  }
});
parametersLoopSlider.sliderTrack.addEventListener('touchend', () => {
  endDrag();
});
parametersLoopSlider.sliderTrack.addEventListener('touchcancel', () => {
  endDrag();
});



const mobileWidthMediaQuery = window.matchMedia('(max-width: 630px)');

mobileWidthMediaQuery.addEventListener('change', function (event) {
  if (event.matches) {
    sliderLoop.reset();
  } else {
    sliderLoop.reset();
  }
})

let timer;

window.addEventListener('resize', () => {
  if (timer) {
    clearTimeout(timer);
  }

timer = setTimeout(() => {
  sliderLoop.reset()
 
}, 200);

})




function startDrag(clientX) {
  clickStart =clientX
  dragStart = true;
}
function moveDrag(clientX) {
  if (!dragStart) return;
  const valueMove = clientX - clickStart;
  if (valueMove < -20) {
    sliderLoop.moveNext();
    dragStart = false;
  } else if (valueMove > 20) {
    sliderLoop.movePrev();
    dragStart = false;
  }
}
function endDrag() {
  dragStart = false;
}