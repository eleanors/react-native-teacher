#!/usr/bin/env bash
react-native bundle --entry-file index.js --platform android --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./build_test/ --dev true