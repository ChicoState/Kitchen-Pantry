#!/bin/bash

# Start the emulator
adb connect host.docker.internal:5555
adb devices

# Start the app
npm run android
#cd android && ./gradlew installdebug --info
