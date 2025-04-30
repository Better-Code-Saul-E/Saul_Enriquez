let currentSlide = [1, 1, 1, 1, 1, 1, 1]; 
let slideClasses = ["slides1", "slides2", "slides3", "slides4", "slides5", "slides6","slides7"];

displaySlide(1, 0);
displaySlide(1, 1);
displaySlide(1, 2);
displaySlide(1, 3);
displaySlide(1, 4);
displaySlide(1, 5);
displaySlide(1, 6);

function changeSlide(step, slideshowIndex) {
    displaySlide(currentSlide[slideshowIndex] += step, slideshowIndex);
}

function displaySlide(slideNumber, slideshowIndex) {
    let i;
    let slides = document.getElementsByClassName(slideClasses[slideshowIndex]);
    if (slideNumber > slides.length) { currentSlide[slideshowIndex] = 1; }
    if (slideNumber < 1) { currentSlide[slideshowIndex] = slides.length; }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[currentSlide[slideshowIndex] - 1].style.display = "block";
}
