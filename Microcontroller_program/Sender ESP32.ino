#include <SPI.h>
#include <LoRa.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <TinyGPSPlus.h>

// =========================
// DEVICE SETTINGS
// =========================
#define DEVICE_ID "DEV001"
#define OWNER_ID "OWNER001"

// =========================
// GPS
// =========================
#define GPS_RX 16
#define GPS_TX 17

HardwareSerial GPSSerial(2);
TinyGPSPlus gps;

// =========================
// OLED
// =========================
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#define OLED_SDA 21
#define OLED_SCL 22
#define OLED_ADDR 0x3C

Adafruit_SSD1306 display(
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    &Wire,
    -1);

// =========================
// BUTTONS
// =========================
#define BUTTON_SCROLL 32
#define BUTTON_SEND 33

// =========================
// SPEAKER
// =========================
#define AUDIO_PIN 25

// =========================
// LORA
// =========================
#define LORA_SCK 18
#define LORA_MISO 19
#define LORA_MOSI 23
#define LORA_SS 5
#define LORA_RST 14
#define LORA_DIO0 26

#define LORA_FREQUENCY 433E6

// =========================
// GPS SIMULATION
// =========================
// true = presentation/testing coordinates
// false = use actual NEO-6M GPS fix
#define SIMULATION_MODE true

#define SIM_LATITUDE 21.162451
#define SIM_LONGITUDE 81.658941

// =========================
// EMERGENCY TYPES
// =========================
const char *emergencyTypes[] = {
    "POLICE",
    "FIRE",
    "MEDICAL",
    "RESCUE",
    "ACCIDENT",
    "FLOOD",
    "OTHER"};

const int emergencyCount = 7;

int selectedEmergency = 0;
bool menuOpen = false;

// =========================
// HIGH ALERT SIREN
// =========================
bool sirenActive = false;
unsigned long sirenTimer = 0;
bool sirenState = false;

// =========================
// BUTTON DEBOUNCE
// =========================
unsigned long lastScrollPress = 0;
unsigned long lastSendPress = 0;

const unsigned long debounceTime = 250;

// ======================================================
// SETUP
// ======================================================

void setup()
{

    Serial.begin(115200);

    pinMode(BUTTON_SCROLL, INPUT_PULLUP);
    pinMode(BUTTON_SEND, INPUT_PULLUP);

    pinMode(AUDIO_PIN, OUTPUT);

    // -------------------------
    // OLED
    // -------------------------
    Wire.begin(OLED_SDA, OLED_SCL);

    if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR))
    {
        Serial.println("OLED ERROR");
    }

    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);

    showStartupScreen();

    // -------------------------
    // GPS
    // -------------------------
    GPSSerial.begin(
        9600,
        SERIAL_8N1,
        GPS_RX,
        GPS_TX);

    // -------------------------
    // LORA
    // -------------------------
    SPI.begin(
        LORA_SCK,
        LORA_MISO,
        LORA_MOSI,
        LORA_SS);

    LoRa.setPins(
        LORA_SS,
        LORA_RST,
        LORA_DIO0);

    if (!LoRa.begin(LORA_FREQUENCY))
    {

        Serial.println("LoRa initialization failed!");

        display.clearDisplay();
        display.setTextSize(1);
        display.setCursor(0, 20);
        display.println("LORA ERROR");
        display.display();

        while (true)
        {
            delay(1000);
        }
    }

    LoRa.setTxPower(17);
    LoRa.setSpreadingFactor(7);
    LoRa.setSignalBandwidth(125E3);
    LoRa.setCodingRate4(5);

    Serial.println();
    Serial.println("================================");
    Serial.println(" RESCUE SENDER ONLINE");
    Serial.println("================================");

    Serial.print("DEVICE: ");
    Serial.println(DEVICE_ID);

    Serial.print("OWNER: ");
    Serial.println(OWNER_ID);

    Serial.println("LoRa ready");

    delay(1000);

    showStartupScreen();

    // startup beep
    beep(900, 120);
}

// ======================================================
// LOOP
// ======================================================

void loop()
{

    readGPS();

    checkButtons();

    checkLoRa();

    updateSiren();

    delay(5);
}

// ======================================================
// STARTUP SCREEN
// ======================================================

void showStartupScreen()
{

    display.clearDisplay();

    display.setTextSize(1);

    display.setCursor(8, 5);
    display.println("EMERGENCY");

    display.setCursor(8, 17);
    display.println("RESPONSE SYSTEM");

    display.setCursor(8, 32);
    display.println("STATUS: ONLINE");

    display.setCursor(8, 44);

    display.print("OWNER: ");
    display.println(OWNER_ID);

    display.setCursor(8, 56);
    display.println("Press any button");

    display.display();
}

// ======================================================
// BUTTON HANDLING
// ======================================================

void checkButtons()
{

    bool scrollPressed =
        digitalRead(BUTTON_SCROLL) == LOW;

    bool sendPressed =
        digitalRead(BUTTON_SEND) == LOW;

    // --------------------------------
    // SCROLL BUTTON
    // --------------------------------
    if (
        scrollPressed &&
        millis() - lastScrollPress > debounceTime)
    {

        lastScrollPress = millis();

        beep(800, 70);

        // If siren active, scroll button stops it
        if (sirenActive)
        {

            stopSiren();

            showStartupScreen();

            delay(100);

            return;
        }

        menuOpen = true;

        selectedEmergency++;

        if (selectedEmergency >= emergencyCount)
        {
            selectedEmergency = 0;
        }

        showEmergencyMenu();
    }

    // --------------------------------
    // SEND BUTTON
    // --------------------------------
    if (
        sendPressed &&
        millis() - lastSendPress > debounceTime)
    {

        lastSendPress = millis();

        beep(1100, 100);

        // If siren active, acknowledge/stop
        if (sirenActive)
        {

            stopSiren();

            showStartupScreen();

            delay(100);

            return;
        }

        // First button press opens menu
        if (!menuOpen)
        {

            menuOpen = true;

            showEmergencyMenu();

            return;
        }

        sendEmergency();
    }
}

// ======================================================
// EMERGENCY MENU
// ======================================================

void showEmergencyMenu()
{

    display.clearDisplay();

    display.setTextSize(1);

    display.setCursor(0, 0);
    display.println("SELECT EMERGENCY");

    display.setCursor(0, 15);

    display.print("> ");
    display.println(
        emergencyTypes[selectedEmergency]);

    display.setCursor(0, 30);
    display.println("BTN32: NEXT");

    display.setCursor(0, 43);
    display.println("BTN33: SEND");

    display.setCursor(0, 56);

    display.print(
        String(selectedEmergency + 1));

    display.print("/");
    display.println(emergencyCount);

    display.display();
}

// ======================================================
// SEND EMERGENCY
// ======================================================

void sendEmergency()
{

    String packet;

    double latitude;
    double longitude;

    // -------------------------
    // GPS
    // -------------------------

    if (SIMULATION_MODE)
    {

        latitude = SIM_LATITUDE;
        longitude = SIM_LONGITUDE;
    }
    else
    {

        if (gps.location.isValid())
        {

            latitude = gps.location.lat();
            longitude = gps.location.lng();
        }
        else
        {

            latitude = 0;
            longitude = 0;
        }
    }

    // -------------------------
    // GPS STATUS
    // -------------------------

    String gpsStatus;

    if (SIMULATION_MODE)
    {
        gpsStatus = "SIMULATED";
    }
    else if (gps.location.isValid())
    {
        gpsStatus = "LIVE";
    }
    else
    {
        gpsStatus = "NOFIX";
    }

    // -------------------------
    // TIME
    // -------------------------

    String gpsTime = "";

    if (gps.time.isValid())
    {

        char timeBuffer[20];

        sprintf(
            timeBuffer,
            "%02d:%02d:%02d",
            gps.time.hour(),
            gps.time.minute(),
            gps.time.second());

        gpsTime = String(timeBuffer);
    }
    else
    {

        gpsTime = "N/A";
    }

    // -------------------------
    // CREATE PACKET
    // -------------------------

    packet =
        "TYPE=" +
        String(emergencyTypes[selectedEmergency]) +

        "|DEVICE=" +
        String(DEVICE_ID) +

        "|OWNER=" +
        String(OWNER_ID) +

        "|LAT=" +
        String(latitude, 6) +

        "|LON=" +
        String(longitude, 6) +

        "|TIME=" +
        gpsTime +

        "|GPS=" +
        gpsStatus;

    // -------------------------
    // SEND LORA
    // -------------------------

    LoRa.beginPacket();

    LoRa.print(packet);

    LoRa.endPacket();

    Serial.println();
    Serial.println("EMERGENCY SENT:");
    Serial.println(packet);

    // -------------------------
    // OLED
    // -------------------------

    display.clearDisplay();

    display.setTextSize(1);

    display.setCursor(0, 0);
    display.println("EMERGENCY SENT!");

    display.setCursor(0, 15);
    display.println(
        emergencyTypes[selectedEmergency]);

    display.setCursor(0, 30);

    display.print("LAT:");

    display.println(latitude, 4);

    display.setCursor(0, 43);

    display.print("LON:");

    display.println(longitude, 4);

    display.setCursor(0, 56);

    display.println("HELP REQUESTED");

    display.display();

    // send sound
    sendBeep();

    delay(2500);

    menuOpen = false;

    showStartupScreen();
}

// ======================================================
// LORA RECEIVE
// ======================================================

void checkLoRa()
{

    int packetSize = LoRa.parsePacket();

    if (!packetSize)
    {
        return;
    }

    String packet = "";

    while (LoRa.available())
    {

        packet +=
            (char)LoRa.read();
    }

    packet.trim();

    Serial.println();
    Serial.println("==============================");
    Serial.println("LORA MESSAGE RECEIVED");
    Serial.println(packet);
    Serial.print("RSSI: ");
    Serial.println(LoRa.packetRssi());
    Serial.print("SNR: ");
    Serial.println(LoRa.packetSnr());
    Serial.println("==============================");

    handleLoRaCommand(packet);
}

// ======================================================
// HANDLE RECEIVED COMMAND
// ======================================================

void handleLoRaCommand(String packet)
{

    // --------------------------------
    // NORMAL BROADCAST
    // --------------------------------

    if (
        packet.startsWith("CMD=BROADCAST"))
    {

        String message =
            getField(packet, "MESSAGE");

        if (message.length() == 0)
        {
            message = "HELLO";
        }

        showBroadcastMessage(message);

        broadcastBeep();

        return;
    }

    // --------------------------------
    // HIGH ALERT
    // --------------------------------

    if (
        packet.startsWith("CMD=HIGH_ALERT"))
    {

        String message =
            getField(packet, "MESSAGE");

        if (message.length() == 0)
        {
            message = "HIGH ALERT";
        }

        showHighAlert(message);

        startSiren();

        return;
    }

    // --------------------------------
    // STOP ALERT
    // --------------------------------

    if (
        packet.startsWith("CMD=STOP_ALERT"))
    {

        stopSiren();

        showStartupScreen();

        beep(500, 150);

        return;
    }

    // --------------------------------
    // RECEIVER TEST BUTTON
    // --------------------------------

    if (
        packet.indexOf(
            "RECEIVER_BUTTON_PRESSED") >= 0)
    {

        showTestMessage();

        receiveBeep();

        return;
    }

    // --------------------------------
    // GENERIC BROADCAST
    // --------------------------------

    if (
        packet.startsWith("BROADCAST="))
    {

        String message =
            packet.substring(10);

        showBroadcastMessage(message);

        broadcastBeep();

        return;
    }
}

// ======================================================
// EXTRACT PACKET FIELD
// ======================================================

String getField(
    String packet,
    String field)
{

    String key =
        field + "=";

    int start =
        packet.indexOf(key);

    if (start < 0)
    {
        return "";
    }

    start += key.length();

    int end =
        packet.indexOf("|", start);

    if (end < 0)
    {
        end = packet.length();
    }

    String result =
        packet.substring(start, end);

    result.trim();

    return result;
}

// ======================================================
// SHOW NORMAL BROADCAST
// ======================================================

void showBroadcastMessage(
    String message)
{

    display.clearDisplay();

    display.setTextSize(1);

    display.setCursor(0, 0);
    display.println("RESCUE STATION");

    display.setCursor(0, 12);
    display.println("BROADCAST");

    display.setCursor(0, 27);

    wrapText(message, 27);

    display.display();

    Serial.print("BROADCAST MESSAGE: ");
    Serial.println(message);

    delay(3000);

    if (!sirenActive)
    {
        showStartupScreen();
    }
}

// ======================================================
// HIGH ALERT SCREEN
// ======================================================

void showHighAlert(
    String message)
{

    display.clearDisplay();

    display.setTextSize(2);

    display.setCursor(5, 0);
    display.println("HIGH");

    display.setCursor(5, 19);
    display.println("ALERT");

    display.setTextSize(1);

    display.setCursor(0, 39);

    wrapText(message, 39);

    display.display();

    Serial.println("!!! HIGH ALERT !!!");
    Serial.println(message);
}

// ======================================================
// TEST SCREEN
// ======================================================

void showTestMessage()
{

    display.clearDisplay();

    display.setTextSize(1);

    display.setCursor(0, 0);
    display.println("RESCUE STATION");

    display.setCursor(0, 15);
    display.println("SYSTEM TEST");

    display.setCursor(0, 30);
    display.println("LINK: OK");

    display.setCursor(0, 45);
    display.println("LoRa RECEIVED");

    display.display();

    delay(2500);

    showStartupScreen();
}

// ======================================================
// TEXT WRAPPER
// ======================================================

void wrapText(
    String text,
    int startY)
{

    const int charsPerLine = 21;

    int y = startY;

    while (
        text.length() > 0 &&
        y < 64)
    {

        String line;

        if (
            text.length() <= charsPerLine)
        {

            line = text;

            text = "";
        }
        else
        {

            int breakPos =
                text.lastIndexOf(
                    " ",
                    charsPerLine);

            if (breakPos <= 0)
            {
                breakPos = charsPerLine;
            }

            line =
                text.substring(
                    0,
                    breakPos);

            text =
                text.substring(
                    breakPos);

            text.trim();
        }

        display.setCursor(0, y);
        display.println(line);

        y += 10;
    }
}

// ======================================================
// SIREN
// ======================================================

void startSiren()
{

    sirenActive = true;

    sirenTimer = millis();

    sirenState = false;

    Serial.println(
        "SIREN STARTED");
}

void stopSiren()
{

    sirenActive = false;

    noTone(AUDIO_PIN);

    Serial.println(
        "SIREN STOPPED");
}

void updateSiren()
{

    if (!sirenActive)
    {
        return;
    }

    if (
        millis() - sirenTimer >= 300)
    {

        sirenTimer = millis();

        sirenState = !sirenState;

        if (sirenState)
        {

            tone(
                AUDIO_PIN,
                1200);
        }
        else
        {

            tone(
                AUDIO_PIN,
                700);
        }
    }
}

// ======================================================
// BEEP FUNCTIONS
// ======================================================

void beep(
    int frequency,
    int duration)
{

    tone(
        AUDIO_PIN,
        frequency,
        duration);

    delay(duration + 20);
}

void sendBeep()
{

    beep(1000, 100);

    delay(80);

    beep(1400, 180);
}

void broadcastBeep()
{

    beep(900, 100);

    delay(80);

    beep(1200, 100);
}

void receiveBeep()
{

    beep(700, 150);

    delay(100);

    beep(1000, 150);
}

// ======================================================
// GPS
// ======================================================

void readGPS()
{

    while (
        GPSSerial.available())
    {

        gps.encode(
            GPSSerial.read());
    }
}