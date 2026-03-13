// Android upload example
// Add to app/build.gradle: implementation 'com.filestack:filestack-android:6.0.0'

package com.example.filestackdemo;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.filestack.Config;
import com.filestack.FileLink;
import com.filestack.android.FsActivity;
import com.filestack.android.FsConstants;
import com.filestack.android.Selection;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private static final String API_KEY = "YOUR_API_KEY"; // Replace with your Filestack API key
    private static final String RETURN_URL = "YOUR_APP_RETURN_URL"; // e.g. "myapp://filestack"
    private static final int REQUEST_FILESTACK = 100;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Register upload status receiver
        IntentFilter filter = new IntentFilter(FsConstants.BROADCAST_UPLOAD);
        LocalBroadcastManager.getInstance(this)
            .registerReceiver(new UploadStatusReceiver(), filter);

        // Launch the picker on button click (wire this up in your layout)
        findViewById(R.id.btnUpload).setOnClickListener(v -> launchPicker());
    }

    private void launchPicker() {
        Intent intent = new Intent(this, FsActivity.class);
        Config config = new Config(API_KEY, RETURN_URL);
        intent.putExtra(FsConstants.EXTRA_CONFIG, config);
        startActivityForResult(intent, REQUEST_FILESTACK);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_FILESTACK && resultCode == RESULT_OK) {
            ArrayList<Selection> selections = data.getParcelableArrayListExtra(
                FsConstants.EXTRA_SELECTION_LIST);
            if (selections != null) {
                for (Selection s : selections) {
                    Log.i("Filestack", "Selected: " + s.getName());
                }
            }
        }
    }

    // BroadcastReceiver for upload completion events
    public static class UploadStatusReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String status = intent.getStringExtra(FsConstants.EXTRA_STATUS);
            FileLink fileLink = (FileLink) intent.getSerializableExtra(FsConstants.EXTRA_FILE_LINK);
            if (fileLink != null) {
                Log.i("Filestack", status + ": " + fileLink.getHandle());
            }
        }
    }
}
