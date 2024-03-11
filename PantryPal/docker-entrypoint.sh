#!/bin/bash

# Try to connect to the adb server on the host
adb connect host.docker.internal:5555

# Wait for the adb connection to be authorized
connected="false"
while [ "$connected" = "false" ]; do
    # if the user authenticated the connection, the device will show up in the list
    if adb devices | grep -E -q "host.docker.internal:5555[[:space:]]+device"; then
        echo "ADB connection authorized."
        connected="true"
    else
        echo "Waiting for ADB connection to be authorized..."
        sleep 5 # Wait for 5 seconds before checking again
    fi
done

# Now that the device is connected and authorized, start the app
npm run android