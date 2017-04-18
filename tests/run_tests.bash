#!/bin/bash

GECKODRIVER_PATH=""

if [ $OSTYPE == "linux-gnu" ]
  then
    GECKODRIVER_PATH="tests/geckodriver0_11_linux"
elif [ $OSTYPE == "msys" ]
  then
    GECKODRIVER_PATH="tests/geckodriver0_11.exe"
fi

if [ -z $GECKODRIVER_PATH ]
  then
    echo "Unsupported \$OSTYPE"
else
  java -jar -Dwebdriver.gecko.driver=$GECKODRIVER_PATH tests/selenium-server-standalone-3.0.1.jar &
  SELENIUM_PID=$!

  node tests/tr.js

  kill $SELENIUM_PID
fi
