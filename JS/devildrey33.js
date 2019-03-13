
var devildrey33_Base = function() {
    // Evento OnLoad 
    window.addEventListener('load', function() { this.Iniciar(); }.bind(this));
    // Array de paths para contar los archivos JavaScript y CSS dinámicos
    this.ScriptDinamico     = []; // { "URL" : URL, "Estado" : "cargando/cargado/error", "FuncionTerminado" : FuncionTerminado, "FuncionError" : FuncionError }
    // Variable para almacenar la función que se utilizará al finalizar la carga dinámica de un archivo CSS 
    this.FuncionCargarCSS   = function() { };
    // Variable para almacenar la función que se utilizará al finalizar la carga dinámica de un archivo JavaScript
    this.FuncionCargarJS    = function() { };
    
    this.Iniciar = function() {
        console.log("Base.Iniciar()");
        
        this.CargarJS("/ObjetoCanvas/JS/ObjetoCanvas.js", function() { },  function() { });
        this.CargarJS("/ObjetoCanvas/JS/ObjetoCanvas.js", function() { },  function() { });
        
        this.GenerarHTMLBase();
        
        document.getElementById("Cuerpo").setAttribute("visible", "true");
//        document.getElementById("devildrey33_Logo").setAttribute("cargando", "false");
        
        // s'ha de fer això quan s'acabi de carregar tot el ajax
        
        setTimeout(function () { document.body.setAttribute("cargando", "false")} , 13000);
    };
    
    // Función que crea la barra derecha y la añade al body
    this.GenerarHTMLBase = function() {
        var Barra = document.createElement("div");
        Barra.setAttribute("id", "devildrey33_BarraIzquierda");
        document.body.appendChild(Barra);
        var Logo =  document.createElement("div");
        Logo.setAttribute("id", "devildrey33_Logo");
        Logo.innerHTML = "<div>D</div>" +
                         "<div>E</div>" +
                         "<div>V</div>" +
                         "<div>I</div>" +
                         "<div>L</div>" +
                         "<div>D</div>" +
                         "<div>R</div>" +
                         "<div>E</div>" +
                         "<div>Y</div>" +
                         "<div>&nbsp;</div>" +
                         "<div>3</div>" +
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
    
};

var Base = new devildrey33_Base;