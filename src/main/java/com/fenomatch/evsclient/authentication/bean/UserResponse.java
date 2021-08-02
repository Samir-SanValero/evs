package com.fenomatch.evsclient.authentication.bean;

import java.util.List;

public class UserResponse {
    private long id;
    private String username;
    private String password;
    private String role;
    private List<Token> refreshTokens;
    private Boolean deactivated;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Token> getRefreshTokens() {
        return refreshTokens;
    }

    public void setRefreshTokens(List<Token> refreshTokens) {
        this.refreshTokens = refreshTokens;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getDeactivated() {
        return deactivated;
    }

    public void setDeactivated(Boolean deactivated) {
        this.deactivated = deactivated;
    }
}
