# Vragen
Per vraag staat wat je moet inleveren. Plaats je bestanden in mappen `vraag-docker-compose`, `vraag-github-actions` en `vraag-traefik`.
Op het einde bundel je de drie mappen in één zipbestand.
**Zorg dat je naamgeving klopt.**

## Docker Compose

**Belangrijk:** test de onderdelen zo veel mogelijk tussendoor. Probeer niet meteen de volledige Docker Compose file te schrijven. Start met één Dockerfile en zet daar net genoeg in om te kijken of je goed bezig bent. Sla je werk regelmatig op en breng stap voor stap verbeteringen aan.

Je krijgt een eenvoudige applicatie geschreven in Python, met het framework Flask. 
Deze bestaat uit drie delen: een "receiver", een "sender" en een "message queue".
De sender stuurt regelmatig een bericht naar de message queue en de receiver kijkt regelmatig in de message queue of er al berichten zijn, zoals een postbus.

De code voor het eerste deel van de applicatie is "receiver".
Verpak deze in een Docker image (door er een Dockerfile voor te schrijven).
Start van een image die versie 3.12 van Python voorziet. Je zou zelf moeten weten waar je zo'n image vindt.
Het commando om Flask te installeren is `pip install flask` (vergelijkbaar met `npm install express`).
Om de message queue uit te lezen moet je ook het package `pika` installeren.
Flask gebruikt poort 5000 (zoals Express typisch poort 3000 gebruikt).
Het commando om een Flask applicatie uit te voeren is `flask run --host 0.0.0.0`.

De message queue zelf moet je runnen in een tweede Docker container.
Gebruik hiervoor de `rabbitmq:3-management` image.
Je kan controleren dat deze goed werkt via de web UI, die op poort 15672 runt, met default gebruikersnaam en wachtwoord allebei `guest`.
Zowel de sender als de receiver gebruiken "rabbitmq" alsof het een DNS entry is. Daar **moet** je rekening mee maken in het opstellen van je Docker Compose file.

Ten slotte is er een tweede Python script dat één keer per minuut een bericht in de message queue plaatst.
Dit is de "sender".
Ook daarvoor krijg je de broncode.
Deze heeft nog steeds Pika nodig, maar geen Flask.
De sender opstarten doe je gewoon met `python app.py`.

Stel de Docker Compose file op zodat de eerste Flask applicatie ontvangen berichten toont wanneer je naar `localhost:4321` surft.
Je hoeft **niets** aan te passen aan de Pythoncode.
Je moet alleen de juiste Dockerfiles en Docker Compose file schrijven en alle bestanden op de juiste plaats zetten.

## Github Actions
Hier is de code voor een simpele Hello World met Express:

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

Je hoeft deze niet aan te passen.
Schrijf een workflow die het aantal regels code in deze applicatie telt en doormailt.
Het aantal regels code tellen en opslaan in een tijdelijke file doe je in Bash met `wc -l helloworld.js > /tmp/linesofcode.txt`.
Zorg dan dat deze tijdelijke file als bijlage in een e-mail verstuurd wordt met [send-mailer](https://github.com/marketplace/actions/send-mailer).
Gebruik hiervoor niet je eigen e-mail, want de action is niet officieel en dus niet helemaal betrouwbaar.
Maak in plaats daarvan een tijdelijke account bij GMail van de vorm `examencloudsystemen_JOUWNAAM@gmail.com`.
**Doe dit zonder 2-factor authentication.**
Zelfs al is het een wegwerpaccount: je mag geen wachtwoorden opslaan in je repository zelf.

## Traefik
Neem de Express applicatie van de vorige vraag opnieuw als vertrekpunt.

Deploy deze (via een Docker Compose file) achter Traefik met volgende vereisten:

- Je zou de applicatie moeten kunnen bereiken via `/helloworld`, maar dat moet lukken **zonder** de Javascript code aan te passen.
- Zorg verder dat het enkel mogelijk is de site te bezoeken met een usernaam en wachtwoord `student` en `examen`.
- Zorg ten slotte dat alle antwoorden die terugkomen van de site gecomprimeerd zijn door een extra middleware.

**Tip:** deze drie vereisten staan los van elkaar. Als één niet lukt, bekijk dan de volgende.

Je kan de hash van een wachtwoord verkrijgen door een `httpd` container op te starten en daarin `htpasswd -nb student examen` te runnen. Als je deze output in een Docker Compose file gebruikt, moet je dollartekens (`$`) vervangen door dubbele dollartekens (`$$`) omdat die anders escapen. Je mag zelf kiezen in welke vorm je de statische en dynamische configuratie voorziet.
