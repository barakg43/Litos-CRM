package main.server.sql.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
import main.server.ServerConstants;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;

import javax.sql.DataSource;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import static main.server.ServerConstants.SQL_YAML_CONFIG_LOCATION;


@Configuration
public class SqlConnectionManger {
	private final String sqlConfigurationYamlFilePath = SQL_YAML_CONFIG_LOCATION;
	private final Logger sqlLogger;
	private DataSource dataSourceConfig;
	private SqlConfiguration sqlConnectionConfiguration;
	private Connection sqlConnection;
	private SimpleJdbcCall simpleJdbcCall;

	public SqlConnectionManger() {
		sqlLogger = LogManager.getLogger(ServerConstants.SQL_CLIENT_LOGGER_NAME);
	}

	public void initializeSqlConnectionConfig() throws SQLException, IOException {
		sqlConnectionConfiguration = createSqlConfigurationFromFile();
		dataSourceConfig = getDataSource(sqlConnectionConfiguration);


//        simpleJdbcCall=new SimpleJdbcCall(dataSourceConfig);
//        simpleJdbcCall.withFunctionName();
	}

	@Bean("sqlConfig")
	public SqlConfiguration createSqlConfigurationFromFile() {
		ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
		SqlConfiguration sqlConfiguration;
		FileReader fileReader;

		try {
			fileReader = new FileReader(sqlConfigurationYamlFilePath);
			sqlConfiguration = yamlMapper.readValue(fileReader, SqlConfiguration.class);
		} catch (IOException e) {
			sqlLogger.error(e.getMessage() + "\nAbsolute path: " + new File(".").getAbsolutePath());
			throw new RuntimeException(e);
		}

		return sqlConfiguration;
	}


	@Bean
	@Primary
	@ConfigurationProperties(prefix = "spring.datasource")
	public DataSource getDataSource(@Qualifier("sqlConfig") SqlConfiguration sqlServerConfiguration) {
		SQLServerDataSource msSqlDataSource = new SQLServerDataSource();
		msSqlDataSource.setServerName(sqlServerConfiguration.getServerName());
		msSqlDataSource.setPortNumber(sqlServerConfiguration.getPort());
		msSqlDataSource.setUser(sqlServerConfiguration.getUsername());
		msSqlDataSource.setPassword(sqlServerConfiguration.getPassword());
		msSqlDataSource.setDatabaseName(sqlServerConfiguration.getDatabaseName());
		msSqlDataSource.setEncrypt("true");
		msSqlDataSource.setTrustServerCertificate(true);

		return msSqlDataSource;
	}

	public String getServerConfigDetails() {
		return sqlConnectionConfiguration.getServerConfigDetails();
	}

	public DataSource getSqlConnectionConfig() {
		return dataSourceConfig;
	}
}
