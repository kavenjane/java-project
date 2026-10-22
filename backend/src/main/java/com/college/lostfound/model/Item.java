package com.college.lostfound.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

/**
 * Entity = a Java class that is mapped to a database table.
 * Each object of this class represents one row in the "items" table.
 */
@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL AUTO_INCREMENT
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING) // stored as text: OPEN / RESOLVED
    @Column(nullable = false, length = 20)
    private ItemStatus status = ItemStatus.OPEN;

    @Enumerated(EnumType.STRING) // stored as text: LOST / FOUND
    @Column(name = "report_type", nullable = false, length = 20)
    private ReportType reportType;

    // JPA needs a no-argument constructor
    public Item() {
    }

    public Item(String name, String description, String category, String location,
                LocalDate date, ItemStatus status, ReportType reportType) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.location = location;
        this.date = date;
        this.status = status;
        this.reportType = reportType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public ItemStatus getStatus() { return status; }
    public void setStatus(ItemStatus status) { this.status = status; }

    public ReportType getReportType() { return reportType; }
    public void setReportType(ReportType reportType) { this.reportType = reportType; }
}
