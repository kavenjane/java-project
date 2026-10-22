package com.college.lostfound.config;

import com.college.lostfound.model.Item;
import com.college.lostfound.model.ItemStatus;
import com.college.lostfound.model.ReportType;
import com.college.lostfound.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

/**
 * Inserts a few sample records into MySQL on the first run
 * (only when the table is empty), so the demo is not blank.
 */
@Configuration
public class SampleDataLoader {

    @Bean
    public CommandLineRunner loadSampleData(ItemRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }
            LocalDate today = LocalDate.now();
            repository.saveAll(List.of(
                new Item("Black Backpack", "Black Wildcraft backpack with a laptop charger inside",
                        "Bags", "Library, 2nd floor", today.minusDays(5), ItemStatus.OPEN, ReportType.LOST),
                new Item("Casio Scientific Calculator", "fx-991EX with initials 'R.S.' on the back",
                        "Electronics", "Room 204, Block A", today.minusDays(4), ItemStatus.OPEN, ReportType.FOUND),
                new Item("Student ID Card", "ID card of a second-year CSE student",
                        "Documents", "Canteen", today.minusDays(3), ItemStatus.OPEN, ReportType.FOUND),
                new Item("Blue Water Bottle", "Milton steel bottle with a dent near the cap",
                        "Personal Items", "Sports Ground", today.minusDays(7), ItemStatus.RESOLVED, ReportType.LOST),
                new Item("Wired Earphones", "White earphones in a small black pouch",
                        "Electronics", "Computer Lab 3", today.minusDays(1), ItemStatus.OPEN, ReportType.LOST),
                new Item("Umbrella", "Red folding umbrella",
                        "Personal Items", "Main Gate", today.minusDays(2), ItemStatus.OPEN, ReportType.FOUND)
            ));
        };
    }
}
