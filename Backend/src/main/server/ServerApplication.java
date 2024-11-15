package main.server;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import main.server.logger.ServerLogManager;
import main.server.sql.SqlClient;
import main.server.sql.bulider.SqlQueryBuilder;
import main.server.sql.bulider.component.eJoinType;
import main.server.sql.dto.customer.CustomerFullDetailsRecord;
import main.server.sql.function.SqlFunctionExecutor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import static main.server.http.controllers.GlobalEndpointsController.printPWD;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})


//@EntityScan(basePackages = "main.server.sql.entities")
@EnableJpaRepositories(basePackages = "main.server.sql.repositories")
//@ComponentScan(basePackages = "main.server.sql.entities")
public class ServerApplication extends SpringBootServletInitializer {
	public static void main(String[] args) {

		SpringApplication.run(ServerApplication.class, args);
		printPWD();
	}


	private static void testSqlBuilder() {
		SqlQueryBuilder sqlQueryBuilder = new SqlQueryBuilder();
		String select = sqlQueryBuilder.from("tb1", "Tb1")
				.join(eJoinType.INNER, "tb2", "Tb2", "tb2.moshe", "tb1.yossi")
				.select("1", "2", "5", "4")
				.where().greaterThan("id", 1, false)
				.having().equal("customerName", "moshe1", true)
				.orderBy(new String[]{"t1", "te"})
				.limit(5)
				.build();
//		BEGIN TRANSACTION
//
//		DELETE
//		FROM tbConnectionPQCWithOrderDetails
//		WHERE OrderDetailsID = @OrderDetailsID
//				AND PQCDetailsID = @PQCDetailsID
//
//				IF @@error <> 0
//		BEGIN
//		ROLLBACK TRAN
//		RETURN
//				END
//
//		COMMIT TRANSACTION
//		SqlQueryBuilder sqlQueryBuilder2 = new SqlQueryBuilder();
		String delete = SqlQueryBuilder.getNewBuilder()
				.from("tbConnectionPQCWithOrderDetails")
				.delete()
				.where().equal("OrderDetailsID", 2, false)
				.and().equal("PQCDetailsID", 3, false)
				.build();
//		BEGIN TRANSACTION
//		INSERT tbConnectionPriceQuotesDetails (
//				PQSDetailsID,
//				PQCDetailsID)
//		VALUES (
//		@PQSDetailsID,
//		@PQCDetailsID)
//		IF @@error <> 0
//		BEGIN
//		ROLLBACK TRAN
//		RETURN
//				END
//
//		COMMIT TRANSACTION
//		System.out.println(query1);
//		String insert = SqlQueryBuilder.getNewBuilder()
//				.from("tbConnectionPriceQuotesDetails")
//				.insert(Map.ofEntries(
//						Map.entry("PQSDetailsID", 3),
//						Map.entry("PQCDetailsID", 7)))
//				.build();

//		BEGIN TRANSACTION
//
//		UPDATE tbInvoicesForContracts
//		SET dateOfDebit = DATEADD(MONTH, @MonthAmount, dateOfDebit)
//		WHERE id = @ID
//
//				IF @@error <> 0
//		BEGIN
//		ROLLBACK TRAN
//		RETURN
//				END
//
//		COMMIT TRANSACTION
		String update = SqlQueryBuilder.getNewBuilder()
				.from("tbConnectionPriceQuotesDetails")
				.update(Map.ofEntries(
						Map.entry("PQSDetailsID", 1),
						Map.entry("PQCDetailsID", 2)
				)).where().equal("id", 3, false).build();
		System.out.println(select);
		System.out.println("==========");
		System.out.println(delete);
		System.out.println("==========");
//		System.out.println(insert);
		System.out.println("==========");
		System.out.println(update);
	}

	private static void testFunction() {
		SqlFunctionExecutor sqlFunctionExecutor = new SqlFunctionExecutor();

		SqlClient sqlClient = new SqlClient(sqlFunctionExecutor, new ServerLogManager());
		sqlClient.createSqlConnection();
		int loopAmount = 1;
		Instant start, end;
		ObjectMapper objectMapper = new ObjectMapper();
		String json = "  {\"customerID\": 88,\n" +
				"    \"activeContractID\": 11,\n" +
				"    \"customerShortName\": \"ברק גולן\",\n" +
				"    \"customerName\": \"מברק גולן בע\",\n" +
				"    \"customerStatus\": null,\n" +
				"    \"customerIdentificationNumber\": \"55116554\",\n" +
				"    \"customerMainPhone\": \"03-5758047\",\n" +
				"    \"customerMainFax\": null,\n" +
				"    \"customerMainEMail\": \"#mailto:barak@litos.co.il#\",\n" +
				"    \"customerWebSite\": null,\n" +
				"    \"remarks\": \"in-service\",\n" +
				"    \"address\": \"תובל 22 \\r\\nקומה 4\",\n" +
				"    \"city\": \"רמת גן\",\n" +
				"    \"postalCode\": 554764,\n" +
				"    \"addressRemarks\": \"אין\",\n" +
				"    \"contactPersonName\": \"אברהם                         \",\n" +
				"    \"contactPersonPost\": null,\n" +
				"    \"contactPersonPhone\": null,\n" +
				"    \"contactPersonMobilePhone\": \"054-1234567\",\n" +
				"    \"contactPersonFax\": null,\n" +
				"    \"contactPersonEMail\": null}";
		CustomerFullDetailsRecord customerFullDetailsRecord;
		try {
			customerFullDetailsRecord = objectMapper.readValue(json, CustomerFullDetailsRecord.class);
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}

		final AtomicLong time1 = new AtomicLong(0), time2 = new AtomicLong(0);
		for (int i = 0; i < loopAmount; i++) {
//            new Thread(()->{
			Instant start1 = Instant.now();
			Instant end1 = Instant.now();
			time1.addAndGet(Duration.between(start1, end1).toMillis());
//            }).start();
//            new Thread(()->{

//            }).start();
//            new Thread(()->{
//			Instant start2 = Instant.now();
//			customerSqlExecutor.getCustomerNameByID(1);
//			Instant end2 = Instant.now();
//			time2.addAndGet(Duration.between(start2, end2).toMillis());
//            }).start();
		}
//        try {
//            Thread.sleep(20000);
//        } catch (InterruptedException e) {
//            throw new RuntimeException(e);
//        }

		System.out.format("time1 closed: %dms ## avg time2: %dmss  loop amount:%d",
				time1.get() / loopAmount, time2.get() / loopAmount, loopAmount);
//        System.out.format("customer name:%d\n",sqlClient.getClosedTaskForCustomer(10).size());

	}


}
