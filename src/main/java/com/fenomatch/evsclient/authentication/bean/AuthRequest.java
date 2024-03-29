package com.fenomatch.evsclient.authentication.bean;

public class AuthRequest {
    private static final long serialVersionUID = 5926644323005150707L;

    private String username;
    private String password;

    //default constructor for JSON Parsing
    public AuthRequest() {}

    public AuthRequest(String username, String password) {
        this.setUsername(username);
        this.setPassword(password);
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

