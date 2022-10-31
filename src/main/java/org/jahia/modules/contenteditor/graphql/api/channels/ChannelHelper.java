package org.jahia.modules.contenteditor.graphql.api.channels;

import org.jahia.services.SpringContextSingleton;
import org.jahia.services.channels.Channel;
import org.jahia.services.channels.ChannelService;


import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ChannelHelper {

    public static List<GqlChannel> getAllChannels() {
        ChannelService channelService = (ChannelService) SpringContextSingleton.getBean("ChannelService");

        if (channelService != null) {
            List<String> channelIds = channelService.getAllChannels();
            return channelIds.stream().map(id -> {
                Channel ch = channelService.getChannel(id);
                return new GqlChannel(ch.getIdentifier(), ch.getCapability("display-name"), ch.isVisible());
            }).collect(Collectors.toList());
        }

        return Collections.emptyList();
    }
}
