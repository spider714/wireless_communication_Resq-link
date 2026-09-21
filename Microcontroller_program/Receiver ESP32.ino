#include <SPI.h>
#include <LoRa.h>

// ======================================
// LORA PINS
// ======================================

#define LORA_SCK 18
#define LORA_MISO 19
#define LORA_MOSI 23
#define LORA_SS 5
#define LORA_RST 14
#define LORA_DIO0 26

#define LORA_FREQUENCY 433E6

// ======================================
// RECEIVER BUTTON
// ======================================

#define RECEIVER_BUTTON 22

// ======================================
// SERIAL COMMAND BUFFER
// ======================================

String serialBuffer = "";

unsigned long lastButtonPress = 0;

const unsigned long debounceTime = 300;

// ======================================
// SETUP
// ======================================

void setup()
{

    Serial.begin(115200);

    pinMode(
        RECEIVER_BUTTON,
        INPUT_PULLUP);

    // ====================================
    // LORA
    // ====================================

    SPI.begin(
        LORA_SCK,
        LORA_MISO,
        LORA_MOSI,
        LORA_SS);

    LoRa.setPins(
        LORA_SS,
        LORA_RST,
        LORA_DIO0);

    Serial.println();
    Serial.println("==============================");
    Serial.println(" RESCUE LORA RECEIVER");
    Serial.println("==============================");

    if (!LoRa.begin(LORA_FREQUENCY))
    {

        Serial.println(
            "ERROR: LoRa initialization failed!");

        while (true)
        {
            delay(1000);
        }
    }

    LoRa.setTxPower(17);
    LoRa.setSpreadingFactor(7);
    LoRa.setSignalBandwidth(125E3);
    LoRa.setCodingRate4(5);

    Serial.println(
        "LoRa initialized successfully");

    Serial.println(
        "STATUS=ONLINE");

    Serial.println(
        "USB COMMANDS READY");

    Serial.println(
        "Use:");

    Serial.println(
        "BROADCAST=HELLO");

    Serial.println(
        "HIGH_ALERT=EVACUATE NOW");

    Serial.println(
        "STOP_ALERT=1");

    Serial.println();
}

// ======================================
// LOOP
// ======================================

void loop()
{

    readSerialCommands();

    receiveLoRa();

    checkReceiverButton();

    delay(5);
}

// ======================================
// READ USB SERIAL
// ======================================

void readSerialCommands()
{

    while (Serial.available())
    {

        char c =
            Serial.read();

        // Ignore CR
        if (c == '\r')
        {
            continue;
        }

        // End of command
        if (c == '\n')
        {

            serialBuffer.trim();

            if (serialBuffer.length() > 0)
            {

                processSerialCommand(
                    serialBuffer);
            }

            serialBuffer = "";
        }
        else
        {

            // Prevent unlimited buffer
            if (serialBuffer.length() < 250)
            {

                serialBuffer += c;
            }
        }
    }
}

// ======================================
// PROCESS WEBSITE COMMAND
// ======================================

void processSerialCommand(
    String command)
{

    command.trim();

    Serial.println();
    Serial.print(
        "USB COMMAND: ");

    Serial.println(command);

    // ====================================
    // NORMAL BROADCAST
    // ====================================

    if (
        command.startsWith(
            "BROADCAST="))
    {

        String message =
            command.substring(
                String("BROADCAST=").length());

        message.trim();

        if (message.length() == 0)
        {
            message = "HELLO";
        }

        sendBroadcast(
            message);

        return;
    }

    // ====================================
    // HIGH ALERT
    // ====================================

    if (
        command.startsWith(
            "HIGH_ALERT="))
    {

        String message =
            command.substring(
                String("HIGH_ALERT=").length());

        message.trim();

        if (message.length() == 0)
        {
            message = "HIGH ALERT - EVACUATE NOW";
        }

        sendHighAlert(
            message);

        return;
    }

    // ====================================
    // STOP ALERT
    // ====================================

    if (
        command.startsWith(
            "STOP_ALERT"))
    {

        sendStopAlert();

        return;
    }

    // ====================================
    // DIRECT CMD FORMAT
    // ====================================

    if (
        command.startsWith(
            "CMD="))
    {

        sendLoRaPacket(command);

        return;
    }

    Serial.println(
        "Unknown USB command");
}

// ======================================
// SEND NORMAL BROADCAST
// ======================================

void sendBroadcast(
    String message)
{

    String packet =
        "CMD=BROADCAST|MESSAGE=" +
        message;

    sendLoRaPacket(
        packet);
}

// ======================================
// SEND HIGH ALERT
// ======================================

void sendHighAlert(
    String message)
{

    String packet =
        "CMD=HIGH_ALERT|MESSAGE=" +
        message;

    sendLoRaPacket(
        packet);
}

// ======================================
// SEND STOP ALERT
// ======================================

void sendStopAlert()
{

    String packet =
        "CMD=STOP_ALERT|MESSAGE=";

    sendLoRaPacket(
        packet);
}

// ======================================
// SEND LORA PACKET
// ======================================

void sendLoRaPacket(
    String packet)
{

    Serial.println();
    Serial.println(
        "--------------------------------");

    Serial.println(
        "TRANSMITTING LoRa:");

    Serial.println(packet);

    LoRa.beginPacket();

    LoRa.print(packet);

    int result =
        LoRa.endPacket();

    if (result == 1)
    {

        Serial.println(
            "LoRa transmission SUCCESS");
    }
    else
    {

        Serial.println(
            "LoRa transmission FAILED");
    }

    Serial.println(
        "--------------------------------");

    delay(100);
}

// ======================================
// RECEIVE EMERGENCY FROM SENDERS
// ======================================

void receiveLoRa()
{

    int packetSize =
        LoRa.parsePacket();

    if (!packetSize)
    {
        return;
    }

    String packet = "";

    while (
        LoRa.available())
    {

        packet +=
            (char)LoRa.read();
    }

    packet.trim();

    Serial.println();
    Serial.println(
        "================================");

    Serial.println(
        "EMERGENCY PACKET RECEIVED");

    Serial.println(packet);

    Serial.print(
        "RSSI: ");

    Serial.println(
        LoRa.packetRssi());

    Serial.print(
        "SNR: ");

    Serial.println(
        LoRa.packetSnr());

    Serial.println(
        "================================");

    // Important:
    // Print the original TYPE= packet
    // so the website can parse it.
    Serial.println(packet);
}

// ======================================
// RECEIVER TEST BUTTON
// ======================================

void checkReceiverButton()
{

    bool pressed =
        digitalRead(
            RECEIVER_BUTTON) == LOW;

    if (
        pressed &&
        millis() - lastButtonPress >
            debounceTime)
    {

        lastButtonPress =
            millis();

        Serial.println();

        Serial.println(
            "RECEIVER BUTTON PRESSED");

        String packet =
            "CMD=TEST|MESSAGE=RECEIVER_BUTTON_PRESSED";

        sendLoRaPacket(
            packet);

        delay(100);
    }
}