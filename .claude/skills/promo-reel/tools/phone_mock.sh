#!/usr/bin/env bash
# Style L composite: bg layer + masked, pre-scaled screen recording + fg phone layer -> 1080x1920 30fps 12 Mbps two-pass.
# usage: tools/phone_mock.sh <project_dir> <recording.mp4> <out.mp4> [handoff_seconds]
# handoff_seconds: props.intro.handoff when the browser-opening intro is used (the recording and its audio start that late).
# expects <project_dir>/out/bg.mov (PhoneMockReel layer 'bg', prores hq) and out/fg.mov (layer 'fg', prores 4444 alpha).
set -euo pipefail
P=$1; REC=$2; OUT=$3; D=${4:-0}; cd "$P"; DMS=$(python3 -c "print(int(round($D*1000)))")
# 1) recording -> exact screen size (downscale only), BT.601 phone matrix -> BT.709, CFR 30 by duplicating frames (no interpolation), lossless
ffmpeg -v error -y -i "$REC" -vf "fps=30,scale=696:1546:flags=lanczos+accurate_rnd+full_chroma_int:in_color_matrix=bt601:out_color_matrix=bt709:in_range=tv:out_range=tv,format=yuv444p" -c:v libx264 -qp 0 -preset veryfast -an out/screen.mkv
# 2) rounded-corner alpha mask for the screen (radius = phone r - bezel + 1)
python3 -I -c "
from PIL import Image, ImageDraw
W,H,R,K=696,1546,77,4
im=Image.new('L',(W*K,H*K),0); ImageDraw.Draw(im).rounded_rectangle([0,0,W*K-1,H*K-1],radius=R*K,fill=255)
im.resize((W,H),Image.LANCZOS).save('out/mask.png')"
# 3) composite; the y expression mirrors phoneOffset() in PhoneMock.tsx (time-based: n was one frame ahead)
FC="[0:v]scale=out_color_matrix=bt709:out_range=tv,format=yuv444p[bg];[1:v]setpts=PTS-STARTPTS,tpad=start_duration=$D:start_mode=clone,format=yuva444p[s0];[3:v]format=gray,loop=-1:1:0[m];[s0][m]alphamerge[sc];[2:v]scale=out_color_matrix=bt709:out_range=tv,format=yuva444p[fg];[bg][sc]overlay=x=192:y='187+1700*pow(1-min(1\,t*30/20)\,3)':eval=frame:format=yuv444:shortest=1[a];[a][fg]overlay=0:0:format=yuv444:shortest=1,format=yuv420p,fps=30[v]"
X='-c:v libx264 -preset slow -tune film -profile:v high -pix_fmt yuv420p -b:v 12M -maxrate 18M -bufsize 24M -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv'
ffmpeg -v error -y -i out/bg.mov -i out/screen.mkv -i out/fg.mov -i out/mask.png -filter_complex "$FC" -map '[v]' $X -pass 1 -passlogfile out/p -an -f mp4 /dev/null
if [ "$DMS" = "0" ]; then
  ffmpeg -v error -y -i out/bg.mov -i out/screen.mkv -i out/fg.mov -i out/mask.png -i "$REC" -filter_complex "$FC" -map '[v]' -map 4:a? $X -pass 2 -passlogfile out/p -c:a copy -shortest -movflags +faststart "$OUT"
else  # delayed audio has to be re-encoded (an edit-list offset is ignored by some apps)
  ffmpeg -v error -y -i out/bg.mov -i out/screen.mkv -i out/fg.mov -i out/mask.png -i "$REC" -filter_complex "$FC;[4:a]adelay=$DMS:all=1[au]" -map '[v]' -map '[au]' $X -pass 2 -passlogfile out/p -c:a aac -b:a 320k -shortest -movflags +faststart "$OUT"
fi
