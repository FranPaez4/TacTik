package com.tactik.tactik_api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponseDto {
    String name;
    String clubName;
    String badgeUrl;
    String colors;
}
