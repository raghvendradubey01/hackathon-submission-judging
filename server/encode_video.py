import wave
import math
import struct
import subprocess
import os

print("Synthesizing audio soundtrack using Python wave module...")
sample_rate = 44100
duration = 35.0  # 7 slides * 5.0s
num_samples = int(sample_rate * duration)

audio_path = "/tmp/soundtrack.wav"
with wave.open(audio_path, "w") as wav_file:
    wav_file.setnchannels(2)  # Stereo
    wav_file.setsampwidth(2)  # 16-bit
    wav_file.setframerate(sample_rate)

    frames = bytearray()
    for i in range(num_samples):
        t = i / sample_rate

        # Ambient drone pad
        drone = (
            0.15 * math.sin(2 * math.pi * 130.81 * t) +   # C3
            0.12 * math.sin(2 * math.pi * 196.00 * t) +   # G3
            0.10 * math.sin(2 * math.pi * 261.63 * t)     # C4
        )

        # Slide transition chime (fires at every 5s boundary)
        time_in_slide = t % 5.0
        chime = 0.0
        if time_in_slide < 1.5:
            decay = math.exp(-3.5 * time_in_slide)
            # Arpeggiated notes
            chime += 0.18 * math.sin(2 * math.pi * 523.25 * time_in_slide) * decay
            if time_in_slide > 0.08:
                chime += 0.16 * math.sin(2 * math.pi * 659.25 * (time_in_slide - 0.08)) * math.exp(-3.5 * (time_in_slide - 0.08))
            if time_in_slide > 0.16:
                chime += 0.15 * math.sin(2 * math.pi * 783.99 * (time_in_slide - 0.16)) * math.exp(-3.5 * (time_in_slide - 0.16))
            if time_in_slide > 0.24:
                chime += 0.18 * math.sin(2 * math.pi * 1046.50 * (time_in_slide - 0.24)) * math.exp(-3.5 * (time_in_slide - 0.24))

        # Overall mix
        sample = drone * 0.4 + chime * 0.6

        # Master fade out during the last 2 seconds
        if t > 33.0:
            sample *= (35.0 - t) / 2.0

        # Clipping protection
        sample = max(-0.95, min(0.95, sample))
        int_sample = int(sample * 32767.0)

        # Stereo pack (left, right)
        frames.extend(struct.pack("<hh", int_sample, int_sample))

        # Write in chunks to prevent memory spikes
        if len(frames) >= 44100 * 4:
            wav_file.writeframes(frames)
            frames.clear()

    if frames:
        wav_file.writeframes(frames)

print(f"Generated soundtrack at {audio_path}, size: {os.path.getsize(audio_path)} bytes")

print("Preparing slide timeline...")
concat_path = "/tmp/slides_concat.txt"
with open(concat_path, "w") as f:
    for i in range(1, 8):
        f.write(f"file '/tmp/hackforge_slides/slide{i}.png'\n")
        f.write("duration 5.0\n")
    # Last file specified once at the end without duration for ffmpeg concat demuxer
    f.write("file '/tmp/hackforge_slides/slide7.png'\n")

print("Rendering H.264 MP4 video...")
mp4_cmd = [
    "ffmpeg", "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_path,
    "-i", audio_path,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-r", "30",
    "-preset", "fast",
    "-crf", "22",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    "-movflags", "+faststart",
    "public/hackforge-demo.mp4"
]
subprocess.run(mp4_cmd, check=True)

print("Rendering WebM video...")
webm_cmd = [
    "ffmpeg", "-y",
    "-i", "public/hackforge-demo.mp4",
    "-c:v", "libvpx-vp9",
    "-b:v", "1500k",
    "-crf", "30",
    "-c:a", "libopus",
    "-b:a", "128k",
    "public/hackforge-demo.webm"
]
subprocess.run(webm_cmd, check=True)

print("Creating copies & aliases...")
subprocess.run(["cp", "public/hackforge-demo.mp4", "public/hackforge-demo-30s.mp4"], check=True)
subprocess.run(["cp", "public/hackforge-demo.mp4", "public/demo.mp4"], check=True)
subprocess.run(["cp", "public/hackforge-demo.webm", "public/demo.webm"], check=True)

print("Done! Verifying generated files:")
subprocess.run("ls -lh public/*.mp4 public/*.webm", shell=True)
