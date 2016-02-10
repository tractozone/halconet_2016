using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Xml;


public partial class _Default : System.Web.UI.Page
{

    private static string connectionStringPJ = @"Data Source=192.168.2.100;Initial Catalog=SBO-DistPJ; user id= sa; password = SAP-PJ1; TrustServerCertificate=true;";
    private static string connectionStringSGUV = @"Data Source=192.168.2.100;Initial Catalog=SGUV; user id= sa; password = SAP-PJ1; TrustServerCertificate=true;";

    //private static string connectionStringPJ = @"Data Source=DESARROLLO2PJ;Initial Catalog=SBO-DistPJ; user id= sa; password = SAP-PJ1; TrustServerCertificate=true;";
    //private static string connectionStringSGUV = @"Data Source=DESARROLLO2PJ;Initial Catalog=SGUV; user id= sa; password = SAP-PJ1; TrustServerCertificate=true;";

    public static decimal PrecioCompra;

    public enum TipoConsulta
    {
        Pesos = 1,
        Usd = 2,
        ListaPercios = 3,
        Articulos = 4,
        Stocks = 5,
        TC = 6
    }

    public enum Columnas
    {
        PriceList,
        MXP, USD
    }

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    [System.Web.Services.WebMethod]
    public static string GetPrice(string ItemCode, decimal Utilidad)
    {
        decimal PrecioCompra = decimal.Zero;
        decimal Porcentaje = decimal.Zero;
        try
        {
            SqlConnection connection = new SqlConnection(connectionStringPJ);

            Porcentaje = Utilidad;

            SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@TipoConsulta", 1);
            command.Parameters.AddWithValue("@Articulo", ItemCode);

            SqlParameter PrecCompra = new SqlParameter("@PrecioCompra", decimal.Zero);
            PrecCompra.Direction = ParameterDirection.Output;
            PrecCompra.DbType = DbType.Decimal;
            PrecCompra.Scale = 6;
            command.Parameters.Add(PrecCompra);

            connection.Open();
            command.ExecuteNonQuery();

            PrecioCompra = Convert.ToDecimal(command.Parameters["@PrecioCompra"].Value.ToString());
            connection.Close();

            return decimal.Round((PrecioCompra / (100 - Porcentaje)) * 100, 2).ToString("C2");
        }
        catch (Exception ex)
        {
            return decimal.Zero.ToString ("C2");
        }
    }

    [System.Web.Services.WebMethod]
    //[System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
    public static string[] AutoComplete(string CodArticulo, int Opcion)
    {
        List<string> customers = new List<string>();
        try
        {
            SqlConnection connection = new SqlConnection(connectionStringPJ);

            SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@TipoConsulta", 7);
            command.Parameters.AddWithValue("@Articulo", CodArticulo);
            command.Parameters.AddWithValue("@PrecioCompra", 0);
            command.Parameters.AddWithValue("@OpcionAutocompletado", Opcion);

            connection.Open();
            using (SqlDataReader sdr = command.ExecuteReader())
            {
                while (sdr.Read())
                {
                    if (Opcion == 1)
                        customers.Add(string.Format("{0}", sdr["ItemCode"]));
                    if (Opcion == 2)
                        customers.Add(string.Format("{0}", sdr["Dscription"]));
                }              
                
            }

            connection.Close();
            
        }
        catch (Exception ex)
        {
            //customers.Add(string.Format("{0}", ex.Message.ToString()));
            //return customers.ToArray();
        }
        return customers.ToArray();       
    }

    [System.Web.Services.WebMethod]
    //[System.Web.Script.Services.ScriptMethod(ResponseFormat = System.Web.Script.Services.ResponseFormat.Json)]
    public static List<Articulo> AutoCompleteAll(string CodArticulo)
    {
        List<Articulo> customers = new List<Articulo>();
        try
        {
            SqlConnection connection = new SqlConnection(connectionStringPJ);

            SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@TipoConsulta", 9);
            command.Parameters.AddWithValue("@Articulo", "");
            command.Parameters.AddWithValue("@PrecioCompra", 0);
            connection.Open();
            using (SqlDataReader sdr = command.ExecuteReader())
            {
                while (sdr.Read())
                {
                    Articulo obj = new Articulo();
                    obj.ItemCode = sdr["ItemCode"].ToString();
                    obj.Dscription = sdr["Dscription"].ToString();
                    customers.Add(obj);                  
                }
            }
            connection.Close();
        }
        catch (Exception ex)
        {
          
        }
        return customers;
    }

    [System.Web.Services.WebMethod]
    public static string GetCurrentTime(string name)
    {
        return "Hello " + name + Environment.NewLine + "The Current Time is: "
            + DateTime.Now.ToString();
    }

    [System.Web.Services.WebMethod]
    public static List<Precios> ConsultaPrecios(string DescripArticulo, int TipoConsulta, int BDescripcion, int Rol)
    {
        Precios objPrecio = new Precios();
        List<Precios> lstPrecios = new List<Precios>();

        string CodArticulo = "--------------------";
        if (BDescripcion == 1)
            CodArticulo = ObtenerCodigo(8, DescripArticulo);
        else
            CodArticulo = DescripArticulo;

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        command.Parameters.AddWithValue("@PrecioCompra", 0.0);
        command.Parameters.AddWithValue("@RolApp", Rol);

        connection.Open();
        using (SqlDataReader sdr = command.ExecuteReader())
        {
            while (sdr.Read())
            {
                objPrecio = new Precios();
                objPrecio.ListName = sdr["Lista de precios"].ToString();
                objPrecio.MXP = Convert.ToDecimal(sdr["MXP"]).ToString("C2");
                objPrecio.USD = Convert.ToDecimal(sdr["USD"]).ToString("C2");
                lstPrecios.Add(objPrecio);
            }
        }
        connection.Close();
        return lstPrecios;
     
    }

    [System.Web.Services.WebMethod]
    public static List<Stocks> ConsultaStocks(string DescripArticulo, int TipoConsulta, int BDescripcion)
    {
        Stocks objStock = new Stocks();
        List<Stocks> lstStock = new List<Stocks>();

        string CodArticulo = "--------------------";
        if (BDescripcion == 1)
            CodArticulo = ObtenerCodigo(8, DescripArticulo);
        else
            CodArticulo = DescripArticulo;

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        command.Parameters.AddWithValue("@PrecioCompra", 0.0);

        connection.Open();
        using (SqlDataReader sdr = command.ExecuteReader())
        {
            while (sdr.Read())
            {
                objStock = new Stocks();
                objStock.Almacen = sdr["Almacen"].ToString();
                objStock.Stock = Convert.ToDecimal(sdr["Stock"]).ToString("N0");
                objStock.Solicitado = Convert.ToDecimal(sdr["Solicitado"]).ToString("N0");
                lstStock.Add(objStock);
            }
        }
        connection.Close();
        return lstStock;

    }

    [System.Web.Services.WebMethod]
    public static string CalculaUtilidadPrecio(int TipoConsulta, string CodArticulo, int TipoMoneda, string Monto)
    {

        string Util = "";
        decimal MontoMoneda = Convert.ToDecimal(Monto);
        //decimal Usd = Convert.ToDecimal(Monto);
       // decimal Porcentaje = Convert.ToDecimal(Monto);

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        SqlParameter PrecCompra = new SqlParameter("@PrecioCompra", decimal.Zero);
        PrecCompra.Direction = ParameterDirection.Output;
        PrecCompra.DbType = DbType.Decimal;
        PrecCompra.Scale = 6;
        command.Parameters.Add(PrecCompra);

        connection.Open();
        command.ExecuteNonQuery();
        PrecioCompra = Convert.ToDecimal(command.Parameters["@PrecioCompra"].Value.ToString());
        connection.Close();

        Util = decimal.Round((((PrecioCompra / MontoMoneda) - 1) * -100), 2).ToString() /*+ "%"*/;       

        return Util;
        

    }


    
    [System.Web.Services.WebMethod]
    public static string CalculaUtilidadPorciento(int TipoConsulta, string DescripArticulo, int TipoMoneda, string Monto, int BDescripcion)
    {

        string Util = "";
        //decimal Pesos = Convert.ToDecimal(Monto);
        //decimal Usd = Convert.ToDecimal(Monto);
        decimal Porcentaje = Convert.ToDecimal(Monto);

        string CodArticulo = "--------------------";
        if (BDescripcion == 1)
            CodArticulo = ObtenerCodigo(8, DescripArticulo);
        else
            CodArticulo = DescripArticulo;

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        SqlParameter PrecCompra = new SqlParameter("@PrecioCompra", decimal.Zero);
        PrecCompra.Direction = ParameterDirection.Output;
        PrecCompra.DbType = DbType.Decimal;
        PrecCompra.Scale = 6;
        command.Parameters.Add(PrecCompra);

        connection.Open();
        command.ExecuteNonQuery();
        PrecioCompra = Convert.ToDecimal(command.Parameters["@PrecioCompra"].Value.ToString());
        connection.Close();
        if (100 - Porcentaje == 0)
            Util = PrecioCompra.ToString();
        else
            Util = decimal.Round((PrecioCompra / (100 - Porcentaje)) * 100, 2).ToString(/*"C2"*/);
        return Util;


    }
    
    [System.Web.Services.WebMethod]
    public static string ObtenerDescripcionArticulo(int TipoConsulta, string CodArticulo)
    {
        string Descripcion = "";

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        command.Parameters.AddWithValue("@PrecioCompra", 0.0);

        connection.Open();
        using (SqlDataReader sdr = command.ExecuteReader())
        {
            while (sdr.Read())
            {
                Descripcion = sdr["Dscription"].ToString();
            }
        }

        return Descripcion;
    }


    public static string ObtenerCodigo(int TipoConsulta, string CodArticulo)
    {
        string Codigo = "---------------------";

        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        command.Parameters.AddWithValue("@PrecioCompra", 0.0);

        connection.Open();
        using (SqlDataReader sdr = command.ExecuteReader())
        {
            while (sdr.Read())
            {
                Codigo = sdr["ItemCode"].ToString();
            }
        }

        return Codigo;
    }

    [System.Web.Services.WebMethod]
    public static string ObtenerMensaje(int Opcion)
    {
        return "Pedro Juarez";
    }

    [System.Web.Services.WebMethod]
    public static Descuento ObtenerDescuentos(int TipoConsulta, string CodArticulo, decimal Descuento)
    {
        Descuento Codigo = new Descuento();


        SqlConnection connection = new SqlConnection(connectionStringPJ);

        SqlCommand command = new SqlCommand("PJ_CalculoUtilidad", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@Articulo", CodArticulo);
        command.Parameters.AddWithValue("@PrecioCompra", 0.0);
        command.Parameters.AddWithValue("@Desc", Descuento);

        connection.Open();
        using (SqlDataReader sdr = command.ExecuteReader())
        {
            while (sdr.Read())
            {
                Codigo.PrecioCompraMXP = Convert.ToDecimal(sdr["PrecioDescMXP"]).ToString("C2");
                Codigo.PrecionVentaMXP = decimal.Round((Convert.ToDecimal(sdr["UtilidadDescMXP"])) * 100, 2).ToString() + " %";
                
                Codigo.PrecioCompraUSD = Convert.ToDecimal(sdr["PrecioDescUSD"]).ToString("C2");
                Codigo.PrecionVentaUSD = decimal.Round((Convert.ToDecimal(sdr["UtilidadDescUSD"])) * 100, 2).ToString() + " %";
            }
        }

        return Codigo;
    }


    [System.Web.Services.WebMethod]
    public static AUsuario ObtenerUsuario(string NombreUsuario, string Contrasenha)
    {
        AUsuario oUsuario = new AUsuario();
        try
        {

            SqlConnection conection = new SqlConnection(connectionStringSGUV);

            if (NombreUsuario != string.Empty && Contrasenha != string.Empty)
            {

                SqlCommand command = new SqlCommand("SGUV_Usuarios", conection);

                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@TipoConsulta", 4);
                command.Parameters.AddWithValue("@ClaveEntidad", 0);
                command.Parameters.AddWithValue("@Usuario", NombreUsuario);
                command.Parameters.AddWithValue("@Contrasenha", Contrasenha);
                command.Parameters.AddWithValue("@Rol", 0);
                command.Parameters.AddWithValue("@Vendedor", 0);
                SqlParameter ValidaUsuario = new SqlParameter("@ValidaUsuario", 0);
                ValidaUsuario.Direction = ParameterDirection.Output;
                command.Parameters.Add(ValidaUsuario);
                conection.Open();
                command.ExecuteNonQuery();
                int Validar = Convert.ToInt32(command.Parameters["@ValidaUsuario"].Value.ToString());

                //LimpiarCampos();
                if (Validar == 1)
                {
                    SqlCommand command2 = new SqlCommand("SGUV_Usuarios", conection);
                    command2.CommandType = CommandType.StoredProcedure;
                    command2.Parameters.AddWithValue("@TipoConsulta", 6);
                    command2.Parameters.AddWithValue("@ClaveEntidad", 0);
                    command2.Parameters.AddWithValue("@Usuario", NombreUsuario);
                    command2.Parameters.AddWithValue("@Contrasenha", Contrasenha);
                    command2.Parameters.AddWithValue("@Rol", 0);
                    command2.Parameters.AddWithValue("@Vendedor", 0);

                    DataTable table = new DataTable();
                    SqlDataAdapter adapter = new SqlDataAdapter();
                    adapter.SelectCommand = command2;
                    adapter.Fill(table);

                    foreach (DataRow row in table.Rows)
                    {
                        oUsuario.ClaveEntidad = row.Field<int>("ClaveEntidad");
                        oUsuario.NombreUsuario = row.Field<string>("NombreUsuario");
                        oUsuario.Contrasenha = row.Field<string>("Contrasenha");
                        oUsuario.Rol = row.Field<int>("RolApp");
                        oUsuario.Vendedor = row.Field<int>("SlpCode");
                        oUsuario.Sucursal = row.Field<string>("Sucursal");


                        oUsuario.Id_Usuario = row.Field<int>("ClaveEntidad");
                       // oUsuario.Rol = oUsuario.Rol;
                        oUsuario.NombreUsuario = NombreUsuario;
                        oUsuario.Sucursal = oUsuario.Sucursal;
                        oUsuario.Vendedor1 = oUsuario.Vendedor;
                        oUsuario.Edit = row.Field<string>("Edit");
                        oUsuario.Usuario = row.Field<string>("Nombre");
                        oUsuario.Almacen = row.Field<string>("Almacen");
                        oUsuario.ClaveSucursal = row.Field<string>("CodSucursal");
                       

                    }
                 
                    conection.Close();
                }
                
            }
            
        }
        catch (Exception ex)
        {
            //LimpiarCampos();
            //txtUsuario.Focus();
            //conection.Close();
            //MessageBox.Show("Error inesperado: " + ex.Message, "HalcoNET", MessageBoxButtons.OK, MessageBoxIcon.Error);
            //this.DialogResult = DialogResult.Abort;
        }
        return oUsuario;
    }

    //----------------------------------
    [System.Web.Services.WebMethod]
    public static DatosIP ObtenerIP(int TipoConsulta, string Correo)
    {
        DatosIP Codigo = new DatosIP();
        
        SqlConnection connection = new SqlConnection(connectionStringSGUV);

        SqlCommand command = new SqlCommand("PJ_DatosEnvioCorreo", connection);
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddWithValue("@TipoConsulta", TipoConsulta);
        command.Parameters.AddWithValue("@TipoCorreo", Correo);

        connection.Open();
        using (SqlDataReader sdr = command.ExecuteReader())
        {
            while (sdr.Read())
            {
                Codigo.IP_Publica = Convert.ToString(sdr["IPPublicada"]);
                Codigo.Publicado = Convert.ToInt32(sdr["Publicada"]);
            }
        }

        return Codigo;
    }


    public class Articulo
    {
        public string ItemCode { get; set; }
        public string Dscription { get; set; }
 
    }

    public class Precios
    {
        public string ListName { get; set; }
        public string MXP { get; set; }
        public string USD { get; set; } 
    }

    public class AUtilidad
    {
        public decimal Monto { get; set; }
        public string Mensaje { get; set; }
    }

    public class Stocks
    {
        public string Almacen { get; set; }
        public string Stock { get; set; }
        public string Solicitado { get; set; }
    }

    public class Descuento
    {
        public string PrecioCompraMXP { get; set; }
        public string PrecionVentaMXP { get; set; }
        public string PrecioCompraUSD { get; set; }
        public string PrecionVentaUSD { get; set; }
    }

    public class AUsuario
    {
        public int Id_Usuario { get; set; }
        public int ClaveEntidad { get; set; }
        public string NombreUsuario { get; set; }
        public string Contrasenha { get; set; }
        public int Rol {get;set;}
        public int Vendedor { get; set; }
        public int Vendedor1 { get; set; }
        public string Edit { get; set; }
        public string Sucursal { get; set; }
        public string Usuario { get; set; }
        public string Almacen { get; set; }
        public string ClaveSucursal { get; set; }        

    }

    public class DatosIP
    {
        public string IP_Publica { get; set; }
        public int Publicado { get; set; }

    }


}
