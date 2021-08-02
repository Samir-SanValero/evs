package com.fenomatch.evsclient.media.bean;

import java.math.BigInteger;

public class EmbryoInstant {
    private BigInteger instant;
    private String thumbnail;

    public BigInteger getInstant() {
        return instant;
    }

    public void setInstant(BigInteger instant) {
        this.instant = instant;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }
}
