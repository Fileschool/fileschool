# Android SDK (filestack-android)

**GitHub:** [filestack/filestack-android](https://github.com/filestack/filestack-android)
**Requires:** Android (Kotlin / Java)

Full-featured picker UI (`FsActivity`) supporting local files, camera, and 10+ cloud sources. Built on top of the Java SDK.

---

## Installation

Add to `app/build.gradle`:

```groovy
implementation 'com.filestack:filestack-android:6.0.0'
```

---

## Launch the Picker

> Full example: [`examples/android/MainActivity.java`](../examples/android/MainActivity.java)

### Step 1 — Create an intent and start `FsActivity`

```java
import com.filestack.android.FsActivity;
import com.filestack.android.FsConstants;
import com.filestack.Config;

public static final int REQUEST_FILESTACK = 100;

Intent intent = new Intent(this, FsActivity.class);

Config config = new Config("API_KEY", "RETURN_URL");
intent.putExtra(FsConstants.EXTRA_CONFIG, config);

startActivityForResult(intent, REQUEST_FILESTACK);
```

### Step 2 — Handle the result in `onActivityResult`

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
  super.onActivityResult(requestCode, resultCode, data);
  if (requestCode == REQUEST_FILESTACK && resultCode == RESULT_OK) {
    ArrayList<Selection> selections = data.getParcelableArrayListExtra(
      FsConstants.EXTRA_SELECTION_LIST);
    for (Selection s : selections) {
      Log.i("Filestack", "Selected: " + s.getName());
    }
  }
}
```

### Step 3 — Register a `BroadcastReceiver` for upload status

```java
public class UploadStatusReceiver extends BroadcastReceiver {
  @Override
  public void onReceive(Context context, Intent intent) {
    String status = intent.getStringExtra(FsConstants.EXTRA_STATUS);
    FileLink fileLink = (FileLink) intent.getSerializableExtra(
      FsConstants.EXTRA_FILE_LINK);
    if (fileLink != null) {
      Log.i("Filestack", status + ": " + fileLink.getHandle());
    }
  }
}

// Register in onCreate():
IntentFilter filter = new IntentFilter(FsConstants.BROADCAST_UPLOAD);
LocalBroadcastManager.getInstance(this)
  .registerReceiver(new UploadStatusReceiver(), filter);
```

---

## Back to main guide

[← README](../README.md)
