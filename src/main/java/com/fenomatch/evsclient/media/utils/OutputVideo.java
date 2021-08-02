package com.fenomatch.evsclient.media.utils;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.TimeZone;

import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.PropertySource;

import com.fenomatch.evsclient.common.utils.Utils;
import com.fenomatch.evsclient.media.bean.EmbryoImage;
import com.fenomatch.evsclient.media.bean.VideoFrame;
import com.fenomatch.evsclient.media.bean.VideoImage;
import com.mpatric.mp3agic.Mp3File;

import io.humble.video.AudioChannel.Layout;
import io.humble.video.Codec;
import io.humble.video.Decoder;
import io.humble.video.Demuxer;
import io.humble.video.DemuxerStream;
import io.humble.video.Encoder;
import io.humble.video.MediaAudio;
import io.humble.video.MediaPacket;
import io.humble.video.MediaPicture;
import io.humble.video.Muxer;
import io.humble.video.MuxerFormat;
import io.humble.video.PixelFormat;
import io.humble.video.Rational;
import io.humble.video.awt.MediaPictureConverter;
import io.humble.video.awt.MediaPictureConverterFactory;

@PropertySource("classpath:application.properties")
public class OutputVideo extends OutputMediaBase {
    private static final Logger log = LoggerFactory.getLogger(OutputVideo.class);
//    public static final int AUDIO_FRAMES = 77;
//    public static final int AUDIO_SAMPLE_RATE = 44100;

    public DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("u/M/d H:m");

    private Integer seconds_first_image;
    private Integer seconds_last_image;
    private Double percentage_time_fade_first_image;
    private Double percentage_time_fade_last_image;

    private String outputName;

    public OutputVideo(String outputName, Integer sf, Integer sl, Double pff, Double pfl) {
        super();
        this.outputName = outputName;
        this.seconds_first_image = sf;
        this.seconds_last_image = sl;
        this.percentage_time_fade_first_image = pff;
        this.percentage_time_fade_last_image = pfl;
    }

    @Override
    public String generate(List<EmbryoImage> images, boolean hasText, Corner cor, boolean backgroundLogoColor,
            int frameRate, int height, int width, String extension, String audioPath, String text, String textPosition,
            String fontType, String fontColor, int fontSize, String logoPath, String imgStart, String imgEnd,
            boolean showTime) throws Exception {

        if (images.size() > 0) {
            log.info("Starting to generate video " + this.outputName + " ...");
            EmbryoImage embryoImageAux = images.get(0);
            BufferedImage firstImage = ImageIO.read(new File(embryoImageAux.getPath() + embryoImageAux.getFullName()));
            long t0 = System.currentTimeMillis();
            int framenumber = 0;
            MediaPacket packet = MediaPacket.make();
            Muxer muxer = Muxer.make(this.outputName, null, null);
            MuxerFormat format = muxer.getFormat();
            Codec codec = Codec.findEncodingCodec(format.getDefaultVideoCodecId());
            Rational framerate = Rational.make(1, frameRate);
            Encoder encoder = Encoder.make(codec);
            encoder.setTimeBase(framerate);
            encoder.setWidth(firstImage.getWidth());
            encoder.setHeight(firstImage.getHeight());
            final PixelFormat.Type pixelFormat = Utils.convertFormatToPixelFormat(format);
            encoder.setPixelFormat(pixelFormat);
            encoder.setTimeBase(framerate);
            Codec audioCodec = Codec.findEncodingCodec(Utils.convertFormatToAudioCodec(format));
            Encoder audioEncoder = Encoder.make(audioCodec);
//            
            if (format.getFlag(MuxerFormat.Flag.GLOBAL_HEADER)) {
                encoder.setFlag(Encoder.Flag.FLAG_GLOBAL_HEADER, true);
                audioEncoder.setFlag(Encoder.Flag.FLAG_GLOBAL_HEADER, true);
            }

            Mp3File mp3file = null;
            Rational framerateAudio = Rational.make(2, 0);
            encoder.open(null, null);
            if (audioPath != null) {
                mp3file = new Mp3File(audioPath);
                audioEncoder.setSampleRate(mp3file.getSampleRate());
                framerateAudio = Rational.make(2, mp3file.getBitrate());
                audioEncoder.setTimeBase(framerateAudio);
            } else {
                // This both is to avoid exceptions when open the channel
                audioEncoder.setSampleRate(44100);
                audioEncoder.setTimeBase(Rational.make(2, 77));
            }
            audioEncoder.setSampleFormat(Utils.convertFormatToAudioFormat(format));
            audioEncoder.setChannels(2);
            audioEncoder.setChannelLayout(Layout.CH_LAYOUT_STEREO);
            audioEncoder.open(null, null);
            muxer.addNewStream(encoder);
            muxer.addNewStream(audioEncoder);
            muxer.open(null, null);
            MediaPictureConverter converter = null;
            MediaPicture picture = MediaPicture.make(encoder.getWidth(), encoder.getHeight(), pixelFormat);
            picture.setTimeBase(framerate);

            String finalText = text;
            Font font = null;
            Color color = null;
            Image logo = null;
            if (hasText && text.length() > 35) {
                finalText = text.substring(0, 35);
            }
            if (hasText && fontType != null && !fontType.equals("")) {
                font = new Font(fontType, Font.PLAIN, fontSize);
            } else {
                font = new Font("Helvetica", Font.PLAIN, fontSize);
            }
            if (hasText && fontColor != null && !fontColor.equals("")) {
                color = Color.decode(fontColor);
            } else {
                color = Color.black;
            }
            if (logoPath != null && !logoPath.equals("")) {
                logo = getLogo(logoPath);
            }

            int[] coordsLogo = Utils.fromCornerToCoords("3-1", encoder, font, "");
//            String mainColor = ImageDominantColor.getHexColor(Utils.fromImageToBufferedImage(logo));
//            Color mainColorColor = Color.decode(mainColor);
//            Color backgroundColor = new Color(255- mainColorColor.getRed(),
//                  255-mainColorColor.getGreen(),
//                  255-mainColorColor.getBlue());

            List<VideoFrame> frames = VideoFrame.convertEmbryoImagesToVideoFrames(images);
            LocalDateTime datetime = LocalDateTime.ofInstant(Instant.ofEpochMilli(frames.get(0).getTime()),
                    TimeZone.getDefault().toZoneId());
            int[] coordsDatetime = Utils.fromCornerToCoords("3-3", encoder, font, datetime.format(DATE_FORMAT));

            // Image to start
            if (imgStart != null && !imgStart.equals("")) {
                List<VideoFrame> auxList = new ArrayList<VideoFrame>();
                int totalAmountFramesFadeout = (int)(framerate.getDenominator() * this.seconds_first_image * (this.percentage_time_fade_first_image / 100));
                double fadePerFrame = 0;
                if (totalAmountFramesFadeout > 0) {
                    fadePerFrame = (double) ((double)100 / (double)totalAmountFramesFadeout);
                }
                Double fadePercentage = null;
                int framesFirstImage = framerate.getDenominator() * this.seconds_first_image;
                int indexFrameFirstFadeOut = (framerate.getDenominator() * this.seconds_first_image) - totalAmountFramesFadeout; 

                // Fade out for first picture
                for (int i = 0; i < framesFirstImage; i++) {
                    fadePercentage = null;
                    if ( i > indexFrameFirstFadeOut ) {
                        fadePercentage = (i - indexFrameFirstFadeOut) * fadePerFrame;
                    }
                    auxList.add(new VideoFrame(new VideoImage(imgStart), fadePercentage));
                }
                
                int indexFrameFirstFadeIn = framesFirstImage * 2;
                // Fade in for next embryoimages
                for (int i = 0; i < totalAmountFramesFadeout; i++) {
                    embryoImageAux = frames.get(0).getEmbryoImage();
                    frames.remove(0);
                    fadePercentage = (totalAmountFramesFadeout - i) * fadePerFrame;
                    auxList.add(new VideoFrame(embryoImageAux, fadePercentage));
                }
                auxList.addAll(frames);
                frames = auxList;
            }

            
            // End image
            if (imgEnd != null && !imgEnd.equals("")) {
                List<VideoFrame> auxList = new ArrayList<VideoFrame>();
                int totalAmountFramesFadeout = (int)(framerate.getDenominator() * this.seconds_last_image * (this.percentage_time_fade_last_image / 100));
                double fadePerFrame = 0;
                if (totalAmountFramesFadeout > 0) {
                    fadePerFrame = (double) ((double)100 / (double)totalAmountFramesFadeout);
                }
                Double fadePercentage = null;
                int framesLastImage = framerate.getDenominator() * this.seconds_last_image;
                int indexFrameLastFadeOut = frames.size() - totalAmountFramesFadeout;

                for (int i = 0; i < frames.size(); i++) {
                    if (i < frames.size() - totalAmountFramesFadeout) { // Without fade
                        auxList.add(frames.get(i));
                    } else { // Fade out
                        fadePercentage = (i - indexFrameLastFadeOut) * fadePerFrame;
                        auxList.add(new VideoFrame(frames.get(i).getEmbryoImage(), fadePercentage));
                    }
                }
                frames = auxList;

                // Fade in for end image
                for (int i = 0; i < framerate.getDenominator() * this.seconds_last_image; i++) {
                    fadePercentage = null;
                    if ((i) < totalAmountFramesFadeout) {
                        fadePercentage = (totalAmountFramesFadeout - i) * fadePerFrame;
                    }
                    frames.add(new VideoFrame(new VideoImage(imgEnd), fadePercentage));
                }
            }
            
            for (VideoFrame frame : frames) {
                if (Utils.isImageValid(frame.getPath())) {
                    BufferedImage screen = ImageIO.read(new File(frame.getPath()));
                    BufferedImage convertedImg = new BufferedImage(encoder.getWidth(), encoder.getHeight(),
                            BufferedImage.TYPE_3BYTE_BGR);
                    convertedImg.getGraphics().drawImage(screen, 0, 0, null);
                    Graphics2D graphics = convertedImg.createGraphics(); // Create the text over the image
                    if (hasText && frame.isText()) {
                        graphics.setFont(font);
                        graphics.setColor(color);
                        int[] coords = Utils.fromCornerToCoords(textPosition, encoder, font, finalText);
                        if (coords != null && coords.length >= 2) {
                            graphics.drawString(finalText, coords[0], coords[1]);
                        }
                    }

                    if (showTime && frame.getTime() != null && frame.getTime() != -1) {
                        datetime = LocalDateTime.ofInstant(Instant.ofEpochMilli(frame.getTime()),
                                TimeZone.getDefault().toZoneId());
                        if (coordsDatetime != null && coordsDatetime.length >= 2) {
                            graphics.drawString(datetime.format(DATE_FORMAT), coordsDatetime[0], coordsDatetime[1]);
                        }
                    }

                    converter = MediaPictureConverterFactory.createConverter(convertedImg, picture);

                    if (logoPath != null && !logoPath.equals("")) {
                        if (frame.isLogo()) {
//                            if (backgroundColor != null) {
//                                BufferedImage buf = new BufferedImage(logo.getWidth(null) + 10, logo.getHeight(null) + 10, BufferedImage.TYPE_INT_BGR); //Little bigger than the logo
//                                for(int x = 0; x < buf.getWidth(); x++){ //Set all pixels with same color
//                                    for(int y = 0; y < buf.getHeight(); y++){
//                                        buf.setRGB(x, y, backgroundColor.getRGB());
//                                    }
//                                }
//                                graphics.drawImage(buf, coordsLogo[0], coordsLogo[1] - (logo.getHeight(null) / 2), null); //Little adjust in the coordinates
//                            }
                            graphics.drawImage(logo, coordsLogo[0], coordsLogo[1] - (logo.getHeight(null) / 2), null);
                        }
                    }

                    if (frame.getPercentajeFade() != null) {
                        //Corrections to alpha to avoid more than 1 and less than 0
                        if ((frame.getPercentajeFade().floatValue() / 100) > 1) {
                            frame.setPercentajeFade(100d);
                        } else if ((frame.getPercentajeFade().floatValue() / 100) < 0) {
                            frame.setPercentajeFade(0d);
                        }

                        graphics.setColor(new Color(0, 0, 0, frame.getPercentajeFade().floatValue() / 100));
                        graphics.fillRect(0, 0, firstImage.getWidth(), firstImage.getHeight());
                    }

                    converter.toPicture(picture, convertedImg, framenumber);
                    framenumber++;
                    do {
                        encoder.encode(packet, picture);
                        if (packet.isComplete()) {
                            muxer.write(packet, false);
                        }
                    } while (packet.isComplete());
                }
            }
            encodeMusic(audioPath, encoder, framerate, framerateAudio, audioEncoder, muxer, mp3file);

            do {
                encoder.encode(packet, null);
                if (packet.isComplete()) {
                    muxer.write(packet, false);
                }
            } while (packet.isComplete());

            muxer.close();
            muxer.delete();
            encoder.delete();
            audioEncoder.delete();
            codec.delete();
            audioCodec.delete();
            packet.delete();
            muxer = null;
            encoder = null;
            audioEncoder = null;
            codec = null;
            audioCodec = null;
            packet = null;

            format.delete();
            format = null;
            long t1 = System.currentTimeMillis();
            log.info("Video " + this.outputName + " finished:" + (t1 - t0) + " milisegundos");
            return this.outputName;
        }
        return null;
    }

    public void encodeMusic(String audioPath, Encoder encoder, Rational framerate, Rational framerateAudio,
            Encoder audioEncoder, Muxer muxer, Mp3File mp3File) throws Exception {
        if (audioPath != null) {
            Demuxer demuxer = Demuxer.make();
            String filename = audioPath;
            demuxer.open(filename, null, false, true, null, null);
            int numStreams = demuxer.getNumStreams();
            int framesInserted = 0;

            double totalVideoTime = encoder.getFrameCount() * framerate.getDouble(); // Total time of the video (only
                                                                                     // with pictures)
            double totalAudioTime = mp3File.getLengthInSeconds();
            double aux = totalVideoTime / framerateAudio.getDouble();
            double aux2 = framerate.getDouble() * 100;
            int amountAudioFramesToInsert = (int) (aux / aux2);
            for (int i = 0; i < numStreams; i++) {
                while (framesInserted < amountAudioFramesToInsert) {
                    try {
                        demuxer.close();
                        demuxer.delete();
                    } catch (Exception e) {
                        log.error("OutputVideo::encodeMusic - Error introducing music in the video:" + e.getMessage());
                        demuxer.close();
                        demuxer.delete();
                    }
                    demuxer = Demuxer.make();
                    demuxer.open(filename, null, false, true, null, null); // If not opened here, will cause an
                                                                           // exception
                    framesInserted += insertStreamAudioFrames(demuxer, filename, i, amountAudioFramesToInsert,
                            audioEncoder, framerateAudio, muxer);
                }
            }
            demuxer.close();
        }
    }

    public int insertStreamAudioFrames(Demuxer demuxer, String filename, int streamId, int amountFrameLimit,
            Encoder audioEncoder, Rational framerateAudio, Muxer muxer) throws InterruptedException, IOException {
        var demuxerObject = Demuxer.make();
        demuxerObject.open(filename, null, false, true, null, null);
        DemuxerStream stream = demuxerObject.getStream(streamId);
        Decoder decoder = stream.getDecoder();
        Encoder aa = audioEncoder.copyReference();
        if (Utils.isAudioCodec(decoder.getCodec())) {
            String name = decoder.getCodec().getName();
            MuxerFormat muxerFormat = MuxerFormat.guessFormat(null, filename, "audio/" + name);
            if (muxerFormat.getFlag(MuxerFormat.Flag.GLOBAL_HEADER)) {
                decoder.setFlag(Decoder.Flag.FLAG_GLOBAL_HEADER, true);
            }
            decoder.open(null, null);
            MediaAudio samples = MediaAudio.make(decoder.getFrameSize(), decoder.getSampleRate(), decoder.getChannels(),
                    decoder.getChannelLayout(), decoder.getSampleFormat());
            samples.setTimeBase(framerateAudio);

            MediaPacket packet = MediaPacket.make(1);
            while (demuxerObject.read(packet) >= 0 && (audioEncoder.getFrameCount()) <= amountFrameLimit) {
                if (packet.getStreamIndex() == streamId) {
                    int offset = 0;
                    int bytesRead = 0;
                    do {
                        bytesRead += decoder.decodeAudio(samples, packet, offset); // Read the song file
                        if (samples.isComplete()) {
                            aa.encode(packet, samples);
                            if (packet.isComplete()) {
                                muxer.write(packet, true); // Add the music to the video
                            }
                        }
                        offset += bytesRead;
                    } while (offset < packet.getSize());
                }
            }
            aa.delete();
            aa = null;
            muxerFormat.delete();
            muxerFormat = null;
            samples.delete();
            samples = null;
            packet.delete();
            packet = null;
            demuxerObject.close();
        }
        decoder.delete();
        decoder = null;

        return audioEncoder.getFrameCount();
    }

    public String getOutputName() {
        return outputName;
    }

    public void setOutputName(String outputName) {
        this.outputName = outputName;
    }

    private Image getLogo(String logoPath) throws IOException {
        BufferedImage logo = ImageIO.read(new File(logoPath));
        int width = logo.getWidth();
        float ratio = (float) width / 150f;
        int height = (int) (logo.getHeight() / ratio);
        return logo.getScaledInstance(150, height, Image.SCALE_SMOOTH);
    }

    public Integer getSeconds_first_image() {
        return seconds_first_image;
    }

    public void setSeconds_first_image(Integer seconds_first_image) {
        this.seconds_first_image = seconds_first_image;
    }

    public Integer getSeconds_last_image() {
        return seconds_last_image;
    }

    public void setSeconds_last_image(Integer seconds_last_image) {
        this.seconds_last_image = seconds_last_image;
    }

    public Double getPercentage_time_fade_first_image() {
        return percentage_time_fade_first_image;
    }

    public void setPercentage_time_fade_first_image(Double percentage_time_fade_first_image) {
        this.percentage_time_fade_first_image = percentage_time_fade_first_image;
    }

    public Double getPercentage_time_fade_last_image() {
        return percentage_time_fade_last_image;
    }

    public void setPercentage_time_fade_last_image(Double percentage_time_fade_last_image) {
        this.percentage_time_fade_last_image = percentage_time_fade_last_image;
    }

}
