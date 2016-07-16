#!/bin/bash
echo -e "\e[4m\e[1m\e[5m\e[96mDownloading required libraries...\e[0m"
cd lib

# JQuery
echo -e "\e[93m\e[1mGetting JQuery...\e[0m"
wget "https://code.jquery.com/jquery-3.0.0.min.js" -O "jquery-3.0.0.min.js"

# TweenJS
echo -e "\e[93m\e[1mGetting tween.js...\e[0m"
wget "https://raw.githubusercontent.com/tweenjs/tween.js/master/src/Tween.js" -O "Tween.js"

# FeatherLight
echo -e "\e[93m\e[1mGetting FeatherLight...\e[0m"
wget "https://raw.githubusercontent.com/noelboss/featherlight/master/release/featherlight.min.css" -O "featherlight.min.css"
wget "https://raw.githubusercontent.com/noelboss/featherlight/master/release/featherlight.min.js" -O "featherlight.min.js"

# Roboto
echo -e "\e[93m\e[1mGetting Roboto...\e[0m"
mkdir -p fonts
pushd fonts
wget "https://github.com/google/roboto/raw/master/hinted/Roboto-Bold.ttf" -O "Roboto-Bold.ttf"
wget "https://github.com/google/roboto/raw/master/hinted/Roboto-BoldItalic.ttf" -O "Roboto-BoldItalic.ttf"
wget "https://github.com/google/roboto/raw/master/hinted/Roboto-Italic.ttf" -O "Roboto-Italic.ttf"
wget "https://github.com/google/roboto/raw/master/hinted/Roboto-Regular.ttf" -O "Roboto-Regular.ttf"
popd

# FileSaver
echo -e "\e[93m\e[1mGetting FileSaver...\e[0m"
wget "https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.min.js" -O "FileSaver.min.js"

echo -e "\e[92m\e[1mAll required libraries downloaded!\e[0m"