package com.hytaleonlinelist.domain.entity;

public enum QueryProtocol {
    HYQUERY,        // UDP 5520 - HyQuery plugin (same port as game)
    NITRADO,        // HTTPS 5523 - Nitrado Query plugin API
    QUIC,           // UDP 5520 - QUIC protocol ping (checks if QUIC server responds)
    BASIC_PING,     // ICMP ping + TCP connect fallback
    FAILED          // No protocol worked
}
