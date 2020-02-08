var elemOpen = document.querySelector(".js-toggle-button1");
var elemClose = document.querySelector(".js-toggle-button2");
var mainNav = document.querySelectorAll(".main-nav__item");

if(document.documentElement.clientWidth < 768){
  for (var i = 0; i < mainNav.length; i++){
    mainNav[i].style.display="none";
  }
}

elemOpen.onclick = function(){
  elemOpen.classList.remove("page-header__active");
  elemClose.classList.add("page-header__active");
  for (var i = 0; i < mainNav.length; i++){
    mainNav[i].style.display="block";
  }
};

elemClose.onclick = function(){
  elemClose.classList.remove("page-header__active");
  for (var i = 0; i < mainNav.length; i++){
    mainNav[i].style.display="none";
  }
  elemOpen.classList.add("page-header__active");
};
