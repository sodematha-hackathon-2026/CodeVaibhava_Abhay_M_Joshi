package com.seva.platform.dto;

import com.seva.platform.model.FlashUpdate;
import com.seva.platform.model.News;
import com.seva.platform.model.SocialLink;
import com.seva.platform.model.MathaInfo;

import java.util.List;

public record HomeResponse(
        List<FlashUpdate> flashUpdates,
        List<News> topNews,
        MathaInfo templeInfo,
        List<SocialLink> socialLinks
) {}