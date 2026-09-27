import subprocess
import os

font_bold = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
font_reg = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

def run(cmd):
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if p.returncode != 0:
        print("Error:", p.stderr)
    return p.returncode == 0

# Test creating slide 1
cmd = f"""convert -size 1920x1080 xc:"#090d16" \\
  -fill "#1e293b" -stroke "#334155" -strokewidth 2 -draw "roundrectangle 80,60,1840,1020,16,16" \\
  -fill "#0f172a" -stroke "#1e293b" -strokewidth 1 -draw "rectangle 80,60,1840,130" \\
  -fill "#ef4444" -stroke none -draw "circle 120,95,126,95" \\
  -fill "#f59e0b" -stroke none -draw "circle 145,95,151,95" \\
  -fill "#10b981" -stroke none -draw "circle 170,95,176,95" \\
  -font {font_bold} -pointsize 20 -fill "#ffffff" -stroke none -draw "text 210,102 'HACKFORGE // Enterprise Hackathon Platform'" \\
  -font {font_bold} -pointsize 14 -fill "#10b981" -draw "text 1600,102 'v1.4.0 · HERMETIC OFFLINE'" \\
  -fill "#0284c7" -stroke none -draw "roundrectangle 140,180,320,215,6,6" \\
  -font {font_bold} -pointsize 13 -fill "#ffffff" -draw "text 155,202 'PLATFORM OVERVIEW'" \\
  -font {font_bold} -pointsize 44 -fill "#ffffff" -draw "text 140,280 'Self-Hostable Hackathon Lifecycle Engine'" \\
  -font {font_reg} -pointsize 22 -fill "#94a3b8" -draw "text 140,325 'From participant team formation and VCS linking to blind judging and normalized leaderboards.'" \\
  /tmp/slide1_test.png
"""

success = run(cmd)
print("Slide 1 success:", success)
if success and os.path.exists("/tmp/slide1_test.png"):
    print("File size:", os.path.getsize("/tmp/slide1_test.png"))
