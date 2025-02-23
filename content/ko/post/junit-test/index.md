---
categories:
  - dev|개발
date: 2025-02-23T15:28:01+09:00
draft: false
tags:
  - junit
  - test
  - java
title: 테스트케이스 작성시 유용한 JUnit 어노테이션들
---

## 어노테이션
### `@Test`

메서드를 테스트 케이스로 표시합니다.

```java
@Test
public void shouldReturnTrue() {
    assertTrue(true);
}
```

---

### `@BeforeEach`

각 테스트 메서드 실행 전에 테스트 데이터나 상태를 설정합니다.

```java
@BeforeEach
public void setUp() {
    // 리소스 초기화
}
```

---

### `@AfterEach`

각 테스트 메서드 실행 후 리소스를 정리합니다.

```java
@AfterEach
public void tearDown() {
    // 리소스 정리
}
```

---

### `@BeforeAll`

모든 테스트 메서드 실행 전에 한 번만 실행됩니다. 메서드는 `static`이어야 합니다.

```java
@BeforeAll
public static void initAll() {
    // 공유 리소스 설정
}
```

---

### `@AfterAll`

모든 테스트 메서드 실행 후 한 번만 실행됩니다. 메서드는 `static`이어야 합니다.

```java
@AfterAll
public static void tearDownAll() {
    // 공유 리소스 정리
}
```

---

### `@Disabled`

테스트 클래스나 메서드가 실행되지 않도록 비활성화합니다.

```java
@Disabled("버그 수정으로 일시적으로 비활성화됨")
@Test
public void skippedTest() {
    // 이 테스트는 스킵됩니다
}
```

---

### `@Nested`

테스트 클래스를 내부 클래스 형태로 정의하여 더 나은 테스트 구조를 제공합니다.

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

테스트 클래스나 메서드에 더 나은 가독성을 위한 사용자 정의 이름을 제공합니다.

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

여러 번 실행되어야 하는 테스트 메서드를 표시하며, 다양한 매개변수와 함께 실행됩니다.

```java
@ParameterizedTest
@ValueSource(strings = {"apple", "banana", "cherry"})
void testWithStringValues(String fruit) {
    assertNotNull(fruit);
}
```

---

### `@ValueSource`

`@ParameterizedTest`에 간단한 값을 제공합니다.

```java
@ParameterizedTest
@ValueSource(ints = {1, 2, 3, 4})
void testWithIntValues(int number) {
    assertTrue(number > 0);
}
```

---

### `@CsvSource`

CSV 형식을 사용하여 `@ParameterizedTest`에 여러 세트의 인수를 제공합니다.

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

외부 파일에서 CSV 데이터를 로드하여 `@ParameterizedTest`에 제공합니다.

```java
@ParameterizedTest
@CsvFileSource(resources = "/data/fruits.csv", numLinesToSkip = 1)
void testWithCsvFileSource(String fruit, int quantity) {
    assertNotNull(fruit);
    assertTrue(quantity > 0);
}
```

_`fruits.csv`는 `src/test/resources/data/fruits.csv`에 위치한다고 가정합니다._

---

### `@MethodSource`

팩토리 메서드를 사용하여 `@ParameterizedTest`에 인수를 제공합니다.

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

복잡한 테스트 데이터를 위한 사용자 정의 인수 제공자를 사용합니다.

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

테스트 동작을 향상시키기 위한 사용자 정의 확장을 등록합니다 (예: 모킹, 라이프사이클 콜백).

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

_이 예제는 `MockitoExtension`을 사용하여 `@Mock` 및 `@InjectMocks`와 같은 Mockito 어노테이션을 활성화합니다._

---

### `@RegisterExtension`

더 동적인 시나리오를 위한 JUnit 5 확장을 프로그램적으로 등록합니다.

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

파일 기반 테스트를 위한 임시 디렉토리를 제공합니다. 테스트 후 디렉토리는 정리됩니다.

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

같은 테스트 메서드를 여러 번 실행합니다.

```java
@RepeatedTest(3)
void repeatedTest(RepetitionInfo repetitionInfo) {
    System.out.println("Repetition " + repetitionInfo.getCurrentRepetition());
}
```

---

### `@TestInstance`

테스트 인스턴스의 생명 주기를 제어합니다. 기본적으로 JUnit은 각 테스트 메서드에 대해 새로운 인스턴스를 생성합니다. `@TestInstance(Lifecycle.PER_CLASS)`를 사용하면 테스트 메서드 간에 상태를 공유할 수 있습니다.

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

테스트 메서드가 실행되는 순서를 정의합니다.

```java
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderedTests {

    @Test
    @Order(1)
    void firstTest() {
        System.out.println("첫 번째 테스트");
    }

    @Test
    @Order(2)
    void secondTest() {
        System.out.println("두 번째 테스트");
    }
}
```

---

### `@EnabledOnOs` / `@DisabledOnOs`

운영 체제에 따라 테스트를 실행하거나 스킵합니다.

```java
@EnabledOnOs(OS.WINDOWS)
@Test
void runsOnlyOnWindows() {
    assertTrue(System.getProperty("os.name").toLowerCase().contains("win"));
}

@DisabledOnOs(OS.LINUX)
@Test
void disabledOnLinux() {
    // 이 테스트는 리눅스에서 스킵됩니다
}
```

---

### `@EnabledOnJre` / `@DisabledOnJre`

Java 런타임 환경 버전에 따라 테스트를 실행하거나 스킵합니다.

```java
@EnabledOnJre(JRE.JAVA_17)
@Test
void runsOnlyOnJava17() {
    assertEquals("17", System.getProperty("java.version").substring(0, 2));
}

@DisabledOnJre(JRE.JAVA_8)
@Test
void disabledOnJava8() {
    // 이 테스트는 Java 8에서 실행되지 않습니다
}
```

---

### `@EnabledIf` / `@DisabledIf` (JUnit Pioneer에서 제공)

사용자 정의 조건에 따라 테스트를 실행하거나 스킵합니다.

```java
@EnabledIf(expression = "#{systemEnvironment['ENV'] == 'DEV'}", reason = "DEV 환경에서만 실행")
@Test
void runsOnlyInDev() {
    // 테스트 로직 여기
}
```

---

## 어설션
### `assertEquals`

두 값이 같은지 확인합니다.

```java
@Test
void testAssertEquals() {
    assertEquals(5, 2 + 3, "합은 5여야 합니다");
}
```

---

### `assertNotEquals`

두 값이 같지 않음을 검증합니다.

```java
@Test
void testAssertNotEquals() {
    assertNotEquals(10, 5 + 4, "값이 같지 않아야 합니다");
}
```

---

### `assertTrue` / `assertFalse`

조건이 `true` 또는 `false`인지 확인합니다.

```java
@Test
void testAssertTrue() {
    assertTrue(4 > 2, "4는 2보다 커야 합니다");
}

@Test
void testAssertFalse() {
    assertFalse(2 > 4, "2는 4보다 커서는 안 됩니다");
}
```

---

### `assertNull` / `assertNotNull`

객체가 `null`인지 아닌지 확인합니다.

```java
@Test
void testAssertNull() {
    String str = null;
    assertNull(str, "문자열은 null이어야 합니다");
}

@Test
void testAssertNotNull() {
    String str = "JUnit";
    assertNotNull(str, "문자열은 null이 아니어야 합니다");
}
```

---

### `assertThrows`

특정 예외가 메서드에서 발생하는지 확인합니다.

```java
@Test
void testAssertThrows() {
    assertThrows(IllegalArgumentException.class, () -> {
        throw new IllegalArgumentException("잘못된 입력");
    });
}
```

---

### `assertAll`

여러 어설션을 그룹화하여 함께 실행하고 모든 실패를 보고합니다.

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

두 배열이 같은지 확인합니다.

```java
@Test
void testAssertArrayEquals() {
    int[] expected = {1, 2, 3};
    int[] actual = {1, 2, 3};
    assertArrayEquals(expected, actual, "배열은 같아야 합니다");
}
```

---

### `fail`

테스트를 강제로 실패시키며, 특정 지점에 도달하지 않도록 할 때 유용합니다.

```java
@Test
void testFail() {
    fail("이 테스트는 무조건 실패합니다");
}
```

---

### `@EnabledIfEnvironmentVariable` / `@DisabledIfEnvironmentVariable`

환경 변수를 기준으로 테스트를 활성화하거나 비활성화합니다.

```java
@EnabledIfEnvironmentVariable(named = "ENV", matches = "STAGING")
@Test
void runsOnlyInStaging() {
    // ENV=STAGING일 경우에만 실행됩니다
}

@DisabledIfEnvironmentVariable(named = "ENV", matches = "PRODUCTION")
@Test
void disabledInProduction() {
    // 프로덕션 환경에서는 스킵됩니다
}
```

---

### `@EnabledIfSystemProperty` / `@DisabledIfSystemProperty`

JVM 시스템 속성에 따라 테스트를 활성화하거나 비활성화합니다.

```java
@EnabledIfSystemProperty(named = "os.arch", matches = ".*64.*")
@Test
void runsOn64BitArchitecture() {
    // 64비트 시스템에서만 실행됩니다
}

@DisabledIfSystemProperty(named = "user.country", matches = "US")
@Test
void disabledForUSUsers() {
    // 미국 사용자에게는 스킵됩니다
}
```

## Mockito 어설션

### `@Mock`

클래스나 인터페이스의 목 인스턴스를 생성합니다.

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Test
    void testMockCreation() {
        assertNotNull(userRepository); // 목이 생성되었는지 확인
    }
}
```

---

### `@InjectMocks`

목 의존성을 테스트 대상 객체에 주입합니다.

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

특정 메서드가 호출될 때의 목 동작을 정의합니다.

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

특정 메서드가 목에서 호출되었는지 검증합니다.

```java
@Test
void testVerify() {
    List<String> mockList = mock(List.class);
    mockList.add("JUnit");

    verify(mockList).add("JUnit"); // add() 메서드가 "JUnit"과 함께 호출되었는지 검증
}
```

---

### `verifyNoMoreInteractions`

목에서 다른 상호작용이 발생하지 않았음을 검증합니다.

```java
@Test
void testVerifyNoMoreInteractions() {
    List<String> mockList = mock(List.class);
    mockList.add("Test");

    verify(mockList).add("Test");
    verifyNoMoreInteractions(mockList); // 다른 메서드가 호출되지 않았는지 검증
}
```

---

### `doThrow`

메서드 호출 시 예외를 발생시키도록 동작을 지정합니다.

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

목 메서드에 전달된 인수를 캡처하여 추가적인 어설션을 수행합니다.

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

## 고급 JUnit 확장 기능

### `@ExtendWith`를 사용한 커스텀 확장

테스트 생명 주기에 훅을 추가할 수 있는 커스텀 JUnit 확장을 생성할 수 있습니다.

**예시: LoggingExtension**

```java
public class LoggingExtension implements BeforeEachCallback, AfterEachCallback {

    @Override
    public void beforeEach(ExtensionContext context) {
        System.out.println("테스트 시작: " + context.getDisplayName());
    }

    @Override
    public void afterEach(ExtensionContext context) {
        System.out.println("테스트 완료: " + context.getDisplayName());
    }
}
```

**테스트에서의 사용:**

```java
@ExtendWith(LoggingExtension.class)
class ExampleTest {

    @Test
    void sampleTest() {
        assertTrue(true);
    }
}
```

_이 코드는 각 테스트 전후로 메시지를 로그로 출력합니다._

---

### `@ExtendWith`를 사용한 파라미터 리졸버

테스트 메서드에 커스텀 파라미터를 주입할 수 있습니다.

**예시: 랜덤 숫자 제공자**

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

**테스트에서의 사용:**

```java
@ExtendWith(RandomNumberParameterResolver.class)
class RandomNumberTest {

    @Test
    void testWithRandomNumber(int randomNumber) {
        System.out.println("랜덤 숫자: " + randomNumber);
        assertTrue(randomNumber >= 0 && randomNumber < 100);
    }
}
```
