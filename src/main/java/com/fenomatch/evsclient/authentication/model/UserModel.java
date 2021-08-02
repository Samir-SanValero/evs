package com.fenomatch.evsclient.authentication.model;

import com.fenomatch.evsclient.authentication.bean.User;
import org.springframework.data.repository.CrudRepository;

public interface UserModel extends CrudRepository<User, Long>{

    User findByUsername(String username);

    @Override
    User save(User user);

    @Override
    void deleteById(Long id);

    @Override
    void delete(User user);

    User saveAndFlush(User user);

}
