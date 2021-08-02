package com.fenomatch.evsclient.media.utils;

import java.util.List;

import com.fenomatch.evsclient.media.bean.EmbryoImage;



public abstract class OutputMediaBase {
	public static enum Corner {TOPLEFT, TOP, TOPRIGHT, RIGHT, BOTTOMRIGHT, BOTTOM, BOTTOMLEFT, LEFT , NONE}
	
	public abstract String generate(List<EmbryoImage> pictures, boolean hasText, Corner cor, boolean backgroundLogoColor, int frameRate,  
	        int height, int width, String extension, String audioPath, String text, String textPosition, String fontType, 
	        String fontColor, int fontSize, String logoPath, String imgStart, String imgEnd, boolean showTime) throws Exception;
	
	

}
