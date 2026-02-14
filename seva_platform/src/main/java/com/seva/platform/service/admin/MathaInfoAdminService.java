package com.seva.platform.service.admin;

import com.seva.platform.dto.MathaInfoDto;
import com.seva.platform.model.MathaInfo;
import com.seva.platform.repository.TempleInfoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MathaInfoAdminService {

    private final TempleInfoRepository repo;

    public MathaInfoAdminService(TempleInfoRepository repo) {
        this.repo = repo;
    }

    private MathaInfo getOrCreate() {
        return repo.findById("default").orElseGet(() ->
                repo.save(MathaInfo.builder()
                        .id("default")
                        .morningDarshan("Not updated")
                        .morningPrasada("Not updated")
                        .eveningDarshan("Not updated")
                        .eveningPrasada("Not updated")
                        .build()
                )
        );
    }

    public MathaInfoDto.AdminItem get() {
        MathaInfo t = getOrCreate();
        return toAdmin(t);
    }

    @Transactional
    public MathaInfoDto.AdminItem update(MathaInfoDto.UpdateRequest req) {
        MathaInfo t = getOrCreate();
        t.setMorningDarshan(req.morningDarshan());
        t.setMorningPrasada(req.morningPrasada());
        t.setEveningDarshan(req.eveningDarshan());
        t.setEveningPrasada(req.eveningPrasada());
        return toAdmin(repo.save(t));
    }

    private MathaInfoDto.AdminItem toAdmin(MathaInfo t) {
        return new MathaInfoDto.AdminItem(
                t.getId(),
                t.getMorningDarshan(),
                t.getMorningPrasada(),
                t.getEveningDarshan(),
                t.getEveningPrasada(),
                t.getUpdatedAt() == null ? null : t.getUpdatedAt().toString()
        );
    }
}
