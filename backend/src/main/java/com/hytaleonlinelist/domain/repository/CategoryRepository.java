package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, UUID> {

    Optional<CategoryEntity> findBySlug(String slug);

    @Query("SELECT c, COUNT(s) FROM CategoryEntity c LEFT JOIN c.servers s GROUP BY c ORDER BY c.name")
    List<Object[]> findAllWithServerCounts();
}
