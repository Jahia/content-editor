package main.java.org.jahia.modules.choicelistinitializer;

import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.jahia.services.content.nodetypes.initializers.ModuleChoiceListInitializer;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ServiceScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;

@Component(service = {ModuleChoiceListInitializer.class}, scope= ServiceScope.BUNDLE)
public class AnimeHeroInitializer implements ModuleChoiceListInitializer {

    private static final Logger LOGGER = LoggerFactory.getLogger(AnimeHeroInitializer.class);

    @Override
    public List<ChoiceListValue> getChoiceListValues(ExtendedPropertyDefinition epd, String param, List<ChoiceListValue> values, Locale locale, Map<String, Object> context) {
        LOGGER.error("TEST CHOICELIST");
        return Arrays.asList(new ChoiceListValue("Anime: Albator", "albator"), new ChoiceListValue("Anime: Goldorak", "goldorak"));
    }

    @Override
    public void setKey(String key) {

    }

    @Override
    public String getKey() {
        return "animeHero";
    }
}
