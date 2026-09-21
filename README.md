# 🚨 Rescue Command Center

A web-based rescue station dashboard for the **RESQ-LINK AI** disaster communication prototype.

## Overview

The system connects ESP32 + LoRa field devices with a rescue station dashboard.

```text
Field ESP32 → LoRa → Receiver ESP32 → USB Serial → Web Dashboard
Web Dashboard → USB Serial → Receiver ESP32 → LoRa → Field ESP32 devices
```

The LoRa communication does not depend on cellular internet connectivity.

## Features

- Emergency alert monitoring
- GPS location display on a map
- Device registration
- Emergency history
- Normal broadcast to all field devices
- 🚨 High Alert broadcast
- Siren activation on field devices
- Stop-all-sirens command
- Receiver-to-sender system test
- Web Serial communication at 115200 baud
- Leaflet/OpenStreetMap emergency map

## Emergency Types

The sender supports:

1. POLICE
2. FIRE
3. MEDICAL
4. RESCUE
5. ACCIDENT
6. FLOOD
7. OTHER

## Hardware

### Sender ESP32

| Component | Pin |
|---|---:|
| OLED SDA | GPIO 21 |
| OLED SCL | GPIO 22 |
| GPS TX | GPIO 16 |
| GPS RX | GPIO 17 |
| LoRa SCK | GPIO 18 |
| LoRa MISO | GPIO 19 |
| LoRa MOSI | GPIO 23 |
| LoRa NSS | GPIO 5 |
| LoRa RST | GPIO 14 |
| LoRa DIO0 | GPIO 26 |
| Scroll Button | GPIO 32 |
| Send Button | GPIO 33 |
| Speaker/PAM8403 input | GPIO 25 |

### Receiver ESP32

| Component | Pin |
|---|---:|
| LoRa SCK | GPIO 18 |
| LoRa MISO | GPIO 19 |
| LoRa MOSI | GPIO 23 |
| LoRa NSS | GPIO 5 |
| LoRa RST | GPIO 14 |
| LoRa DIO0 | GPIO 26 |
| Test Button | GPIO 22 |
| USB | Rescue station PC |

Receiver button:

```text
GPIO22 ---- Push Button ---- GND
```

The receiver uses `INPUT_PULLUP`.

## LoRa Configuration

Sender and receiver must use matching settings.

```cpp
#define LORA_FREQUENCY 433E6

LoRa.setTxPower(17);
LoRa.setSpreadingFactor(7);
LoRa.setSignalBandwidth(125E3);
LoRa.setCodingRate4(5);
```

Use a frequency/module configuration appropriate for your hardware and local radio regulations.

## Website Files

```text
index.html
style.css
app.js
README.md
```

Keep the three website files in the same folder.

Open `index.html` with Chrome or Edge desktop.

Web Serial requires a supported browser.

## Connecting the Receiver

1. Connect the receiver ESP32 to the computer.
2. Upload the receiver `.ino`.
3. Use 115200 baud.
4. Close Arduino Serial Monitor.
5. Open `index.html` in Chrome/Edge.
6. Click **Connect Receiver**.
7. Select the ESP32 COM port.

Only one application should use the COM port at a time.

## Normal Broadcast

Enter:

```text
HELLO
```

and click **Broadcast to All Devices**.

The website sends:

```text
BROADCAST=HELLO
```

The receiver converts it to:

```text
CMD=BROADCAST|MESSAGE=HELLO
```

and transmits it using LoRa.

The sender displays the message on its OLED and produces a short beep.

## High Alert

Enter a message such as:

```text
EVACUATE NOW - HIGH ALERT
```

and click:

**SEND HIGH ALERT TO ALL**

The website sends:

```text
HIGH_ALERT=EVACUATE NOW - HIGH ALERT
```

The receiver transmits:

```text
CMD=HIGH_ALERT|MESSAGE=EVACUATE NOW - HIGH ALERT
```

Every compatible sender within LoRa range:

- displays HIGH ALERT
- activates the siren
- continues the siren until stopped

## Stop All Sirens

The dashboard sends:

```text
STOP_ALERT=1
```

The receiver transmits:

```text
CMD=STOP_ALERT|MESSAGE=
```

All receiving senders stop their siren.

## Emergency Packet

A sender can transmit a packet such as:

```text
TYPE=FIRE|DEVICE=DEV001|OWNER=OWNER001|LAT=21.162451|LON=81.658941|TIME=12:30:45|GPS=SIMULATED
```

The dashboard reads:

- Emergency type
- Device ID
- Owner ID
- Latitude
- Longitude
- Time
- GPS status

and displays the emergency on the dashboard/map.

## GPS Modes

For prototype demonstration, the sender can use simulation mode:

```cpp
#define SIMULATION_MODE true
```

The configured demonstration coordinates are:

```text
Latitude:  21.162451
Longitude: 81.658941
```

For a real NEO-6M GPS fix:

```cpp
#define SIMULATION_MODE false
```

The system then uses the GPS coordinates received from the module.

Simulation coordinates should be clearly treated as demonstration data.

## Testing

### Test 1: Receiver Button

Press the receiver GPIO22 button.

The receiver sends:

```text
CMD=TEST|MESSAGE=RECEIVER_BUTTON_PRESSED
```

The sender should display a system-test message.

### Test 2: HELLO Broadcast

Dashboard:

```text
Broadcast → HELLO → Broadcast to All Devices
```

Sender should display:

```text
RESCUE STATION
BROADCAST
HELLO
```

### Test 3: High Alert

Dashboard:

```text
Broadcast → High Alert message → SEND HIGH ALERT TO ALL
```

All senders within radio range should activate their sirens.

### Test 4: Stop Sirens

Click:

```text
STOP ALL SIRENS
```

All receiving senders should stop their sirens.

## Troubleshooting

### Website looks like plain HTML

Make sure these files are together:

```text
index.html
style.css
app.js
```

Then reopen the new `index.html`.

The fixed version also contains fallback CSS inside `index.html`.

### Website cannot connect to ESP32

- Close Arduino Serial Monitor.
- Close other serial terminal programs.
- Reconnect the ESP32.
- Refresh the page.
- Click **Connect Receiver**.
- Select the correct COM port.
- Confirm receiver baud rate is 115200.

### Broadcast does not reach OLED

Check receiver Serial output for:

```text
USB COMMAND: BROADCAST=HELLO
```

and:

```text
LoRa transmission SUCCESS
```

Then check that sender and receiver have identical LoRa settings and are within radio range.

### High Alert does not activate

Check that the sender receives:

```text
CMD=HIGH_ALERT|MESSAGE=...
```

Also check the speaker/PAM8403 wiring and GPIO25.

### Map does not load

The dashboard uses Leaflet and OpenStreetMap resources, so map tiles normally require internet access. The LoRa emergency link itself does not require cellular internet.

## Project Structure

Recommended structure:

```text
RESQ-LINK-AI/
├── website/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── README.md
├── sender/
│   └── sender.ino
└── receiver/
    └── receiver.ino
```

## Technologies

- ESP32
- LoRa SX1278
- NEO-6M GPS
- SSD1306 OLED
- PAM8403 amplifier
- Arduino IDE
- HTML
- CSS
- JavaScript
- Web Serial API
- Leaflet
- OpenStreetMap

## Project Purpose

RESQ-LINK AI demonstrates an emergency communication architecture for disaster-response scenarios where conventional cellular communication may be unavailable.

This is a prototype for demonstration and further engineering. It is not a certified life-safety system and should not be used for real emergency operations without appropriate testing, radio compliance, hardware validation, redundancy, and operational approval.

---

**Project:** RESQ-LINK AI  
**System:** Rescue Command Center  
**Communication:** ESP32 + LoRa
