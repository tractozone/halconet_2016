var CodArt = []; var NomArt = [];
//var urlDOM = ""; var Publi = 0;
//var urlDOM = "http://192.168.2.100:80/"; var Publi = 1;
var urlDOM = "http://187.237.98.114:80/"; var Publi = 1;


$(document).bind("pageinit", function () {


    //ObtenerDatosIP();
    if (Publi == 1) {
        document.addEventListener("backbutton", handleBackButton, true);

        function handleBackButton() {

            if ($.mobile.activePage.attr('id') == 'inicio' || $.mobile.activePage.attr('id') == 'home') {
                navigator.app.exitApp();
            }
            //else {
            //    navigator.app.backHistory();
            //}          
        }
    }

    var Ident = "";

    $("#btnBusqArt").bind("click", function (event, ui) {
        var Codigo = $("#txtItemCode").val();
        if (Publi == 1) {
            $.mobile.loading('show', {
                text: 'Consultando...',
                textVisible: true,
                theme: 'a',
                html: ""
            });
        }
        VerificaDescripcionArticulo(Codigo);

    });

    $("#btnSalir").bind("click", function (event, ui) {
        localStorage.removeItem("ID");
        localStorage.removeItem("Us");
        localStorage.removeItem("Rl");
        LimpiaCodArtNoExistente();
        $("#txtItemCode").val('');
        $("#nombredeusuario").val('');
        $("#clave").val('');
        if (Publi == 1) {
            $.mobile.changePage("login.html")
        }
        else {
            location.href = 'login.html';
        }


    });

    $("#btnLogout").bind("click", function (event, ui) {
        localStorage.removeItem("ID");
        localStorage.removeItem("Us");
        localStorage.removeItem("Rl");
        LimpiaCodArtNoExistente();
        $("#txtItemCode").val('');
        $("#nombredeusuario").val('');
        $("#clave").val('');
        if (Publi == 1) {
            navigator.app.exitApp();
        }
        else {
            window.onbeforeunload = true;
        }
    });

    $("#botonLogin").bind("click", function (event, ui) {

                var datosUsuario = $("#nombredeusuario").val()
                var datosPassword = $("#clave").val()
                var UserName = "";
                UserName = localStorage.getItem('Us')

                if (Publi == 1) {
                    $.mobile.loading('show', {
                        text: 'Consultando...',
                        textVisible: true,
                        theme: 'a',
                        html: ""
                    });

                    Ident = /*device.model + "/" +*/device.uuid;
                    // recolecta los valores del usuario que se esta logueando

                    var devID = localStorage.getItem('ID')
                    if (devID == "" || devID == null) {
                        //Se consulta al usuario en BD
                        $.ajax({
                            url: urlDOM + "CS.aspx/ObtenerUsuario",
                            data: "{ NombreUsuario: '" + datosUsuario + "', Contrasenha:'" + datosPassword + "'}",
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data) {
                                UserName = data.d.NombreUsuario;
                                if (data.d.NombreUsuario != null && data.d.NombreUsuario != "") {
                                    localStorage.removeItem("ID");
                                    localStorage.removeItem("Us");
                                    localStorage.removeItem("Rl");

                                    localStorage.setItem("ID", Ident);
                                    localStorage.setItem("Us", UserName);
                                    localStorage.setItem("Rl", data.d.Rol);
                                    
                                    $.mobile.changePage("index.html")
                                    $.mobile.loading("hide");
                                   
                                }
                                else {

                                    alert("Usuario o contraseña invalida");
                                    $.mobile.loading("hide");
                                }
                            }
                        });
                    }
                    else if (username == Ident) {                
                        $.mobile.changePage("index.html")
                        $.mobile.loading("hide");
                    }
                }
                else {
                    //es en aplic de escritorio solo validar el usuario
                    if (UserName == datosUsuario) {
                        //Se consulta al usuario en BD
                        $.ajax({
                            url: urlDOM + "CS.aspx/ObtenerUsuario",
                            data: "{ NombreUsuario: '" + datosUsuario + "', Contrasenha:'" + datosPassword + "'}",
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data) {
                                UserName = data.d.NombreUsuario;
                                if (data.d.NombreUsuario != null && data.d.NombreUsuario != "") {
                                    localStorage.removeItem("ID");
                                    localStorage.removeItem("Us");
                                    localStorage.removeItem("Rl");

                                    localStorage.setItem("ID", Ident);
                                    localStorage.setItem("Us", UserName);
                                    localStorage.setItem("Rl", data.d.Rol);

                                    location.href = 'index.html';
                                }
                                else {
                                    alert("Usuario o contraseña invalida");
                                }
                            }
                        });
                    }
                    else if (UserName != null) {
                        location.href = 'index.html';
                    }                      
                }
                return false;
//        alert(urlDOM);
//        $.ajax({
//            url: urlDOM + "CS.aspx/ObtenerMensaje",
//            data: "{ Opcion: " + 1 + "}",
//            dataType: "json",
//            type: "POST",
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            success: function (data) {
//                alert(data);
//            },
//            error: function (xhr, status, error) {
//                alert(status);
//            },
//            dataType: 'text'
//        });
        //return false;
    });


    $("#btnLimpArt").bind("click", function (event, ui) {
        $("#txtItemCode").val('');
        $("#txtPrecio").val('');
        $("#txtUtilidad").val('');
        $("#sDescripcionArticulo").text('');

        $("#txtPorcientoDesc").val('');
        $("#txtPrecioDescuentoMXP").val('');
        $("#txtUtilidadDescuentoMXP").val('');
        $("#txtPrecioDescuentoUSD").val('');
        $("#txtUtilidadDescuentoUSD").val('');

        //--------------------------------------
        var htmlTable = '';
        $("#tblLista").html('');
        $("#tblLista").html(htmlTable);

        $("#tblListaStock").html('');
        $("#tblListaStock").html(htmlTable);
        $('#idInformacion').css('display', 'none');

        if (Publi == 1) {
            $.mobile.loading('hide');
        }

    });


    $("#btnAplicPrecio").bind("click", function (event, ui) {
        var CodORNom = "";
        CodORNom = $("#txtItemCode").val();
        if (CodORNom == "")
            CodORNom = $("#txtItemName").val();

        if (CodORNom != "") {
            var mon = $("#txtPrecio").val();
            if (mon != "") {
                var code = CodORNom;
                var TipoMoneda = -1;
                var TipoConsulta = -1;
                if ($('#rbtPesos').is(':checked')) {
                    TipoMoneda = 1;
                    TipoConsulta = 1;
                }
                if ($('#rbtDolares').is(':checked')) {
                    TipoMoneda = 2;
                    TipoConsulta = 2;
                }

                if (mon != "") {
                    if (Publi == 1) {
                        $.mobile.loading('show', {
                            text: 'Calculando...',
                            textVisible: true,
                            theme: 'a',
                            html: ""
                        });
                    }
                    //Se llena la tabla de precios
                    $.ajax({
                        url: urlDOM + "CS.aspx/CalculaUtilidadPrecio",
                        data: "{ TipoConsulta: " + TipoConsulta + ", CodArticulo: '" + code + "'" + ", TipoMoneda: " + TipoMoneda + ", Monto: '" + mon + "'}",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            $("#txtUtilidad").val(data.d);
                            if (Publi == 1) {
                                $.mobile.loading('hide');
                            }
                        }
                    });
                }
            }
            else {
                Mensaje("Debe especificar un monto", "HalcoNET", "Aceptar");
            }

        }
        else {
            Mensaje("Debe consultar un articulo por código", "HalcoNET", "Aceptar");
        }
    });

    //----------------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------

    $("#btnAplicUtilidad").bind("click", function (event, ui) {
        var CodORNom = "";
        CodORNom = $("#txtItemCode").val();
        if (CodORNom == "")
            CodORNom = $("#txtItemName").val();
        if (CodORNom != "") {
            var mon = $("#txtUtilidad").val();
            if (mon != "") {
                var code = $("#txtItemCode").val();
                var TipoMoneda = -1;
                var TipoConsulta = -1;
                if ($('#rbtPesos').is(':checked')) {
                    TipoMoneda = 1;
                    TipoConsulta = 1;
                }
                if ($('#rbtDolares').is(':checked')) {
                    TipoMoneda = 2;
                    TipoConsulta = 2;
                }
                if (mon != "") {
                    if (Publi == 1) {
                        $.mobile.loading('show', {
                            text: 'Calculando...',
                            textVisible: true,
                            theme: 'a',
                            html: ""
                        });
                    }
                    //Se llena la tabla de precios
                    $.ajax({
                        url: urlDOM + "CS.aspx/CalculaUtilidadPorciento",
                        data: "{ TipoConsulta: " + TipoConsulta + ", DescripArticulo: '" + code + "'" + ", TipoMoneda: " + TipoMoneda + ", Monto: '" + mon + "'" + ", BDescripcion:" + 0 + "}",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            $("#txtPrecio").val(data.d);
                            if (Publi == 1) {
                                $.mobile.loading('hide');
                            }
                        }
                    });
                }
            }
            else {
                Mensaje("Debe especificar un monto para la utilidad", "HalcoNET", "Aceptar");
            }
        }
        else {
            Mensaje("Debe consultar un articulo por código", "HalcoNET", "Aceptar");
        }
    });

    //---------------------------------------------------------------------------------------------------------

    $("#btnCalPorcientoDesc").bind("click", function (event, ui) {
        var CodORNom = "";
        CodORNom = $("#txtItemCode").val();
        if (CodORNom == "")
            CodORNom = $("#txtItemName").val();
        if (CodORNom != "") {
            var mon = $("#txtPorcientoDesc").val();
            if (mon != "") {
                var code = $("#txtItemCode").val();
                var TipoConsulta = 11;
                if (mon != "") {
                    if (Publi == 1) {
                        $.mobile.loading('show', {
                            text: 'Calculando...',
                            textVisible: true,
                            theme: 'a',
                            html: ""
                        });
                    }
                    //Se llena la tabla de precios
                    $.ajax({
                        url: urlDOM + "CS.aspx/ObtenerDescuentos",
                        data: "{ TipoConsulta: " + TipoConsulta + ", CodArticulo: '" + code + "', Descuento:" + mon + "}",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            $("#txtPrecioDescuentoMXP").val(data.d.PrecioCompraMXP);
                            $("#txtUtilidadDescuentoMXP").val(data.d.PrecionVentaMXP);
                            $("#txtPrecioDescuentoUSD").val(data.d.PrecioCompraUSD);
                            $("#txtUtilidadDescuentoUSD").val(data.d.PrecionVentaUSD);

                            if (Publi == 1) {
                                $.mobile.loading('hide');
                            }
                        }
                    });
                }
            }
            else {
                Mensaje("Debe especificar un monto para la utilidad", "HalcoNET", "Aceptar");
            }
        }
        else {
            Mensaje("Debe consultar un articulo por código", "HalcoNET", "Aceptar");
        }
    });

});                                                                              //cierre de página



function Llena() {
    var str = "";
    var sugList = $('[data-role=listview]');

    $.ajax({
        url: urlDOM + "CS.aspx/AutoCompleteAll",
        data: "{CodArticulo: '" + 1 + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data != null && $.isArray(data.d)) {
                $.each(data.d, function (index, value) {
                    CodArt.push(value.ItemCode);
                    NomArt.push(value.Dscription);
                    str += "<li class=ui-screen-hidden><a href='#'>" + value.ItemCode + "</a></li>";
                    sugList.html(str);
                    sugList.listview("refresh");
                });
            }
        }
    });
}

function Llena2() {
    var str = "";
    var sugList = $("#sugges1");
    $.ajax({
        url: urlDOM + "CS.aspx/AutoCompleteAll",
        data: "{CodArticulo: '" + 1 + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var str = "";
            if (data != null && $.isArray(data.d)) {
                $.each(data.d, function (index, value) {
                    str += "<li><a href='#'>" + value.ItemCode + "</a></li>";
                    sugList.html(str);
                    sugList.listview("refresh");

                });
            
            }
        }
    });
}



function Llena3() {
    var str = "";
    var sugList = $("#sugges1");
    if (CodArt != null && $.isArray(CodArt)) {
        $.each(CodArt, function (index, value) {
            str += "<li class=ui-screen-hidden><a href='#'>" + value + "</a></li>";
            sugList.html(str);
            sugList.listview("refresh");
        });
    }        
}



function ConsultaListaPrecios(Articulo, TipoConsulta, BDescripcion) {
    //Se llena la tabla de precios
    var Rol = localStorage.getItem('Rl')

    $.ajax({
        url: urlDOM + "CS.aspx/ConsultaPrecios", /* Llamamos a tu archivo */
        data: "{ 'DescripArticulo': '" + Articulo + "', TipoConsulta:" + TipoConsulta + ", BDescripcion:" + BDescripcion + ", Rol:" + Rol + "}", /* Ponemos los parametros de ser necesarios */
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",  /* Esto es lo que indica que la respuesta será un objeto JSon */
        success: function (data) {
            /* Supongamos que #contenido es el tbody de tu tabla */
            /* Inicializamos tu tabla */
            var htmlTable = '';
            $("#tblLista").html('');
            /* Vemos que la respuesta no este vacía y sea una arreglo */
            if (data != null && $.isArray(data.d)) {
                /* Recorremos tu respuesta con each */
                htmlTable += '<table class="phone-compare ui-shadow table-stroke">';
                $.each(data.d, function (index, value) {
                    /* Vamos agregando a nuestra tabla las filas necesarias */
                    htmlTable += '<tr>';
                    htmlTable += '<td class="col-stock-Izq">' + value.ListName + '</td>';
                    htmlTable += '<td class="col-stock-Der">' + value.MXP + '</td>';
                    htmlTable += '<td class="col-stock-Der">' + value.USD + '</td>';
                    htmlTable += '</tr>';
                    //$("#tblLista").append("<tr><td>" + value.ListName + "</td></tr>");
                    //i++;
                });

                htmlTable += '</table>';
                $("#tblLista").html(htmlTable);
            }
        }
    });
}

function ConsultaStock(Articulo, TipoConsulta, BDescripcion) {
    //Se llena la tabla de precios
    $.ajax({
        url: urlDOM + "CS.aspx/ConsultaStocks", /* Llamamos a tu archivo */
        data: "{ 'DescripArticulo': '" + Articulo + "', TipoConsulta:" + TipoConsulta + ", BDescripcion:" + BDescripcion + "}", /* Ponemos los parametros de ser necesarios */
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",  /* Esto es lo que indica que la respuesta será un objeto JSon */
        success: function (data) {
            /* Supongamos que #contenido es el tbody de tu tabla */
            /* Inicializamos tu tabla */
            var htmlTable = '';
            $("#tblListaStock").html('');
            /* Vemos que la respuesta no este vacía y sea una arreglo */
            if (data != null && $.isArray(data.d)) {
                /* Recorremos tu respuesta con each */
                htmlTable += '<table>';
                $.each(data.d, function (index, value) {
                    /* Vamos agregando a nuestra tabla las filas necesarias */
                    htmlTable += '<tr>';
                    htmlTable += '<td class="col-stock">' + value.Almacen + '</td>';
                    htmlTable += '<td class="col-stock">' + value.Stock + '</td>';
                    htmlTable += '<td class="col-stock">' + value.Solicitado + '</td>';
                    htmlTable += '</tr>';
                    //$("#tblLista").append("<tr><td>" + value.ListName + "</td></tr>");
                    //i++;
                });

                htmlTable += '</table>';
                $("#tblListaStock").html(htmlTable);
            }
        }
    });
}


function VerificaDescripcionArticulo(Codigo) {
    var result = "";
    var Rol = localStorage.getItem('Rl')
    if (Rol != null && Rol != undefined && Rol > 0) {
        if (Codigo != "") {
            $.ajax({
                url: urlDOM + "CS.aspx/ObtenerDescripcionArticulo",
                data: "{ TipoConsulta: " + 9 + ", CodArticulo:'" + Codigo + "'}",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    result = response.d;
                    if (result != "") {
                        $("#sDescripcionArticulo").text(result);
                        MustraSegunRol();
                        ConsultaListaPrecios(Codigo, 3, 0);
                        ConsultaStock(Codigo, 5, 0);
                        if (Publi == 1) {
                            $.mobile.loading("hide");
                        }
                    }
                    else {
                        Mensaje("No existe ningun articulo con el código especificado", "HalcoNET", "Aceptar");
                        LimpiaCodArtNoExistente();
                        $('#idInformacion').css('display', 'none');

                    }
                }
            });
        }
        else {
            Mensaje("Debe especificar un código de articulo", "HalcoNET", "Aceptar");
        }
    }
    else {
        if (Publi == 1) {
            $.mobile.loading("hide");
        }
    }
}


function LimpiaCodArtNoExistente() {
    //Se llena la tabla de precios
    $("#txtPrecio").val('');
    $("#txtUtilidad").val('');
    $("#sDescripcionArticulo").text('');

    //--------------------------------------
    var htmlTable = '';
    $("#tblLista").html('');
    $("#tblLista").html(htmlTable);

    $("#tblListaStock").html('');
    $("#tblListaStock").html(htmlTable);

    $('#idInformacion').css('display', 'none');
    $('#CalUtil').css('display', 'none');
    $('#DescMax').css('display', 'none');
    $('#LstPrice').css('display', 'none');
    $('#LstStock').css('display', 'none');
    
}


function Mensaje(TextMensaje, Titulo, Boton) {
    if (Publi == 1) {
        navigator.notification.alert(TextMensaje, null, Titulo, Boton);
        $.mobile.loading("hide");
    }
    else {
        alert(TextMensaje);
    }
}

function MustraSegunRol() {
    
    $('#idInformacion').css('display', 'block');
    var Rol = localStorage.getItem('Rl')
    if (Rol == null || Rol == undefined || Rol ==0) {
        $('#DescMax').css('display', 'none');
        $('#CalUtil').css('display', 'none');
        $('#LstPrice').css('display', 'none');
        $('#LstStock').css('display', 'none');
    }
    else if (Rol == 1) {
        $('#DescMax').css('display', 'none');
        $('#CalUtil').css('display', 'block');
        $('#LstPrice').css('display', 'block');
        $('#LstStock').css('display', 'block');
    }
    else if (Rol == 2) {
        $('#DescMax').css('display', 'none');
        $('#CalUtil').css('display', 'block');
        $('#LstPrice').css('display', 'block');
        $('#LstStock').css('display', 'block');
    }
    else if (Rol == 3) {
        $('#DescMax').css('display', 'none');
        $('#CalUtil').css('display', 'none');
        $('#LstPrice').css('display', 'block');
        $('#LstStock').css('display', 'block');
    }
    else if (Rol == 4) {
        $('#DescMax').css('display', 'none');
        $('#CalUtil').css('display', 'none');
        $('#LstPrice').css('display', 'none');
        $('#LstStock').css('display', 'none');
    }
}

function ObtenerDatosIP() {
    $.ajax({
        url: urlDOM + "CS.aspx/ObtenerIP",
        data: "{ TipoConsulta: " + 2 + ", Correo:'" + 0 + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            urlDOM = data.d.IP_Publica;
            Publi = data.d.Publicado;
            
        }
    });
}

