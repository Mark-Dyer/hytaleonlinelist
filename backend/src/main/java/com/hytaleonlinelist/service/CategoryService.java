package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.CategoryEntity;
import com.hytaleonlinelist.domain.repository.CategoryRepository;
import com.hytaleonlinelist.dto.response.CategoryResponse;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import com.hytaleonlinelist.mapper.CategoryMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository,
                          CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public List<CategoryResponse> getAllCategories() {
        List<Object[]> results = categoryRepository.findAllWithServerCounts();
        return results.stream()
                .map(row -> {
                    CategoryEntity category = (CategoryEntity) row[0];
                    Long count = (Long) row[1];
                    return categoryMapper.toResponseWithCount(category, count.intValue());
                })
                .toList();
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        CategoryEntity category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));

        int serverCount = category.getServers() != null ? category.getServers().size() : 0;
        return categoryMapper.toResponseWithCount(category, serverCount);
    }
}
