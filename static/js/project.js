document.addEventListener("DOMContentLoaded", ()=> {
    const track = document.querySelector(".slide-link");
    const leftBtn = document.querySelector(".scroll-left");
    const rightBtn = document.querySelector(".scroll-right");

    let position = 0;
    const slideWidth = 200;

    leftBtn.addEventListener("click", () => {
        position += slideWidth;
        if(position > 0) position = 0;
        track.style.transform = `translateX(${position}px)`;
    });

    rightBtn.addEventListener("click", () => {
        const limit = -(track.offsetWidth - track.parentElement.offsetWidth);
        position -= slideWidth;
        if(position > limit) position = limit;
        track.style.transform = `translateX(${position}px)`;
    })
})
