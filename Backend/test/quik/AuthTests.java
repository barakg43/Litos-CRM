package quik;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import main.server.config.security.SecurityConstants;
import main.server.http.controllers.AuthenticationController;
import main.server.http.controllers.CustomerController;
import main.server.sql.dto.auth.LoginUserRecord;
import main.server.sql.dto.auth.RegisterUserDto;
import main.server.sql.entities.UserEntity;
import main.server.sql.repositories.UserRepository;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ComponentScan(basePackages = "main.server")
@SpringBootTest(classes = AuthTests.class)
public class AuthTests {

	private final String USER_PASSWORD = "test@1123";
	private final HandlerExceptionResolver handlerExceptionResolver;
	@Autowired
	PasswordEncoder passwordEncoder;
	@Autowired
	AuthenticationController authenticationController;
	@Autowired
	UserRepository userRepository;

	@Autowired
	CustomerController customerController;
	MockMvc mockMvc;
	ObjectMapper objectMapper;
	UserEntity userEntityToTest;

	public AuthTests(@Autowired HandlerExceptionResolver handlerExceptionResolver) {
		this.handlerExceptionResolver = handlerExceptionResolver;
	}


	@BeforeEach
	public void setup() {
		objectMapper = new ObjectMapper();
		this.mockMvc = MockMvcBuilders.standaloneSetup(authenticationController, customerController)
				.setHandlerExceptionResolvers(handlerExceptionResolver)
				.setMessageConverters(new MappingJackson2HttpMessageConverter())
				.build();
		mockMvc.getDispatcherServlet().setCleanupAfterInclude(true);
	}

	@Test
	@BeforeEach
	public void authContextLoad() {
		assertThat(authenticationController).isNotNull();
		assertThat(customerController).isNotNull();
	}

	@BeforeEach
	void createUser() {
		userEntityToTest = new UserEntity("test", "test signup", "test@t.com", passwordEncoder.encode(USER_PASSWORD));
		userRepository.save(userEntityToTest);
	}

	@AfterEach
	void deleteUser() {
		userRepository.delete(userEntityToTest);

	}

	@Test
	void signup_shouldReturnOk() throws Exception {
		RegisterUserDto registerUserDto = new RegisterUserDto("test1", "test2@t.com", "test@1123", "test signup");
		UserEntity userToDeleteAfterTest = new UserEntity(
				registerUserDto.username(),
				registerUserDto.fullName(),
				registerUserDto.email(),
				registerUserDto.password());
		mockMvc.perform(post("/api/auth/signup")
						.content(objectMapper.writeValueAsString(registerUserDto))
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
		userRepository.findByUsername(registerUserDto.username()).ifPresent(userRepository::delete);
	}

	@Test
	void signup_shouldReturnConflictUserAlreadyExists() throws Exception {
		RegisterUserDto registerUserWithUser = new RegisterUserDto(userEntityToTest.getUsername(),
				"other_" + userEntityToTest.getEmail(),
				"test@1123", "test " +
				"signup");
		RegisterUserDto registerUserWithEmail = new RegisterUserDto(userEntityToTest.getUsername() + "_other",
				userEntityToTest.getEmail(), "test" +
				"@1123", "test " +
				"signup");
		mockMvc.perform(post("/api/auth/signup")
						.content(objectMapper.writeValueAsString(registerUserWithUser))
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.title").value(Matchers.containsString("Username already exists")));
		System.out.println("passed username already exist test");
		mockMvc.perform(post("/api/auth/signup")
						.content(objectMapper.writeValueAsString(registerUserWithEmail))
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.title").value(Matchers.containsString("Email already exists")));
		System.out.println("passed email already exist test");

	}

	@Test
	void signin_shouldReturnOk() throws Exception {
		mockMvc.perform(post("/api/auth/login")
						.content(objectMapper.writeValueAsString(new LoginUserRecord(userEntityToTest.getUsername(),
								USER_PASSWORD)))
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}

	@Test
	void signin_badPassword_shouldReturnBadRequest() throws Exception {
		mockMvc.perform(post("/api/auth/login")
						.content(objectMapper.writeValueAsString(new LoginUserRecord("wrong", "wrong")))
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.title").value(Matchers.containsString("Bad Credentials")));
	}

	@Test
	void refreshtoken_shouldReturnOk() throws Exception {
		List<Cookie> cookies = new ArrayList<>();
		mockMvc.perform(post("/api/auth/login")
						.content(objectMapper.writeValueAsString(new LoginUserRecord(userEntityToTest.getUsername(),
								USER_PASSWORD)))
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andDo(result -> cookies.addAll(List.of(result.getResponse().getCookies())));

		mockMvc.perform(post("/api/auth/refresh-token")
						.contentType(MediaType.APPLICATION_JSON)
						.cookie(cookies.get(1)))
				.andExpect(status().isOk());
	}

	@Test
	void signin_unauthorizedAccessProtectedResource_shouldUnauthorized() throws Exception {

		mockMvc.perform(get("/api/customers")
						.content(objectMapper.writeValueAsString(new LoginUserRecord("wrong", USER_PASSWORD)))
						.contentType(MediaType.APPLICATION_JSON)
						.cookie(new Cookie(SecurityConstants.AUTH_ACCESS_KEY, null)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.title").value(Matchers.containsString("Bad Credentials")));
	}

	@Test
	void signin_accessProtectedResource_shouldOk() throws Exception {

		mockMvc.perform(post("/api/auth/login")
						.content(objectMapper.writeValueAsString(new LoginUserRecord(userEntityToTest.getUsername(),
								USER_PASSWORD)))
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());


		mockMvc.perform(get("/api/customers")
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}
}
