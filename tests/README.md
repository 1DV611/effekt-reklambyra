För att testerna ska kunna köras så behöver vi ha igång:
- En seleniumserver - Gå in i tests-mappen och kör `java -jar -Dwebdriver.gecko.driver=./geckoiver_0_11 selenium-server-standalone-3.0.1.jar`
- En X11-server - Om inte en riktig server finns tillgänglig så starta en med `Xvfb :0`

Testerna, som ligger i test.js, körs sedan med `node tr.js` i tests-mappen.
