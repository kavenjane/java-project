package com.college.lostfound.service;

import com.college.lostfound.dto.ItemRequest;
import com.college.lostfound.exception.ItemNotFoundException;
import com.college.lostfound.model.Item;
import com.college.lostfound.model.ItemStatus;
import com.college.lostfound.model.ReportType;
import com.college.lostfound.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service layer = business logic. The controller calls the service,
 * and the service calls the repository.
 */
@Service
public class ItemService {

    private final ItemRepository itemRepository;

    // Constructor injection: Spring gives us the ItemRepository automatically
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> getItems(String name, ReportType type, ItemStatus status) {
        String searchText = (name == null) ? "" : name.trim();
        return itemRepository.search(searchText, type, status);
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException(id));
    }

    public Item createItem(ItemRequest request) {
        Item item = new Item();
        copyValues(request, item);
        item.setStatus(request.getStatus() != null ? request.getStatus() : ItemStatus.OPEN);
        return itemRepository.save(item);
    }

    public Item updateItem(Long id, ItemRequest request) {
        Item item = getItemById(id); // throws 404 if missing
        copyValues(request, item);
        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }
        return itemRepository.save(item);
    }

    public void deleteItem(Long id) {
        Item item = getItemById(id); // throws 404 if missing
        itemRepository.delete(item);
    }

    public Item markAsResolved(Long id) {
        Item item = getItemById(id);
        item.setStatus(ItemStatus.RESOLVED);
        return itemRepository.save(item);
    }

    // Copies the fields from the DTO into the entity
    private void copyValues(ItemRequest request, Item item) {
        item.setName(request.getName().trim());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory().trim());
        item.setLocation(request.getLocation().trim());
        item.setDate(request.getDate());
        item.setReportType(request.getReportType());
    }
}
