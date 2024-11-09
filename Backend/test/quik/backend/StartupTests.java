package quik.backend;

import main.server.http.controllers.CustomerController;
import main.server.http.controllers.GlobalEndpointsController;
import main.server.http.controllers.reminders.ProductReminderController;
import main.server.http.controllers.reminders.ServiceRenewController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;

import static org.assertj.core.api.Assertions.assertThat;

@ComponentScan(basePackages = "main.server")
@SpringBootTest(classes = StartupTests.class)
class StartupTests {

	@Autowired
	private GlobalEndpointsController globalEndpointsController;
	@Autowired
	private ProductReminderController productReminderController;
	@Autowired
	private CustomerController customerController;

	@Autowired
	private ServiceRenewController serviceRenewController;
	@Autowired
	private AuthenticationController AuthenticationController;

	@Test
	void globalContextLoad() throws Exception {
		assertThat(globalEndpointsController).isNotNull();
	}

	@Test
	void productReminderContextLoad() {
		assertThat(productReminderController).isNotNull();
	}

	@Test
	void customerContextLoad() {
		assertThat(customerController).isNotNull();
	}

	@Test
	void serviceContextLoad() {
		assertThat(serviceRenewController).isNotNull();
	}

	@Test
	void authenticationContextLoad() {
		assertThat(AuthenticationController).isNotNull();
	}
}
