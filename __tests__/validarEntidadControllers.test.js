const { validarCliente } = require('../controllers/validarEntidadControllers.js');
const { connectToDatabase, closeDatabaseConnection } = require('../config/database.js');
const mock =  require('../config/mock.js')
const sql = require('mssql');

// Mockear las dependencias externas
jest.mock('../config/database.js');
jest.mock('mssql');

describe('validarCliente', () => {
  // Limpiar los mocks después de cada prueba
  afterEach(() => {
      jest.clearAllMocks();
  });

  it('debería ir con parametros 200', async () => {
      const req = { body: {"tabla": "Entidad","codigoPosto":"762795s34-5"}};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      // Mock de la respuesta de la consulta SQL
      const mockResponse = [{Entidad : "76279534-5"}];
      sql.query.mockResolvedValue({ recordset: mockResponse });

      await validarCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it('cliente no existe en la base de datos 404', async () => {
    const req = { body: {"tabla": "Entidad","codigoPosto":"762795s34-5"}};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock de la respuesta de la consulta SQL
    const mockResponse = [];
    sql.query.mockResolvedValue({ recordset: mockResponse });

    await validarCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ mensaje: `La entidad 762795s34-5 no se encuentra en nuestros registros` });
  });

  it('no existe dfata de entrada 400', async () => {
    const req = { body: {}};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock de la respuesta de la consulta SQL
    const mockResponse = [];
    sql.query.mockResolvedValue({ recordset: mockResponse });

    await validarCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: `Parámetros faltantes o vacíos`  });
  });



  it('debería manejar excepciones correctamente', async () => {
    const req = { body: {"tabla": "Entidad","codigoPosto":"762795s34-5"}};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock para forzar un error en la consulta SQL
    const mockError = new Error("Error en la base de datos");
    sql.query.mockRejectedValue(mockError);

    await validarCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: `Error en el servidor [validar-entidad-ms] :  ${mockError.message}` });
  });


});
