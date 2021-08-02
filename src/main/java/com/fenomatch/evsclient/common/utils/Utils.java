package com.fenomatch.evsclient.common.utils;

import java.awt.image.BufferedImage;
import java.awt.image.BufferedImageOp;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;

import io.humble.video.AudioFormat;
import io.humble.video.Codec;
import io.humble.video.Encoder;
import io.humble.video.MediaDescriptor;
import io.humble.video.MuxerFormat;
import io.humble.video.PixelFormat;

import java.util.Base64.Decoder;
import java.util.Optional;

import javax.imageio.ImageIO;

import com.fenomatch.evsclient.media.utils.Scalr;

public class Utils {

    public static List <String> findPicturesFromFolder (String folder) {
        List <String> result = new ArrayList <String>();
        File fileFolder = new File (folder); 
        if (fileFolder.isDirectory()) {
            String[] files = fileFolder.list();
            for (String f : files) {
                String extension = Utils.calculateExtension(f);
                if (extension.equals("jpg") 
                        || extension.equals("jpeg")
                        || extension.equals("gif")
                        || extension.equals("png"))
                result.add(folder + "/" + f);
            }
        }
        Collections.sort(result);
        return result;
    }
    
    public static Decoder getDecoder (String type) {
        Decoder result = null;
        if (type != null) {
            switch (type.toLowerCase()) {
            case "audio/mpeg":
                result = Base64.getMimeDecoder();
                break;
            case "image/png":
                result = Base64.getMimeDecoder();
                break;
            case "image/jpeg":
                result = Base64.getDecoder();
                break;
            case "image/gif":
                result = Base64.getMimeDecoder();
                break;
            }
        }
        return result;
    }
    
    public static PixelFormat.Type convertFormatToPixelFormat (MuxerFormat muxerFormat) {
        PixelFormat.Type result = null;
        switch (muxerFormat.getName().toLowerCase()) {
        case "avi":
            result = PixelFormat.Type.PIX_FMT_YUV420P;
            break;
        case "mov":
            result = PixelFormat.Type.PIX_FMT_YUV444P;
            break;
        case "mp4":
            result = PixelFormat.Type.PIX_FMT_YUV444P;
            break;
        }
        return result;
    }
    
    public static Codec.ID convertFormatToAudioCodec (MuxerFormat muxerFormat) {
        Codec.ID result = null;
        switch (muxerFormat.getName().toLowerCase()) {
        case "avi":
            result = Codec.ID.CODEC_ID_MP3;
            break;
        case "mov":
            result = Codec.ID.CODEC_ID_MP3;
            break;
        case "mp4":
            result = Codec.ID.CODEC_ID_MP3; //ACC works, but doesn't accept any AudioFormat (S16)
            break;
        }
        return result;
    }
    
    public static AudioFormat.Type convertFormatToAudioFormat (MuxerFormat muxerFormat) {
        AudioFormat.Type result = null;
        switch (muxerFormat.getName().toLowerCase()) {
        case "avi":
            result = AudioFormat.Type.SAMPLE_FMT_S16P;
            break;
        case "mov":
            result = AudioFormat.Type.SAMPLE_FMT_S16P;
            break;
        case "mp4":
            result = AudioFormat.Type.SAMPLE_FMT_S16P;
            break;
        }
        return result;
    }
    
    public static boolean isImageValid(String filename) {
        if (filename != null && !filename.equals("")) {
        File f = new File (filename);
        return (f.exists() && 
            (filename.toLowerCase().endsWith(".jpg") 
                || filename.toLowerCase().endsWith(".png") 
                || filename.toLowerCase().endsWith(".gif")
                || filename.toLowerCase().endsWith(".jpeg") )
            );
        }
        return false;
    }
    
    public static boolean isAudioCodec (Codec c) {
        return c.getType().equals(MediaDescriptor.Type.MEDIA_AUDIO);
    }
    
    public static String saveFile (String data, String format, String name, String type) throws Exception {
        String result = null;
        if (data != null && format != null && type != null) {
            String path = "/tmp/" + name + "." + format;
            File file = new File(path);
            Decoder decoder = getDecoder(type);
            
            if (type.contains("audio")) {
                try (FileOutputStream os = new FileOutputStream(file, true);) {
                    if (decoder != null) {
                        os.write(decoder.decode(data));
                    } else {
                        os.write(data.getBytes());
                    }
                    os.flush();
                    os.close();
                    result = path;
                }
            } else if (type.contains("image")) {
                byte[] imageByte = null;
                if (decoder != null) {
                    imageByte = decoder.decode(data);
                }
                ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
                BufferedImage image = ImageIO.read(bis);
                bis.close();
                File outputfile = new File(path);
                ImageIO.write(image, format, outputfile);
                result = path;
            }
        }
        return result;
    }
    
    public static boolean deleteFile (String path) {
        boolean result = false;
        if (path != null) {
            File f = new File (path);
            if (f.exists() && f.isFile()) {
                result = f.delete();
            }
        }
        return result;
    }

    public static BufferedImage convertImage (BufferedImage image, int originalWidth, int originalHeight, int width, String extension) throws IOException {
        BufferedImage result;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write( image, extension, baos );
        baos.flush();
        double proportion = ((float)originalWidth / width);
        int heightNumeric = (int) (originalHeight / proportion);
        ByteArrayInputStream in = new ByteArrayInputStream (baos.toByteArray());
        BufferedImage buf = ImageIO.read(in);
        buf = Scalr.resize(buf, Scalr.Method.SPEED, width, heightNumeric);
        result = buf;
        return result;
    }
    
    public static String calculateExtension (String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    public static int [] fromCornerToCoords (String pos, Encoder encoder, Font f, String text) {
        int [] result = new int [2];
        result[0] = 0;
        result[1] = 0;
        switch (pos) {
        case "1-1":
            result[0] = f.getSize();
            result[1] = f.getSize() * 2;
            break;
        case "1-2":
            result[0] = (encoder.getWidth() / 2) - (Utils.getTextLength(f, text, 0.5f) / 2); 
            result[1] = f.getSize() * 2;
            break;
        case "1-3":
            result[0] = encoder.getWidth() - Utils.getTextLength(f, text, 0.6f);
            result[1] = f.getSize() * 2;
            break;
        case "2-1":
            result[0] = f.getSize();
            result[1] = (encoder.getWidth() / 2);
            break;
        case "2-3":
            result[0] = encoder.getWidth() - Utils.getTextLength(f, text, 0.6f);
            result[1] = (encoder.getWidth() / 2);
            break;
        case "3-1":
            result[0] = f.getSize();
            result[1] = encoder.getHeight() - (f.getSize() * 2);
            break;
        case "3-2":
            result[0] = (encoder.getWidth() / 2) - (Utils.getTextLength(f, text, 0.5f) / 2); 
            result[1] = encoder.getHeight() - (f.getSize() * 2);
            break;
        case "3-3":
            result[0] = encoder.getWidth() - Utils.getTextLength(f, text, 0.6f);
            result[1] = encoder.getHeight() - (f.getSize() * 2);
            break;
        }
        return result;
    }
    
    
    public static int getTextLength (Font f, String text) {
        return Utils.getTextLength(f, text, 0.7f);
    }
    
    public static int getTextLength (Font f, String text, float correction) {
        return (int)(f.getSize() * text.length() * correction);
    }
    
    public static BufferedImage resizeImageFromCenter (int width, int height, String path, String extension) throws IOException {
        
        BufferedImage buf = ImageIO.read(new File (path));
        Optional<Image> img = Optional.empty();
        
        if ( (buf.getWidth() > width && buf.getHeight() > height) || (buf.getWidth() < width && buf.getHeight() < height) ) { //Case both width and height are higher or lower than the video size
            double proportionX = (double)width / buf.getWidth();
            double proportionY = (double)height / buf.getHeight();
            if (proportionX >= proportionY) {
                double finalHeight = (double)height * ((double)width / buf.getWidth());
                img = Optional.of(buf.getScaledInstance(width, (int)finalHeight, Image.SCALE_SMOOTH));
            } else if (proportionY > proportionX) {
                double finalWidth = (double)width * ((double) height / buf.getHeight());
                img = Optional.of(buf.getScaledInstance((int)finalWidth, height, Image.SCALE_SMOOTH));
            }
        } else if (buf.getWidth() > width) { //Case width is higher than video width
            double finalHeight = (double)height * ((double)width / buf.getWidth());
            img = Optional.of(buf.getScaledInstance(width, (int)finalHeight, Image.SCALE_SMOOTH));
        } else if (buf.getHeight() > height) { //Case height is higher than video height
            double finalWidth = (double)width * ((double) height / buf.getHeight());
            img = Optional.of(buf.getScaledInstance((int)finalWidth, height, Image.SCALE_SMOOTH));
        }

        BufferedImage result = new BufferedImage(width, height, BufferedImage.TYPE_3BYTE_BGR);
        Graphics2D graphics = result.createGraphics();
        if (img.isPresent()) {
            graphics.drawImage(img.get(), (width - img.get().getWidth(null)) / 2, (height - img.get().getHeight(null)) / 2, Color.black, null);
        }
        return result;
    }
    
    public static BufferedImage fromImageToBufferedImage(Image img)
    {
        if (img instanceof BufferedImage)
        {
            return (BufferedImage) img;
        }

        // Create a buffered image with transparency
        BufferedImage bimage = new BufferedImage(img.getWidth(null), img.getHeight(null), BufferedImage.TYPE_INT_ARGB);

        // Draw the image on to the buffered image
        Graphics2D bGr = bimage.createGraphics();
        bGr.drawImage(img, 0, 0, null);
        bGr.dispose();

        // Return the buffered image
        return bimage;
    }
    
    
}
