package main.server.sql;

import jakarta.annotation.PostConstruct;
import main.server.ServerConstants;
import main.server.logger.ServerLogManager;
import main.server.sql.config.SqlConnectionManger;
import main.server.sql.function.SqlFunctionExecutor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import static main.server.ServerConstants.SQL_YAML_CONFIG_LOCATION;

@Service
public class SqlClient {

	private final SqlConnectionManger sqlConnectionManger;
	private final Logger sqlClientLogger;
	private final String sqlConfigurationYamlFilePath = SQL_YAML_CONFIG_LOCATION;
	private final ServerLogManager logManager;
	private Connection sqlConnection;

	private SqlFunctionExecutor sqlFunctionExecutor;

	//    public SqlClient(SqlConfiguration sqlServerConfiguration){
//        sqlConnectionManger=new SqlConnectionManger(sqlServerConfiguration);
//        sqlClientLogger=LogManager.getLogger(ServerConstants.SQL_CLIENT_LOGGER_NAME);
//    }

	public SqlClient(SqlFunctionExecutor sqlFunctionExecutor, ServerLogManager logManager) {
		sqlConnectionManger = new SqlConnectionManger();
		this.sqlFunctionExecutor = sqlFunctionExecutor;
		this.logManager = logManager;
		sqlClientLogger = LogManager.getLogger(ServerConstants.SQL_CLIENT_LOGGER_NAME);
	}

	@PostConstruct
	public void createSqlConnection() {
		sqlClientLogger.debug(String.format("Opening sql yaml file configuration at [%s]",
				sqlConfigurationYamlFilePath));

		try {
			sqlConnectionManger.initializeSqlConnectionConfig();
			sqlClientLogger.info("Opening connection to sql server: " + sqlConnectionManger.getServerConfigDetails());
			sqlConnectionManger.getSqlConnectionConfig().getConnection().close();//test connection to sql server and
			// close it
			sqlFunctionExecutor.initializeJdbcTemplate(sqlConnectionManger.getSqlConnectionConfig());
			sqlClientLogger.info("Connection to sql server successfully.");
		} catch (SQLException | IOException e) {
			sqlClientLogger.error(e.getMessage());
			throw new RuntimeException(e);
		}
	}

//    public String getCostumerNameByID(int id) {
//        return sqlFunctionManager.getCostumerNameByID(id);
//    }
//
//    public String getSupplierNameByID(int id) {
//        return sqlFunctionManager.getSupplierNameByID(id);
//    }
//
//    public List<TaskRecord> getClosedTaskForCustomer(int id) {
//        return sqlFunctionManager.getClosedTaskForCustomer(id);
//    }

}
