const axios = require('axios');
const logger = require('../config/logger.js');
const { connectToDatabase, closeDatabaseConnection } = require('../config/database.js');
const sql = require('mssql');

/**
 * Funcion qe consulta si el servicio tecnico existe en las base de datos de makita
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function validarCliente(req , res){
    try{

        console.log("reqbody: " , req.body);
        
        if (!req.body.tabla || !req.body.entidad) {
            logger.error(`Error: los parametros de entrada son incorrectos`);
            return res.status(400).json({ error: `Parámetros faltantes o vacíos` });
        }

        const tabla = req.body.tabla;
        const entidad = req.body.codigoPosto;
       
        logger.info(`Iniciamos la funcion validarCliente`);

        let validacionCliente;

        // Conectarse a la base de datos 'DTEBdQMakita'
        await connectToDatabase('DTEBdQMakita');
        const consulta = `SELECT * FROM ${tabla} WHERE Entidad= '${entidad}' and tipoEntidad = 'cliente' and vigencia = 'S'`;
        const result = await sql.query(consulta);
        
        validacionCliente = result.recordset;

        if(!validacionCliente.length > 0) {
            logger.info(`La entidad ${entidad} no se encuentra en nuestros registros` 
            );
            return res.status(404).json({ mensaje: `La entidad ${entidad} no se encuentra en nuestros registros` });
        }
        
        logger.info(`Fin  la funcion validarCliente ${JSON.stringify(validacionCliente)}`);
        return  res.status(200).json(validacionCliente);
     }catch (error) {
       
        // Manejamos cualquier error ocurrido durante el proceso
        logger.error(`Error en validarCliente: ${error.message}`);
        res.status(500).json({ error: `Error en el servidor [validar-entidad-ms] :  ${error.message}`  });
    }finally{
        await closeDatabaseConnection();
    }
}


module.exports = {
    validarCliente
};
