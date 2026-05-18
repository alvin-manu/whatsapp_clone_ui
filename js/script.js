
const chatHeaderLeft = document.querySelector(".chatHeaderLeft");
const closeBtn = document.querySelector(".sidebar-close");
const rightSidebar = document.querySelector(".profileInfo");

chatHeaderLeft.addEventListener("click", () => {
    rightSidebar.classList.add("active");
});

closeBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    rightSidebar.classList.remove("active");
});
