package com.hytaleonlinelist.exception;

public class VoteAlreadyExistsException extends RuntimeException {

    public VoteAlreadyExistsException(String message) {
        super(message);
    }

    public VoteAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
