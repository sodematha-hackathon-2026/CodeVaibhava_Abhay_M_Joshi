package com.seva.platform.service;

import com.seva.platform.dto.HomeResponse;
import com.seva.platform.model.MathaInfo;
import com.seva.platform.repository.*;
import org.springframework.stereotype.Service;

@Service
public class HomeService {

    private final FlashRepo flashRepo;
    private final NewsRepo newsRepo;
    private final TempleInfoRepository templeInfoRepo;
    private final SocialLinkRepository socialRepo;

    public HomeService(
            FlashRepo flashRepo,
            NewsRepo newsRepo,
            TempleInfoRepository templeInfoRepo,
            SocialLinkRepository socialRepo
    ) {
        this.flashRepo = flashRepo;
        this.newsRepo = newsRepo;
        this.templeInfoRepo = templeInfoRepo;
        this.socialRepo = socialRepo;
    }

    public HomeResponse getHomeData() {
        var flash = flashRepo.findByActiveTrueOrderByCreatedAtDesc();
        var news = newsRepo.findLatestActive().stream().limit(5).toList();

        var info = templeInfoRepo.findById("default")
                .orElseGet(() -> templeInfoRepo.save(
                        MathaInfo.builder()
                                .id("default")
                                .morningDarshan("Not updated")
                                .morningPrasada("Not updated")
                                .eveningDarshan("Not updated")
                                .eveningPrasada("Not updated")
                                .build()
                ));

        var socials = socialRepo.findByActiveTrueOrderByCreatedAtDesc();

        return new HomeResponse(flash, news, info, socials);
    }
}