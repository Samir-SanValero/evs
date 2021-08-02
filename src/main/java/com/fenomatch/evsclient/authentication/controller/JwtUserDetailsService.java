package com.fenomatch.evsclient.authentication.controller;

import com.fenomatch.evsclient.authentication.bean.User;
import com.fenomatch.evsclient.authentication.bean.UserWrapper;
import com.fenomatch.evsclient.authentication.model.UserModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Qualifier ("userDetailService")
public class JwtUserDetailsService implements UserDetailsService {

    final UserModel userModel;

    public JwtUserDetailsService(UserModel userModel) {
        this.userModel = userModel;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userModel.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return new UserWrapper(user);
    }
}