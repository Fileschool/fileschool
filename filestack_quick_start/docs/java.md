# Java SDK (filestack-java)

**GitHub:** [filestack/filestack-java](https://github.com/filestack/filestack-java)
**Requires:** Java 8+

Upload, transformation, cloud, and file management APIs. Also the underlying engine for the Android SDK.

---

## Installation

**Gradle (`build.gradle`):**

```groovy
implementation 'org.filestack:filestack-java:1.0.1'
```

**Maven (`pom.xml`):**

```xml
<dependency>
  <groupId>org.filestack</groupId>
  <artifactId>filestack-java</artifactId>
  <version>1.0.1</version>
</dependency>
```

---

## Upload a File

> Full example: [`examples/java/Main.java`](../examples/java/Main.java)

```java
import com.filestack.Client;
import com.filestack.Config;
import com.filestack.FileLink;

public class Main {
  public static void main(String[] args) throws Exception {
    Config config = new Config("YOUR_API_KEY");
    Client client = new Client(config);

    FileLink fileLink = client.upload("/path/to/file.jpg", false);
    System.out.println("Handle: " + fileLink.getHandle());
    System.out.println("URL: https://cdn.filestackcontent.com/" + fileLink.getHandle());
  }
}
```

---

## Async Upload with RxJava

```java
client.uploadAsync("/path/to/file.jpg", false)
  .subscribe(
    fileLink -> System.out.println("Done: " + fileLink.getHandle()),
    error -> System.err.println("Error: " + error)
  );
```

---

## Back to main guide

[← README](../README.md)
