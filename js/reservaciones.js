//Guardar reservaciones en el dispositivo
var almacen = {
    db: null,
    th: null,
    pr: null,
    ha: null,
    di: null,
    guardarReserva: function (th, pr, ha, di) {
        almacen.db = window.openDatabase("hotelApp", "1.0", "Hotel App", 200000);
        almacen.th = th;
        almacen.pr = pr;
        almacen.ha = ha;
        almacen.di = di;
        almacen.db.transaction(almacen.tablaReserva, almacen.error, almacen.confirmarReservaGuardada);
    },
    error: function (err) {
        alert(err.code);
    },
    tablaReserva: function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS reservas (th,pr,ha,di)');
        tx.executeSql('INSERT INTO reservas (th,pr,ha,di) VALUES ("' + almacen.th + '","' + almacen.pr + '","' + almacen.ha + '","' + almacen.di + '")');
    },
    confirmarReservaGuardada: function () {
        alert("Guardado en espera de sincronización con el servidor");
    },
    borrarReservas: function () {
        almacen.db = window.openDatabase("hotelApp", "1.0", "Hotel App", 200000);
        almacen.db.transaction(almacen.deleteReservas, almacen.error, almacen.confirmarReservaEliminada);
    },
    deleteReservas: function (tx) {
        tx.executeSql("DELETE FROM reservas");
    },
    confirmarReservaEliminada: function () {
        navigator.notification.alert("Reservas eliminadas", null, "Felicidades", "Aceptar");
    },
    leerReservas: function () {
        almacen.db = window.openDatabase("hotelApp", "1.0", "Hotel App", 200000);
        almacen.db.transaction(almacen.readReservas, almacen.error, almacen.confirmarReservasLeidas);
    },
    readReservas: function (tx) {
        tx.executeSql("SELECT * FROM reservas", [], function (tx2, r) {
            for (i = 0; i < r.rows.length; i++) {
                var th = r.rows.item(i).th;
                var pr = r.rows.item(i).pr;
                var ha = r.rows.item(i).ha;
                var di = r.rows.item(i).di;
                alert(th);
                fn.enviarRegistroServidor(th, pr, ha);
                //Enviar reserva al servidor
            }
        }, almacen.error);
    },
    confirmarReservasLeidas: function () {
        almacen.borrarReservas();
    }
};