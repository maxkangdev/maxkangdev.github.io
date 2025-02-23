---
categories:
  - dev|개발
date: 2025-02-23T15:28:01+09:00
draft: false
tags:
  - junit
  - test
  - java
title: Useful JUnit Annotations for testing in  java
---

## Annotations 
### `@Test`

Marks a method as a test case.

```java
@Test
public void shouldReturnTrue() {
    assertTrue(true);
}
```

---

### `@BeforeEach`

Runs before each test method to set up test data or state.

```java
@BeforeEach
public void setUp() {
    // Initialize resources
}
```

---

### `@AfterEach`

Runs after each test method to clean up resources.

```java
@AfterEach
public void tearDown() {
    // Clean up resources
}
```

---

### `@BeforeAll`

Runs once before all test methods in the class. The method must be `static`.

```java
@BeforeAll
public static void initAll() {
    // Set up shared resources
}
```

---

### `@AfterAll`

Runs once after all test methods in the class. The method must be `static`.

```java
@AfterAll
public static void tearDownAll() {
    // Clean up shared resources
}
```

---

### `@Disabled`

Disables a test class or method from being executed.

```java
@Disabled("Temporarily disabled for bug fixing")
@Test
public void skippedTest() {
    // This test will be skipped
}
```

---

### `@Nested`

Allows defining inner test classes for better test organization.

```java
@Nested
class InnerTest {
    @Test
    void innerTestMethod() {
        assertEquals(2, 1 + 1);
    }
}
```

---

### `@DisplayName`

Gives a custom name to test classes or methods for better readability.

```java
@DisplayName("User Service Tests")
class UserServiceTest {

    @Test
    @DisplayName("Should create user successfully")
    void createUserTest() {
        assertNotNull(new User());
    }
}
```

---

### `@ParameterizedTest`

Marks a test method that should run multiple times with different parameters.

```java
@ParameterizedTest
@ValueSource(strings = {"apple", "banana", "cherry"})
void testWithStringValues(String fruit) {
    assertNotNull(fruit);
}
```

---

### `@ValueSource`

Provides simple values to a `@ParameterizedTest`.

```java
@ParameterizedTest
@ValueSource(ints = {1, 2, 3, 4})
void testWithIntValues(int number) {
    assertTrue(number > 0);
}
```

---

### `@CsvSource`

Provides multiple sets of arguments to a `@ParameterizedTest` using CSV format.

```java
@ParameterizedTest
@CsvSource({
    "apple, 5",
    "banana, 7",
    "cherry, 3"
})
void testWithCsvSource(String fruit, int quantity) {
    assertNotNull(fruit);
    assertTrue(quantity > 0);
}
```

---

### `@CsvFileSource`

Loads CSV data from an external file for a `@ParameterizedTest`.

```java
@ParameterizedTest
@CsvFileSource(resources = "/data/fruits.csv", numLinesToSkip = 1)
void testWithCsvFileSource(String fruit, int quantity) {
    assertNotNull(fruit);
    assertTrue(quantity > 0);
}
```

_Assumes `fruits.csv` is located in `src/test/resources/data/fruits.csv`._

---

### `@MethodSource`

Uses a factory method to provide arguments to a `@ParameterizedTest`.

```java
@ParameterizedTest
@MethodSource("stringProvider")
void testWithMethodSource(String argument) {
    assertNotNull(argument);
}

static Stream<String> stringProvider() {
    return Stream.of("apple", "banana", "cherry");
}
```

---

### `@ArgumentsSource`

Uses a custom arguments provider for complex test data.

```java
@ParameterizedTest
@ArgumentsSource(CustomArgumentsProvider.class)
void testWithArgumentsSource(String value) {
    assertNotNull(value);
}

static class CustomArgumentsProvider implements ArgumentsProvider {
    @Override
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
        return Stream.of("alpha", "beta", "gamma").map(Arguments::of);
    }
}
```

---
### `@ExtendWith`

Registers a custom extension to enhance test behavior (e.g., mocking, lifecycle callbacks).

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldFindUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User("John")));
        User user = userService.findUserById(1L);
        assertEquals("John", user.getName());
    }
}
```

_This example uses `MockitoExtension` to enable Mockito annotations like `@Mock` and `@InjectMocks`._

---

### `@RegisterExtension`

Programmatically registers a JUnit 5 extension for more dynamic scenarios.

```java
class ExternalResourceTest {

    @RegisterExtension
    static ExternalResource resource = new ExternalResource();

    @Test
    void testWithExternalResource() {
        assertTrue(resource.isAvailable());
    }
}
```

---

### `@TempDir`

Provides a temporary directory for file-based tests. The directory is cleaned up after the test.

```java
@Test
void testWithTempDir(@TempDir Path tempDir) throws IOException {
    Path file = tempDir.resolve("test.txt");
    Files.writeString(file, "JUnit 5");
    assertTrue(Files.exists(file));
}
```

---

### `@RepeatedTest`

Runs the same test method multiple times.

```java
@RepeatedTest(3)
void repeatedTest(RepetitionInfo repetitionInfo) {
    System.out.println("Repetition " + repetitionInfo.getCurrentRepetition());
}
```

---
### `@TestInstance`

Controls the lifecycle of test instances. By default, JUnit creates a new instance for each test method. Using `@TestInstance(Lifecycle.PER_CLASS)` allows sharing state across test methods.

```java
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SharedStateTest {

    private int counter = 0;

    @BeforeAll
    void setUp() {
        counter = 1;
    }

    @Test
    void testOne() {
        counter++;
        assertEquals(2, counter);
    }

    @Test
    void testTwo() {
        counter++;
        assertEquals(3, counter);
    }
}
```

---

### `@TestMethodOrder`

Defines the order in which test methods are executed.

```java
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderedTests {

    @Test
    @Order(1)
    void firstTest() {
        System.out.println("First test");
    }

    @Test
    @Order(2)
    void secondTest() {
        System.out.println("Second test");
    }
}
```

---

### `@EnabledOnOs` / `@DisabledOnOs`

Runs or skips tests based on the operating system.

```java
@EnabledOnOs(OS.WINDOWS)
@Test
void runsOnlyOnWindows() {
    assertTrue(System.getProperty("os.name").toLowerCase().contains("win"));
}

@DisabledOnOs(OS.LINUX)
@Test
void disabledOnLinux() {
    // This test will be skipped on Linux
}
```

---

### `@EnabledOnJre` / `@DisabledOnJre`

Runs or skips tests based on the Java Runtime Environment version.

```java
@EnabledOnJre(JRE.JAVA_17)
@Test
void runsOnlyOnJava17() {
    assertEquals("17", System.getProperty("java.version").substring(0, 2));
}

@DisabledOnJre(JRE.JAVA_8)
@Test
void disabledOnJava8() {
    // This test will not run on Java 8
}
```

---

### `@EnabledIf` / `@DisabledIf` (from JUnit Pioneer)

Runs or skips tests based on custom conditions.

```java
@EnabledIf(expression = "#{systemEnvironment['ENV'] == 'DEV'}", reason = "Only runs in DEV environment")
@Test
void runsOnlyInDev() {
    // Test logic here
}
```

---

## Assertions 
### `assertEquals`

Checks if two values are equal.

```java
@Test
void testAssertEquals() {
    assertEquals(5, 2 + 3, "Sum should be 5");
}
```

---

### `assertNotEquals`

Verifies that two values are not equal.

```java
@Test
void testAssertNotEquals() {
    assertNotEquals(10, 5 + 4, "Values should not be equal");
}
```

---

### `assertTrue` / `assertFalse`

Asserts that a condition is `true` or `false`.

```java
@Test
void testAssertTrue() {
    assertTrue(4 > 2, "4 should be greater than 2");
}

@Test
void testAssertFalse() {
    assertFalse(2 > 4, "2 should not be greater than 4");
}
```

---

### `assertNull` / `assertNotNull`

Checks if an object is `null` or not.

```java
@Test
void testAssertNull() {
    String str = null;
    assertNull(str, "String should be null");
}

@Test
void testAssertNotNull() {
    String str = "JUnit";
    assertNotNull(str, "String should not be null");
}
```

---

### `assertThrows`

Verifies that a method throws a specific exception.

```java
@Test
void testAssertThrows() {
    assertThrows(IllegalArgumentException.class, () -> {
        throw new IllegalArgumentException("Invalid input");
    });
}
```

---

### `assertAll`

Groups multiple assertions and executes them together, reporting all failures.

```java
@Test
void testAssertAll() {
    assertAll("User Properties",
        () -> assertEquals("John", "John"),
        () -> assertNotNull("email@example.com"),
        () -> assertTrue(5 > 3)
    );
}
```

---

### `assertArrayEquals`

Asserts that two arrays are equal.

```java
@Test
void testAssertArrayEquals() {
    int[] expected = {1, 2, 3};
    int[] actual = {1, 2, 3};
    assertArrayEquals(expected, actual, "Arrays should be equal");
}
```

---

### `fail`

Forces a test to fail. Useful in cases where the test should not reach a specific point.

```java
@Test
void testFail() {
    fail("This test fails unconditionally");
}
```

---

### `@EnabledIfEnvironmentVariable` / `@DisabledIfEnvironmentVariable`

Enables or disables tests based on environment variables.

```java
@EnabledIfEnvironmentVariable(named = "ENV", matches = "STAGING")
@Test
void runsOnlyInStaging() {
    // Runs only if ENV=STAGING
}

@DisabledIfEnvironmentVariable(named = "ENV", matches = "PRODUCTION")
@Test
void disabledInProduction() {
    // Skipped in production environment
}
```

---

### `@EnabledIfSystemProperty` / `@DisabledIfSystemProperty`

Enables or disables tests based on JVM system properties.

```java
@EnabledIfSystemProperty(named = "os.arch", matches = ".*64.*")
@Test
void runsOn64BitArchitecture() {
    // Runs only on 64-bit systems
}

@DisabledIfSystemProperty(named = "user.country", matches = "US")
@Test
void disabledForUSUsers() {
    // Skipped for users in the US
}
```

## Mockito Assertions

### `@Mock`

Creates a mock instance of a class or interface.

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Test
    void testMockCreation() {
        assertNotNull(userRepository); // Verifies that mock is created
    }
}
```

---

### `@InjectMocks`

Injects mock dependencies into the object under test.

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldFindUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User("Alice")));

        User user = userService.findUserById(1L);
        assertEquals("Alice", user.getName());
    }
}
```

---

### `when` / `thenReturn`

Defines mock behavior when a specific method is called.

```java
@Test
void testWhenThenReturn() {
    List<String> mockList = mock(List.class);
    when(mockList.get(0)).thenReturn("Mockito");

    assertEquals("Mockito", mockList.get(0));
}
```

---

### `verify`

Verifies that specific methods were called on a mock.

```java
@Test
void testVerify() {
    List<String> mockList = mock(List.class);
    mockList.add("JUnit");

    verify(mockList).add("JUnit"); // Verifies that add() was called with "JUnit"
}
```

---

### `verifyNoMoreInteractions`

Verifies that no other interactions occurred on the mock.

```java
@Test
void testVerifyNoMoreInteractions() {
    List<String> mockList = mock(List.class);
    mockList.add("Test");

    verify(mockList).add("Test");
    verifyNoMoreInteractions(mockList); // Ensures no other method was called
}
```

---

### `doThrow`

Specifies behavior to throw an exception when a method is called.

```java
@Test
void testDoThrow() {
    List<String> mockList = mock(List.class);
    doThrow(new RuntimeException("Error")).when(mockList).clear();

    assertThrows(RuntimeException.class, mockList::clear);
}
```

---

### `ArgumentCaptor`

Captures arguments passed to mock methods for further assertions.

```java
@Test
void testArgumentCaptor() {
    List<String> mockList = mock(List.class);
    ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);

    mockList.add("Captured");
    verify(mockList).add(captor.capture());

    assertEquals("Captured", captor.getValue());
}
```

## Advanced JUnit Extension Features

### Custom Extension with `@ExtendWith`

You can create custom JUnit extensions to hook into the test lifecycle.

**Example: LoggingExtension**

```java
public class LoggingExtension implements BeforeEachCallback, AfterEachCallback {

    @Override
    public void beforeEach(ExtensionContext context) {
        System.out.println("Starting test: " + context.getDisplayName());
    }

    @Override
    public void afterEach(ExtensionContext context) {
        System.out.println("Finished test: " + context.getDisplayName());
    }
}
```

**Usage in Test:**

```java
@ExtendWith(LoggingExtension.class)
class ExampleTest {

    @Test
    void sampleTest() {
        assertTrue(true);
    }
}
```

_This will log messages before and after each test._

---

### Parameter Resolver with `@ExtendWith`

Inject custom parameters into test methods.

**Example: Random Number Provider**

```java
public class RandomNumberParameterResolver implements ParameterResolver {

    @Override
    public boolean supportsParameter(ParameterContext parameterContext, ExtensionContext extensionContext) {
        return parameterContext.getParameter().getType() == int.class;
    }

    @Override
    public Object resolveParameter(ParameterContext parameterContext, ExtensionContext extensionContext) {
        return new Random().nextInt(100);
    }
}
```

**Usage in Test:**

```java
@ExtendWith(RandomNumberParameterResolver.class)
class RandomNumberTest {

    @Test
    void testWithRandomNumber(int randomNumber) {
        System.out.println("Random number: " + randomNumber);
        assertTrue(randomNumber >= 0 && randomNumber < 100);
    }
}
```


