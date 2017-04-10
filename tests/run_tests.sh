#!/bin/bash

java -jar -Dwebdriver.gecko.driver=./tests/geckodriver_0_11.exe ./tests/selenium-server-standalone-3.0.1.jar &
SELENIUM_PID=$!

node tests/tr.js

kill $SELENIUM_PID
