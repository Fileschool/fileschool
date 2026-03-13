// Java upload example
// Add to build.gradle: implementation 'org.filestack:filestack-java:1.0.1'

import com.filestack.Client;
import com.filestack.Config;
import com.filestack.FileLink;

public class Main {
    private static final String API_KEY = "YOUR_API_KEY"; // Replace with your Filestack API key

    public static void main(String[] args) throws Exception {
        Config config = new Config(API_KEY);
        Client client = new Client(config);

        // Synchronous upload
        FileLink fileLink = client.upload("/path/to/file.jpg", false);
        System.out.println("Handle: " + fileLink.getHandle());
        System.out.println("URL: https://cdn.filestackcontent.com/" + fileLink.getHandle());

        // Async upload with RxJava
        client.uploadAsync("/path/to/file.jpg", false)
            .subscribe(
                fl -> System.out.println("Async done: " + fl.getHandle()),
                error -> System.err.println("Error: " + error)
            );
    }
}
