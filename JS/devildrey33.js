
var devildrey33_Base = function() {
    // Evento OnLoad 
    window.addEventListener('load', function() { this.Iniciar(); }.bind(this));
    // Array de paths para contar los archivos JavaScript y CSS dinámicos
    this.ScriptDinamico     = [ // { "URL" : URL, "Estado" : "cargando/cargado/error", "FuncionTerminado" : FuncionTerminado, "FuncionError" : FuncionError }
        { "cargado" : "Estado", "URL" : "/CSS/devildrey33.css"                                              }, 
        { "cargado" : "Estado", "URL" : "/JS/devildrey33.js"                                                }, 
        { "cargado" : "Estado", "URL" : "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" }
    ]; 
    // Variable para almacenar la función que se utilizará al finalizar la carga dinámica de un archivo CSS 
    this.FuncionCargarCSS   = function() { };
    // Variable para almacenar la función que se utilizará al finalizar la carga dinámica de un archivo JavaScript
    this.FuncionCargarJS    = function() { };
    
    this.Iniciar = function() {
        console.log("Base.Iniciar()");
        
        this.CargarJS("/ObjetoCanvas/JS/ObjetoCanvas.js", function() { },  function() { });
//        this.CargarJS("/ObjetoCanvas/JS/ObjetoCanvas.js", function() { },  function() { });
        
        this.GenerarHTMLBase();
        
        document.getElementById("Cuerpo").setAttribute("visible", "true");
//        document.getElementById("devildrey33_Logo").setAttribute("cargando", "false");
        
        // s'ha de fer això quan s'acabi de carregar tot el ajax
        
        setTimeout(function () { document.body.setAttribute("cargando", "false")} , 500);
    };
    
    // Función que crea la barra derecha y la añade al body
    this.GenerarHTMLBase = function() {
        var Barra = document.createElement("div");
        Barra.setAttribute("id", "devildrey33_BarraIzquierda");
        document.body.appendChild(Barra);
        var Logo =  document.createElement("div");
        Logo.setAttribute("id", "devildrey33_Logo");
        Logo.innerHTML = "<div>D</div>"         +
                         "<div>E</div>"         +
                         "<div>V</div>"         +
                         "<div>I</div>"         +
                         "<div>L</div>"         +
                         "<div>D</div>"         +
                         "<div>R</div>"         +
                         "<div>E</div>"         +
                         "<div>Y</div>"         +
                         "<div>&nbsp;</div>"    +
                         "<div>3</div>"         +
                         "<div>3</div>";
        document.body.appendChild(Logo);
        
        var LogoC =  document.createElement("div");
        LogoC.setAttribute("id", "devildrey33_LogoCargando");
        LogoC.innerHTML = Logo.innerHTML;
        document.body.appendChild(LogoC);

        document.body.setAttribute("cargando", "true");
        
    };
    
    // Función que obtiene un archivo del servidor 
    // Las funciones terminado y error deben tener un parámetro, que será el resultado del ajax
    this.CargarURL = function(URL, FuncionTerminado, FuncionError, ParamExtra) {
        var Tipo = "html";
        // Si es un CSS o un JS cambio el tipo
        if (URL.substr(URL.length - 3) === ".js" || URL.substr(URL.length - 4) === ".css") {
            Tipo = "script";
        }
        
        // Si no existen parámetros extra, los creo.
        if (typeof(ParamExtra) === "undefined") ParamExtra = { "URL" : URL };        
        // Si existen parámetros extra, añado la URL
        else                                    ParamExtra.URL = URL;
                
        $.ajax({ 
            url      : URL, 
            dataType : Tipo,
            data     : ParamExtra,
            success  : FuncionTerminado,
            error    : FuncionError
        });
    };
    
    // Devuelve la posición de la URL dentro del array de scripts dinámicos. 
    // NOTA : Si no se encuentra la URL devuelve -1
    this.BuscarPosScriptDinamico = function(URL) {
        for (var i = 0; i < this.ScriptDinamico.length; i++) {
            if (this.ScriptDinamico[i].URL === URL) {
                return i;
            }
        }
        return -1;
    };
    
    /* Carga un archivo JS dinamicamente 
       - URL              : URL absoluta del archivo JS por ejemplo : "/JS/devildrey33.js"
       - FuncionTerminado : Función a ejecutar una vez cargado el JS (opcional)
       - FuncionError     : Función a ejecutar si hay un error (opcional)
     */
    this.CargarJS = function(URL, FuncionTerminado, FuncionError) {
        if (typeof(FuncionTerminado) === "undefined") FuncionTerminado = function() { };
        if (typeof(FuncionError) === "undefined")     FuncionError     = function() { };
        
        var PosScript = this.BuscarPosScriptDinamico(URL);
        if (PosScript !== -1) {
            // Si el script no está en estado de error (si el script está en error se volverá a probar su carga)
            if (this.ScriptDinamico[PosScript].Estado !== "error") {
                console.log("Base.CargarJS(" + URL + ") ya existe con el estado : " + this.ScriptDinamico[PosScript].Estado);
                FuncionTerminado("");
                return;            
            }
        }
        
        if (PosScript === -1) {
            // Creo una nueva entrada
            this.ScriptDinamico.push({ "URL" : URL, "Estado" : "cargando", "FuncionTerminado" : FuncionTerminado, "FuncionError" : FuncionError });
        }
        else {
            // Re-asigno los datos
            this.ScriptDinamico[PosScript] = { "URL" : URL, "Estado" : "cargando", "FuncionTerminado" : FuncionTerminado, "FuncionError" : FuncionError };
        }
        
        this.CargarURL(URL, 
            function(data) {                // terminado
                console.log("Base.CargarJS(" + URL + ")");
                var Pos = this.BuscarPosScriptDinamico(URL);
                this.ScriptDinamico[Pos].Estado = "cargado";
                
                var script = document.createElement("script");
                script.innerHTML = data;
                document.head.appendChild(script);
                script.remove();
                
                FuncionTerminado(data);
            }.bind(this), function(data) {  // error
                console.log("Base.CargarJS(" + URL + ") ERROR");
                var Pos = this.BuscarPosScriptDinamico(URL);
                this.ScriptDinamico[Pos].Estado = "error";                
                FuncionError(data);
            }.bind(this), 
            this.ScriptDinamico[this.ScriptDinamico.length]
        );
        
    };
    

    /* Carga un archivo CSS dinamicamente              
       - URL              : URL absoluta del archivo JS por ejemplo : "/JS/devildrey33.js"
       - FuncionTerminado : Función a ejecutar una vez cargado el CSS (opcional) 
       - FuncionError     : Función a ejecutar si hay un error (opcional)                          */
    this.CargarCSS = function(URL, FuncionTerminado, FuncionError) { 
        if (typeof(FuncionTerminado) === "undefined") FuncionTerminado = function() { };
        if (typeof(FuncionError) === "undefined")     FuncionError     = function() { };
        
        var PosScript = this.BuscarPosScriptDinamico(URL);
        if (PosScript !== -1) {
            // Si el script no está en estado de error (si el script está en error se volverá a probar su carga)
            if (this.ScriptDinamico[PosScript].Estado !== "error") {
                console.log("Base.CargarCSS(" + URL + ") ya existe con el estado : " + this.ScriptDinamico[PosScript].Estado);
                FuncionTerminado("");
                return;            
            }
        }
        
        if (PosScript === -1) {
            // Creo una nueva entrada
            this.ScriptDinamico.push({ "URL" : URL, "Estado" : "cargando", "FuncionTerminado" : FuncionTerminado, "FuncionError" : FuncionError });
        }
        else {
            // Re-asigno los datos
            this.ScriptDinamico[PosScript] = { "URL" : URL, "Estado" : "cargando", "FuncionTerminado" : FuncionTerminado, "FuncionError" : FuncionError };
        }
        
        this.CargarURL(URL, 
            function(data) {                // terminado
                console.log("Base.CargarCSS(" + URL + ")");
                var Pos = this.BuscarPosScriptDinamico(URL);
                this.ScriptDinamico[Pos].Estado = "cargado";
                
                var script = document.createElement("style");
                script.innerHTML = data;
                document.head.appendChild(script);
                script.remove();
                
                FuncionTerminado(data);
            }.bind(this), function(data) {  // error
                console.log("Base.CargarCSS(" + URL + ") ERROR");
                var Pos = this.BuscarPosScriptDinamico(URL);
                this.ScriptDinamico[Pos].Estado = "error";                
                FuncionError(data);
            }.bind(this), 
            this.ScriptDinamico[this.ScriptDinamico.length]
        );
    };    
    
    
    this.GenerarIndice = function() {
        var Codigo = "<div class='devildrey33_Indice'>";
        for (var i = 0; i < Opciones.Entradas.length; i++) {
            Codigo += "<a class='Entrada' href='" + Opciones.Entradas[i].URL + "'>"     +
                    "<div class='Entrada_MarcoIzquierdo'></div>"                        +
                    "<div class='Entrada_MarcoDerecho'></div>"                          + 
                    "<div class='Entrada_Contenido'>"                                   +
                        "<div class='Entrada_Descripcion'>"                             +
                            "<h1>" + Opciones.Entradas[i].Nombre + "</h1>"              +
                            "<p>" + Opciones.Entradas[i].Descripcion  + "</p>"          +
                            "<table>"                                                   +
                                "<tr>"                                                  +
                                    "<td>Categorías</td>"                               +
                                    "<td>:</td>"                                        +
                                    "<td>" + Opciones.Entradas[i].Categorias  + "</td>" +
                                "</tr>"                                                 +
                                "<tr>"                                                  +
                                    "<td>Fecha</td>"                                    +
                                    "<td>:</td>"                                        +
                                    "<td>" + Opciones.Entradas[i].Fecha  +"</td>"       +
                                "</tr>"                                                 +
                            "</table>"                                                  +
                        "</div>"                                                        +
                        "<div class='Entrada_Imagen'>"                                  +
                            "<div>"                                                     +
                                "<img src='" + Opciones.Entradas[i].Imagen + "' />"     +
                            "</div>"                                                    +
                        "</div>"                                                        +
                    "</div>"                                                            +
                "</a>";
        }
        Codigo += "</div>";
        
        document.getElementById("Cuerpo").innerHTML = Codigo;
    };
};

var Base = new devildrey33_Base;


/* Base de datos para las opciones del CMS (Es lo que hay...) 
   Esta variable es BÁSICA y es tontería poner-la en otro archivo... */
var Opciones = {
    // Entradas del indice 
    "Entradas" : [
        {
            "Nombre"        : "Dominó 3D",
            "URL"           : "/Domino/domino.html",
            "Descripcion"   : "Juego de dominó en 3D 100% funcional con una dificultad básica (siempre tiran la ficha con mayor valor sumado posible), Se utilizan las reglas básicas de un 2 contra 2 por parejas, <b>solo para un jugador</b>.",
            "Categorias"    : "<b>JavaScript</b>, y <b>Three.js</b>.",
            "Fecha"         : "08/03/2019",
            "Imagen"        : "/Graficos/250x200_Domino.png"
        },
        {
            "Nombre"        : "Experimento: CyberParasit",
            "URL"           : "/CyberParasit/",
            "Descripcion"   : "Presentación / animación en 3D adap`tada al análisis de una canción en concreto para realizar una animación, que consiste en varios cubos siguiendo el ritmo de la música.",
            "Categorias"    : "<b>JavaScript</b>, <b>Three.js</b>, <b>JSON</b>, y <b>WebAudio</b>",
            "Fecha"         : "08/03/2019",
            "Imagen"        : "/Graficos/250x200_CyberParasit.png"
        },
        {
            "Nombre"        : "Experimento: EspectroAudible",
            "URL"           : "/EspectroAudible/",
            "Descripcion"   : "Un analizador de espectro/onda en 3d ejecutado en varias canciones de muestra. La parte central representa una FFT (fast fourier transform), y a partir de la FFT y del análisis de la onda hay varias pantallas que puedesq personalizar. <br>Recomendado en chrome PC.",
            "Categorias"    : "<b>JavaScript</b>, <b>Three.js</b>, y <b>WebAudio</b>.",
            "Fecha"         : "08/03/2019",  
            "Imagen"        : "/Graficos/250x200_EspectroAudible.png"
        },
        {   
            "Nombre"        : "Experimento_ Hex Tunnel",
            "URL"           : "/HexTunnel/",
            "Descripcion"   : "Animación de un tunel infinito que está compuesto por varios bloques 3D, dichos bloques muestran valores hexadecimales aleatórios modificando una textura en memória a traves de un canvas 2D para terminar mostrando el resultado en 3D.",
            "Categorias"    : "<b>JavaScript</b>, y <b>Three.js</b>.",
            "Fecha"         : "08/03/2019",
            "Imagen"        : "/Graficos/250x200_HexTunnel.png"
        },
        {
            "Nombre"        : "Experimento: Sinusoidal",
            "URL"           : "/Sinusoidal/",
            "Descripcion"   : "Animación de una onda generada aleatóriamente utilizando un número indeterminado de circulos, cada uno con un diámetro aleatório.",
            "Categorias"    : "<b>JavaScript</b>, y <b>Canvas 2D</b>",
            "Fecha"         : "08/03/2019",
            "Imagen"        : "/Graficos/250x200_Sinusoidal.png"            
        },
        {
            "Nombre"        : "Experimento: Esfera vertex shader",
            "URL"           : "/EsferaVertexShader/",
            "Descripcion"   : "Ejemplo básico para empezar a entender los vertex shadders moviendo todos los vertices de una esfera utilizando un algoritmo p5 noise. He utilizado el código GLSL de hughsk para generar el efecto de ruido,.",
            "Categorias"    : "<b>JavaScript</b>, y <b>Three.js</b>",
            "Fecha"         : "08/03/2019",
            "Imagen"        : "/Graficos/250x200_EsferaVShader.png"      
        },
        {
            "Nombre"        : "Adiestramiento de cubos",
            "URL"           : "/AdiestramientoCubos/",
            "Descripcion"   : "Mi primera animación en 3D utilizando Three.js, Básicamente mi intención fue ver que necesitaria para crear / animar una escena con varios objetos utilizando three.js + javascript",
            "Categorias"    : "<b>JavaScript</b>, y <b>Three.js</b>",
            "Fecha"         : "08/03/2019",
            "Imagen"        : "/Graficos/250x200_Adiestramiento.png"            
        }
/*        {
            "Nombre"        : "",
            "URL"           : "",
            "Descripcion"   : "",
            "Categorias"    : "",
            "Fecha"         : "08/03/2019",
            "Imagen"        : ""            
        }*/
    ],
    
    // Proyectos para ver en el laboratório de pruebas
    "Proyectos" : [
        
    ]
    
    
};