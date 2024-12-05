package main.server.uilities;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import main.server.sql.dto.reminder.ePeriodKind;
import org.apache.logging.log4j.LogManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Set;


public class UtilityFunctions {
	public static final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();

	public static Timestamp postDateByMonthAmount(Timestamp currentDate, ePeriodKind periodToAdd) {

		return postDateByMonthAmount(currentDate, periodToAdd.getMonthsPeriod());

	}

	public static Timestamp postDateByMonthAmount(Timestamp currentDate, int periodToAdd) {

		return Timestamp.valueOf(currentDate.toLocalDateTime().plusMonths(periodToAdd).plusDays(-1).toLocalDate().atStartOfDay());

	}

	public static Timestamp postDateByMonthAmount(LocalDate localDate, int periodToAdd) {

		return Timestamp.valueOf(localDate.plusMonths(periodToAdd).plusDays(-1).atStartOfDay());

	}

	public static Timestamp postDateByDaysAmount(Timestamp currentDate, int periodToAdd) {

		return Timestamp.valueOf(currentDate.toLocalDateTime().plusDays(periodToAdd).toLocalDate().atStartOfDay());

	}

	public static Timestamp postDateByDaysAmount(LocalDate localDate, int periodToAdd) {

		return Timestamp.valueOf(localDate.plusDays(periodToAdd).atStartOfDay());

	}

	public static Timestamp postDateByDaysAmountFromToday(int periodToAdd) {

		return postDateByDaysAmount(LocalDate.now(), periodToAdd);

	}

	public static Timestamp postDateByMonthAmountFromToday(int periodToAdd) {

		return postDateByMonthAmount(LocalDate.now(), periodToAdd);

	}

	public static <T> void validEntityValidations(T entityObject) throws IllegalArgumentException {

		Validator validator = factory.getValidator();
		Set<ConstraintViolation<T>> violations = validator.validate(entityObject);
		if (!violations.isEmpty()) {
			StringBuilder stringBuilderViolations = new StringBuilder();

			for (ConstraintViolation<T> violation : violations) {
				stringBuilderViolations.append(violation.getPropertyPath()).append(':').append(violation.getMessage()).append('\n');
			}
			throw new IllegalArgumentException(stringBuilderViolations.toString());

		}
	}

	public static Pageable getPageObject(Integer pageNumber, Integer pageSize) {
		Pageable page;
		if (pageSize != null && pageNumber != null)
			page = PageRequest.of(pageNumber - 1, pageSize);
		else
			page = Pageable.unpaged();
		return page;
	}

	public static String printPWD() {
		String currentPath = null;
		String massage = null;
		try {
			currentPath = new java.io.File(".").getCanonicalPath();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		massage = "Current dir:" + currentPath;
		LogManager.getLogger("restartedMain").info(massage);
		return massage;
	}
}