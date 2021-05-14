window.addEventListener("load",cargarPersonas);

function $(id) {
    return document.getElementById(id);
  }


function cargarPersonas()
{
    var tabla=$("tabla");
    var peticion=new XMLHttpRequest();  
    peticion.open("GET","http://localhost:3000/materias",true);
    peticion.send();
    $("divSpinner").hidden=false;

    peticion.onreadystatechange=function()
    {

        if(peticion.status== 200 && peticion.readyState == 4)
        {
            $("divSpinner").hidden=true;
            var arrayJson=JSON.parse(peticion.responseText);
            //console.log(arrayJson);
    
            for (let index = 0; index < arrayJson.length; index++) 
            {
                crearFila(arrayJson[index],tabla);
            }

        }

    }

}


function crearFila(materia,tabla)
{
    
    var nombre=materia.nombre;
    var cuatrimestre=materia.cuatrimestre;
    var fechaFinal=materia.fechaFinal;
    var turno=materia.turno;
    var id=materia.id;


    var nuevaFila=document.createElement("tr");

    var tdId=document.createElement("td");
    var tdNombre=document.createElement("td");
    var tdCuatrimestre=document.createElement("td");
    var tdFechaFinal=document.createElement("td");
    var tdTurno=document.createElement("td");
    
    var textoId=document.createTextNode(id);
    var textoNombre=document.createTextNode(nombre);
    var textoCuatrimestre=document.createTextNode(cuatrimestre);
    var textoFechaFinal=document.createTextNode(fechaFinal);
    var textoTurno=document.createTextNode(turno);

    tdId.appendChild(textoId);
    tdNombre.appendChild(textoNombre);
    tdCuatrimestre.appendChild(textoCuatrimestre);
    tdFechaFinal.appendChild(textoFechaFinal);
    tdTurno.appendChild(textoTurno);

    tdId.style="display:none;";
    nuevaFila.appendChild(tdNombre);
    nuevaFila.appendChild(tdCuatrimestre);
    nuevaFila.appendChild(tdFechaFinal);
    nuevaFila.appendChild(tdTurno);
    nuevaFila.appendChild(tdId);


    nuevaFila.addEventListener("dblclick",desplegarFila);

    tabla.appendChild(nuevaFila);
}



function desplegarFila(e)
{
    var divMateria=$("divMateria");
    $("txtNombre").style.borderColor="black"; 
    $("txtFechaFinal").style.borderColor="black";
    $("txtCuatrimestre").style.borderColor="black";


    divMateria.hidden=false;

    var tabla=$("tabla");
    var fila=e.target.parentNode; 
    var nombre=fila.childNodes[0].childNodes[0].nodeValue;
    var cuatrimestre=fila.childNodes[1].childNodes[0].nodeValue;
    var fechaFinal=fila.childNodes[2].childNodes[0].nodeValue;
    var turno=fila.childNodes[3].childNodes[0].nodeValue;

    var id=fila.childNodes[4].childNodes[0].nodeValue;



    $("txtNombre").value=nombre;
    $("txtCuatrimestre").value=cuatrimestre;
    $("txtFechaFinal").value=fechaFinal;
    
    if(turno == "Mañana")
    {
        $("mañana1").checked=true;
    }
    else
    {
        $("noche").checked=true;
    }


    $("btnCerrar").onclick=function()
    {
        divMateria.hidden=true;
    }


    $("btnModificar").onclick=function()
    {
       
        let flagNombre=true;
        let flagFechaFinal=true;
        let flagTurno=true;
        
       
        if($("txtNombre").value.length < 6)
        {
            
            $("txtNombre").style.borderColor="red";          
            flagNombre=false;

        }else{
            $("txtNombre").style.borderColor="black"; 
        }


        if(!($("mañana1").checked || $("noche").checked))
        {
            flagTurno=false;
        }
       
       
        var fechaInput=new Date($("txtFechaFinal").value);
        var fechaActual=new Date();

        if(fechaActual < fechaInput)
        {
            $("txtFechaFinal").style.borderColor="red";
            flagFechaFinal=false;
        }else{
            $("txtFechaFinal").style.borderColor="black";
        }
   
    
        if(flagNombre && flagFechaFinal  && flagTurno)
        {
            var nombreInput= $("txtNombre").value;
            var cuatrimestreInput= $("txtCuatrimestre").value;
            var fechaFinalInput=$("txtFechaFinal").value;
            var turno;

            if($("mañana1").checked)
            {
                turno="Mañana";
            }else{
                turno="Noche";
            }

            var jsonPersona={"nombre":nombreInput,"cuatrimestre":cuatrimestreInput,"fechaFinal":fechaFinalInput,"turno":turno,"id":id}

            var peticion=new XMLHttpRequest();
            peticion.open("POST","http://localhost:3000/editar");
            peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            peticion.send(JSON.stringify(jsonPersona));
            $("divSpinner").hidden=false;

            peticion.onreadystatechange= function() 
            {
                
                if(peticion.status == 200 && peticion.readyState == 4)
                {
                    $("divSpinner").hidden=true;
                    
        
                    fila.childNodes[0].childNodes[0].nodeValue=nombreInput;
                    fila.childNodes[1].childNodes[0].nodeValue=cuatrimestreInput;
                    fila.childNodes[2].childNodes[0].nodeValue=fechaFinalInput;
                    fila.childNodes[3].childNodes[0].nodeValue=turno;
                    
                }


            }
       
            

        }

        
    }

    $("btnEliminar").onclick=function()
    {
        var jsonPersona={"nombre":nombre,"cuatrimestre":cuatrimestre,"fechaFinal":fechaFinal,"id":id}
        var peticion=new XMLHttpRequest();
        peticion.open("POST","http://localhost:3000/eliminar");
        peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        peticion.send(JSON.stringify(jsonPersona));
        $("divSpinner").hidden=false;

        peticion.onreadystatechange= function() 
        {                
            if(peticion.status == 200 && peticion.readyState == 4)
            {
                $("divSpinner").hidden=true;
                tabla.removeChild(fila);
                
            }
        }
        divMateria.hidden=true;
    }

}


