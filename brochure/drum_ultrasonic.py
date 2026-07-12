import os
import sys
import time
import serial
import pygame

SERIAL_PORT = "COM11"  # change to your Arduino COM port
BAUD_RATE = 9600

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
pygame.mixer.pre_init(44100, -16, 2, 512)
pygame.init()
pygame.mixer.init()


def load_sound(name, filename):
    path = os.path.join(SCRIPT_DIR, filename)
    if not os.path.isfile(path):
        print(f"Warning: sound file '{filename}' not found. {name} drum disabled.")
        return None
    try:
        return pygame.mixer.Sound(path)
    except pygame.error as e:
        print(f"Error loading '{filename}': {e}")
        return None


def play_sound(zone):
    sound = sounds.get(zone)
    if sound is None:
        print(f"No sound loaded for zone '{zone}'.")
        return
    try:
        sound.play()
    except pygame.error as e:
        print(f"Error playing sound for zone '{zone}': {e}")


def sound_test():
    print("Audio test: playing each loaded sound.")
    for zone in ["close", "middle", "far"]:
        print(f"Testing zone: {zone}")
        play_sound(zone)
        time.sleep(0.5)
    print("Audio test complete.")


sounds = {
    "close": load_sound("close", "kick.wav"),
    "middle": load_sound("middle", "snare.wav"),
    "far": load_sound("far", "hihat.wav"),
}

# Remove any entries whose sound failed to load.
sounds = {zone: sound for zone, sound in sounds.items() if sound is not None}

if not sounds:
    print("Error: no audio sounds loaded. Add kick.wav, snare.wav, and hihat.wav to the script folder.")
    sys.exit(1)


def get_zone(distance):
    if distance <= 10:
        return "close"
    if distance <= 20:
        return "middle"
    if distance <= 40:
        return "far"
    return None


def main():
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)
    except serial.SerialException as e:
        print(f"Cannot open serial port: {e}")
        return

    last_zone = None

    print("Listening for distance data...")

    while True:
        line = ser.readline().decode("utf-8", errors="ignore").strip()
        if not line:
            continue

        try:
            distance = float(line)
        except ValueError:
            continue

        zone = get_zone(distance)
        if zone != last_zone:
            sound = sounds.get(zone)
            if sound is not None:
                sound.play()
                print(f"Distance: {distance:.1f} cm -> Playing {zone} drum")
            else:
                print(f"Distance: {distance:.1f} cm -> no drum or missing sound file")
            last_zone = zone

        time.sleep(0.05)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        sound_test()
    else:
        main()
