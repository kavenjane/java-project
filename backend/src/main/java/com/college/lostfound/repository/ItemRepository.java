package com.college.lostfound.repository;

import com.college.lostfound.model.Item;
import com.college.lostfound.model.ItemStatus;
import com.college.lostfound.model.ReportType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repository = the data-access layer. Because it extends JpaRepository,
 * Spring generates save(), findById(), findAll(), deleteById() ... for us.
 * We only write the interface; Spring creates the implementation at runtime.
 */
public interface ItemRepository extends JpaRepository<Item, Long> {

    // Search by name (part of the name, ignoring case) and optionally filter
    // by report type and status. A null type/status means "do not filter".
    @Query("SELECT i FROM Item i " +
           "WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
           "AND (:type IS NULL OR i.reportType = :type) " +
           "AND (:status IS NULL OR i.status = :status) " +
           "ORDER BY i.date DESC, i.id DESC")
    List<Item> search(@Param("name") String name,
                      @Param("type") ReportType type,
                      @Param("status") ItemStatus status);
}
