import wave
import math
import struct

OUTPUT_DIR = r"d:\AstroSite\MakerlyAI\brochure"
SAMPLE_RATE = 44100

samples = {
    "kick.wav": {"type": "kick", "freq": 80, "duration": 0.45},
    "snare.wav": {"type": "snare", "freq": 200, "duration": 0.35},
    "hihat.wav": {"type": "hihat", "freq": 300, "duration": 0.3},
}

for filename, info in samples.items():
    path = f"{OUTPUT_DIR}\\{filename}"
    with wave.open(path, "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        count = int(SAMPLE_RATE * info["duration"])
        for i in range(count):
            t = i / SAMPLE_RATE
            envelope = (1 - t / info["duration"]) ** 2
            if info["type"] == "kick":
                pitch = info["freq"] * (1 - t / info["duration"] * 0.75)
                sample = math.sin(2 * math.pi * pitch * t) * envelope
            elif info["type"] == "snare":
                noise = (2 * (math.sin(2 * math.pi * 50 * t) + math.sin(2 * math.pi * 120 * t) + math.sin(2 * math.pi * 300 * t)) / 3)
                sample = (noise * 0.8 + math.sin(2 * math.pi * info["freq"] * t) * 0.2) * envelope
            else:
                noise = 2 * (math.sin(2 * math.pi * 4000 * t) + math.sin(2 * math.pi * 6000 * t)) / 2
                sample = noise * (1 - t / info["duration"]) * 0.9
            amplitude = int(max(-32767, min(32767, 32767 * sample)))
            wf.writeframes(struct.pack("<h", amplitude))

print("Created much louder drum samples: kick.wav, snare.wav, hihat.wav")
