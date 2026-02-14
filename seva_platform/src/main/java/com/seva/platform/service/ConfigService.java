package com.seva.platform.service;

import com.seva.platform.dto.ConfigDto;
import com.seva.platform.model.AppConfig;
import com.seva.platform.repository.AppConfigRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConfigService {

    private static final int CONFIG_ID = 1;
    private final AppConfigRepository repo;

    public ConfigService(AppConfigRepository repo) {
        this.repo = repo;
    }

    private AppConfig getOrCreate() {
        return repo.findById(CONFIG_ID).orElseGet(() -> {
            AppConfig c = AppConfig.builder()
                    .id(CONFIG_ID)
                    .enableEvents(true)
                    .enableGallery(true)
                    .enableArtefacts(true)
                    .enableHistory(true)
                    .enableRoomBooking(true)
                    .enableSeva(true)
                    .enableQuiz(true)
                    .build();
            return repo.save(c);
        });
    }

    @Transactional(readOnly = true)
    public ConfigDto.AdminConfig getAdmin() {
        AppConfig c = getOrCreate();
        return new ConfigDto.AdminConfig(
                c.getId(),
                c.isEnableEvents(),
                c.isEnableGallery(),
                c.isEnableArtefacts(),
                c.isEnableHistory(),
                c.isEnableRoomBooking(),
                c.isEnableSeva(),
                c.isEnableQuiz()
        );
    }

    @Transactional(readOnly = true)
    public ConfigDto.PublicConfig getPublic() {
        AppConfig c = getOrCreate();
        return new ConfigDto.PublicConfig(
                c.isEnableEvents(),
                c.isEnableGallery(),
                c.isEnableArtefacts(),
                c.isEnableHistory(),
                c.isEnableRoomBooking(),
                c.isEnableSeva(),
                c.isEnableQuiz()
        );
    }

    @Transactional
    public ConfigDto.PublicConfig update(ConfigDto.UpdateRequest req) {
        AppConfig c = getOrCreate();

        c.setEnableEvents(req.enableEvents());
        c.setEnableGallery(req.enableGallery());
        c.setEnableArtefacts(req.enableArtefacts());
        c.setEnableHistory(req.enableHistory());
        c.setEnableRoomBooking(req.enableRoomBooking());
        c.setEnableSeva(req.enableSeva());
        c.setEnableQuiz(req.enableQuiz());

        repo.save(c);

        return new ConfigDto.PublicConfig(
                c.isEnableEvents(),
                c.isEnableGallery(),
                c.isEnableArtefacts(),
                c.isEnableHistory(),
                c.isEnableRoomBooking(),
                c.isEnableSeva(),
                c.isEnableQuiz()
        );
    }
}
