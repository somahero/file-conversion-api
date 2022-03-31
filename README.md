# File Conversion API

A web service for converting audio/video files using FFMPEG.

## Based on

- https://github.com/surebert/docker-ffmpeg-service
- https://github.com/jrottenberg/ffmpeg 
- https://github.com/fluent-ffmpeg/node-fluent-ffmpeg

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`HOST_PORT`

`EXTERNAL_PORT`

`LOG_LEVEL` = info | debug | warn

`KEEP_ALL_FILES`

`FILE_SIZE_LIMIT_BYTES`  

`TIMEOUT`

## Installation

Install project with yarn

```bash
  yarn install
```

## Documentation

This application comes with a built in Swagger UI client. 
It is exposed at the following endpoint http://localhost:3000/api-docs.

This endpoint is normally not available in production system thus the application is configured to expose it only when the current active profile is dev. 

## Usage/Examples

Input file to FFMPEG API can be anything that ffmpeg supports. See https://www.ffmpeg.org/general.html#Supported-File-Formats_002c-Codecs-or-Features[ffmpeg docs for supported formats].

### Convert

Convert audio/video/image files using the API.

```bash
curl -F "file=@input.wav" 127.0.0.1:3000/convert/audio/to/mp3  > output.mp3
```

```bash
curl -F "file=@input.m4a" 127.0.0.1:3000/convert/audio/to/wav  > output.wav
```

```bash
curl -F "file=@input.mov" 127.0.0.1:3000/convert/video/to/mp4  > output.mp4
```

```bash
curl -F "file=@input.mp4" 127.0.0.1:3000/convert/videp/to/mp4  > output.mp4
```

```bash
curl -F "file=@input.tiff" 127.0.0.1:3000/convert/image/to/jpg  > output.jpg
```

```bash
curl -F "file=@input.png" 127.0.0.1:3000/convert/image/to/jpg  > output.jpg
```

### Extract images

Extract images from video using the API.

```bash
curl -F "file=@input.mov" 127.0.0.1:3000/video/extract/images
```

- Returns JSON that lists image download URLs for each extracted image.
- Default FPS is 1.
- Images are in PNG-format.

```bash
curl 127.0.0.1:3000/video/extract/download/ba0f565c-0001.png`
```

Downloads exracted image and deletes it from server.

```bash
curl 127.0.0.1:3000/video/extract/download/ba0f565c-0001.png?delete=no`
```

Downloads exracted image but does not deletes it from server.

```bash
curl -F "file=@input.mov" 127.0.0.1:3000/video/extract/images?compress=zip > images.zip`
```

- Returns ZIP package of all extracted images.

```bash
curl -F "file=@input.mov" 127.0.0.1:3000/video/extract/images?compress=gzip > images.tar.gz`
```

- Returns GZIP (tar.gz) package of all extracted images.
  
```bash
curl -F "file=@input.mov" 127.0.0.1:3000/video/extract/images?fps=0.5`
```

- Sets FPS to extract images. FPS=0.5 is every two seconds, FPS=4 is four images per seconds, etc.


### Extract audio

Extract audio track from video using the API.

```bash
curl -F "file=@input.mov" 127.0.0.1:3000/video/extract/audio`
```

- Returns 1-channel WAV-file of video's audio track.

```bash
curl -F "file=@input.mov" 127.0.0.1:3000/video/extract/audio?mono=no`
```

- Returns WAV-file of video's audio track, with all the channels as in input video.

### Probe

Probe audio/video/image files using the API.

```bash
curl -F "file=@input.mov" 127.0.0.1:3000/probe
```

- Returns JSON metadata of media file.
- The same JSON metadata as in ffprobe command: `ffprobe -of json -show_streams -show_format input.mov`.

## Badges

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
