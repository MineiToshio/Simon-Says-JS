let niveles;
let velocidad;
let teclas;
const pantallas = { levelbox: 1, keyboard: 2 };

function siguienteNivel(nivelActual) {
  if(nivelActual === niveles)
    return swal({
      title: "Ganaste",
      icon: "success"
    });

  swal({
    timer: 1000,
    title: `Nivel ${nivelActual + 1}`,
    buttons: false
  });

  for(let i = 0; i <= nivelActual; i++) {
    setTimeout(() => {
      activate(teclas[i]);
    }, velocidad * i + 1500);
  }

  let i = 0;
  let teclaActual = teclas[i];
  window.addEventListener("keydown", onkeydown);
  document.getElementById("keyboard").addEventListener("click", onclick);

  function onkeydown(e) {
    keyPressed(e.keyCode);
  }

  function onclick(e) {
    if (e.target.className === "key") {
      keyPressed(parseInt(e.target.getAttribute("data-key")));
    }
  }

  function keyPressed(keyCode) {
    if(keyCode === teclaActual) {
      activate(teclaActual, { success: true });
      i++;

      if(i > nivelActual) {
        removerKeyEvents();
        setTimeout(() => {
          siguienteNivel(i);
        }, 1500); 
      }
      teclaActual = teclas[i];
    }
    else {
      activate(keyCode, { fail: true });
      removerKeyEvents();
      setTimeout(() => {
        swal({
          title: 'Perdiste',
          icon: "error",
          text: `Aplastaste ${String.fromCharCode(keyCode)} en vez de ${String.fromCharCode(teclas[i])} \n\n ¿Quieres jugar de nuevo?`,
          buttons: ["No", "Si"]
        }).then((ok) => {
          if (ok) {
            iniciarJuego();
          } 
          else {
            verPantalla(pantallas.levelbox);
          }
        });
      }, 800);

    }
  }

  function removerKeyEvents() {
    window.removeEventListener("keydown", onkeydown);
    document.getElementById("keyboard").removeEventListener("click", onclick);
  }
}

function generarTeclas(niveles) {
  return new Array(niveles).fill(0).map(generarTeclaAleatoria);
}

function generarTeclaAleatoria() {
  const min = 65;
  const max = 90;
  return Math.round(Math.random() * (max - min) + min);
}

function getElementByKeyCode(keyCode) {
  return document.querySelector(`[data-key="${keyCode}"]`);
}

function activate(keyCode, opts = {}) {
  const el = getElementByKeyCode(keyCode);
  el.classList.add("active");
  if(opts.success) {
    el.classList.add("success");
  }
  else if(opts.fail) {
    el.classList.add("fail");
  }
  setTimeout(() => { deactivate(el); }, 500);
}

function deactivate(el) {
  el.className = "key";
}

document.getElementById("niveles").addEventListener("click", (e) => {
    if (e.target.getAttribute("name") === "nivel")
    {
        verPantalla(pantallas.keyboard);
        let nivel = parseInt(e.target.getAttribute("game-level"));
        switch(nivel)
        {
            case 1:
                niveles = 5;
                velocidad = 1000;
                break;
            case 2:
                niveles = 10;
                velocidad = 800;
                break;
            case 3:
                niveles = 15;
                velocidad = 500;
                break;
        }

        iniciarJuego();
    }
});

function iniciarJuego() {
    teclas = generarTeclas(niveles);
    siguienteNivel(0);
}

function verPantalla(pantalla)
{
    const levelbox = document.getElementById('levelbox');
    const keyboard = document.getElementById('keyboard');

    switch(pantalla)
    {
        case pantallas.keyboard:
            keyboard.classList.add('active');
            levelbox.classList.remove('active');
            break;
        case pantallas.levelbox:
            levelbox.classList.add('active');
            keyboard.classList.remove('active');
            break;
    }
}

