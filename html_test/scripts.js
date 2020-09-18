let quebrada = false;
function mudaLampada() {
    if (!quebrada)  {
        document.getElementById("luz").src = "./img/lago.jpg";
        quebrada = true;
    };
};