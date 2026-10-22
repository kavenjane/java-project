package com.college.lostfound.exception;

/** Thrown when an item with the given id does not exist. */
public class ItemNotFoundException extends RuntimeException {

    public ItemNotFoundException(Long id) {
        super("Item not found with id " + id);
    }
}
