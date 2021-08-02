package com.fenomatch.evsclient.authentication.controller;

import com.fenomatch.evsclient.authentication.bean.AuthRequest;
import com.fenomatch.evsclient.authentication.bean.AuthResponse;
import com.fenomatch.evsclient.authentication.bean.Token;
import com.fenomatch.evsclient.authentication.bean.User;
import com.fenomatch.evsclient.authentication.model.UserModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Optional;

import static java.time.temporal.ChronoUnit.SECONDS;

@RestController
@CrossOrigin(origins = {"http://localhost:4200"})
@RequestMapping("/auth/")
public class AuthenticationController {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationController.class);

    private final JwtTokenUtil jwtTokenUtil;

    private final UserModel userModel;

    @Value("${refresh.token.expiration.time}")
    private Integer refreshTokenExpiration;

    public AuthenticationController(AuthenticationManager authenticationManager,
                                    JwtTokenUtil jwtTokenUtil,
                                    @Qualifier("userDetailService") UserDetailsService jwtInMemoryUserDetailsService,
                                    UserModel userModel) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userModel = userModel;
    }

    /**
     * Creates new user
     * @param user
     * @return
     */
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            log.debug("Creating user");

            if (userModel.findByUsername(user.getUsername()) != null) {
                log.warn("User already exists");
                return ResponseEntity.badRequest().build();
            } else {
                user.setPassword(encode(user.getPassword()));
                userModel.save(user);
                return ResponseEntity.ok().build();
            }
        } catch (Throwable e) {
            log.error("Exception creating user", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Generates tokens using user authorization data
     * @param authenticationRequest
     * @return
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestBody AuthRequest authenticationRequest) {
        try {
            Objects.requireNonNull(authenticationRequest.getUsername());
            Objects.requireNonNull(authenticationRequest.getPassword());

            User dbUser = userModel.findByUsername(authenticationRequest.getUsername());

            if (dbUser != null) {
                if (validate(authenticationRequest.getPassword(), dbUser.getPassword())) {
                    userModel.findByUsername(authenticationRequest.getUsername());

                    // Generate authorization and refresh tokens
                    Token refreshToken = new Token();

                    String authToken = jwtTokenUtil.generateAuthToken(dbUser);
                    String refreshTokenString = jwtTokenUtil.generateRefreshToken();
                    refreshToken.setValue(encode(refreshTokenString));
                    refreshToken.setExpiration(Instant.now().plus(refreshTokenExpiration, SECONDS));

                    // We update user with new refreshtoken
                    if (dbUser.getRefreshTokens() == null) {
                        dbUser.setRefreshTokens(new ArrayList<>());
                    }
                    dbUser.getRefreshTokens().add(refreshToken);

                    userModel.saveAndFlush(dbUser);

                    AuthResponse authResponse = new AuthResponse();
                    authResponse.setAuthToken(authToken);
                    authResponse.setRefreshToken(refreshTokenString);

                    return ResponseEntity.ok(authResponse);
                } else {
                    log.warn("User data not valid");
                    return ResponseEntity.badRequest().build();
                }
            } else {
                log.warn("User not found");
                return ResponseEntity.badRequest().build();
            }
        } catch (Throwable e) {
            log.error("Invalid authentication");
            return ResponseEntity.badRequest().build();
        }
    }

    // REFRESH AUTH TOKEN
    @RequestMapping(value = "/refresh", method = RequestMethod.POST)
    public ResponseEntity<?> refreshAuthToken(@RequestBody AuthRequest authenticationRequest) {
        try {
            Objects.requireNonNull(authenticationRequest.getUsername());
            Objects.requireNonNull(authenticationRequest.getPassword());

            User dbUser = userModel.findByUsername(authenticationRequest.getUsername());

            if (dbUser != null) {
                for (Token refreshToken : dbUser.getRefreshTokens()) {
                    if (validate(authenticationRequest.getPassword(), refreshToken.getValue())) {
                        if (refreshToken.getExpiration().isAfter(Instant.now())) {
                            AuthResponse authResponse = new AuthResponse();
                            authResponse.setAuthToken(jwtTokenUtil.generateAuthToken(dbUser));

                            return ResponseEntity.ok(authResponse);
                        }
                    }
                }
            }
        } catch (Throwable e) {
            log.error("Error refreshing auth token", e);
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.badRequest().build();
    }

    // DELETE USER
    @Transactional
    @RequestMapping(value="{id}", method = RequestMethod.DELETE, produces = "application/json")
    public ResponseEntity deactivateUser(@PathVariable Long id) {
        log.info("Deactivating user");

        try {
            Optional<User> foundUser = userModel.findById(id);

            if (foundUser.isPresent()) {
                foundUser.get().setDeactivated(true);
                userModel.save(foundUser.get());
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception deactivating user", e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Encodes password with bcrypt
     */
    private String encode(String password) {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(BCryptPasswordEncoder.BCryptVersion.$2B, 9);
        return bCryptPasswordEncoder.encode(password);
    }

    /**
     * Validates password with bcrypt
     */
    private Boolean validate(String rawPassword, String password) {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(BCryptPasswordEncoder.BCryptVersion.$2B, 9);
        return bCryptPasswordEncoder.matches(rawPassword, password);
    }
}
