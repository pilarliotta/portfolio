Place optimized background video files here for the About page background.

Recommended files:
 - flux.webm   (preferred, modern browsers)
 - flux.mp4    (fallback for older browsers)

How to create optimized versions from a GIF (example using ffmpeg):

1) Create a high-quality MP4 (H.264):
   ffmpeg -i flux.GIF -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -crf 24 -b:v 1M assets/videos/flux.mp4

2) Create a WebM (VP9) for smaller size and better compression:
   ffmpeg -i flux.GIF -c:v libvpx-vp9 -b:v 0 -crf 32 -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" assets/videos/flux.webm

Notes:
 - Adjust CRF and bitrate to balance quality and size.
 - Consider resizing to a reasonable resolution for background (e.g., 1280x720) to keep file size manageable.
 - For best performance, keep the video short and loopable.
 - If you prefer not to use video, place the GIF at assets/images/flux.GIF.
