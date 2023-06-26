package org.jahia.modules.contenteditor.api.forms;

import org.jahia.api.Constants;
import org.jahia.services.content.*;
import org.jahia.services.scheduler.BackgroundJob;
import org.jahia.services.scheduler.SchedulerService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.SchedulerException;

import javax.jcr.RepositoryException;
import java.util.*;
import java.util.stream.Collectors;

import static org.jahia.modules.contenteditor.utils.ContentEditorUtils.resolveNodeFromPathorUUID;

@Component(immediate = true, service = PublicationService.class)
public class PublicationService {
    private static final List<String> PUBLISHED_TECHNICAL_NODES = Arrays.asList("vanityUrlMapping", "j:conditionalVisibility");

    private ComplexPublicationService publicationService;
    private SchedulerService schedulerService;

    @Reference
    public void setPublicationService(ComplexPublicationService publicationService) {
        this.publicationService = publicationService;
    }

    @Reference
    public void setSchedulerService(SchedulerService schedulerService) {
        this.schedulerService = schedulerService;
    }

    /**
     * Publish the edited node, it will publish the node only with the associated technical nodes
     * (vanity, visibilities, acls, etc ...)
     *
     * @param locale     The locale of the form when editing the node
     * @param uuidOrPath UUID or path of the node path of the node to be edited.
     * @return True in case publication have been scheduled successfully
     * @throws EditorFormException in case of any errors happening during this process
     */
    public boolean publish(Locale locale, String uuidOrPath) throws EditorFormException {
        String uuid;
        String path;
        JCRSessionWrapper session;
        try {
            JCRNodeWrapper nodeToPublish = resolveNodeFromPathorUUID(uuidOrPath, locale);
            uuid = nodeToPublish.getIdentifier();
            path = nodeToPublish.getPath();
            session = JCRSessionFactory.getInstance().getCurrentUserSession();
        } catch (RepositoryException e) {
            throw new EditorFormException("Cannot found node: " + uuidOrPath, e);
        }

        // Filter the publication infos to only keep current node and sub technical nodes associated to the current node
        Collection<ComplexPublicationService.FullPublicationInfo> filteredInfos = publicationService.getFullPublicationInfos(Collections.singleton(uuid), Collections.singletonList(locale.toString()), false, session).stream().filter(info -> info.getPublicationStatus() != PublicationInfo.DELETED) // keep only not deleted nodes
            .filter(ComplexPublicationService.FullPublicationInfo::isAllowedToPublishWithoutWorkflow) // keep only nodes allowed to bypass workflow
            .filter(info -> path.equals(info.getNodePath()) || PUBLISHED_TECHNICAL_NODES.stream().anyMatch(technicalNodeName -> {
                String technicalNodePath = path + "/" + technicalNodeName;
                String technicalNodeChildPath = technicalNodePath + "/";
                return technicalNodePath.equals(info.getNodePath()) || info.getNodePath().startsWith(technicalNodeChildPath);
            })) // keep the node itself and associated technical subnodes
            .collect(Collectors.toList());

        // Build the list of uuids to publish
        LinkedList<String> uuids = new LinkedList<>();
        for (ComplexPublicationService.FullPublicationInfo info : filteredInfos) {
            if (info.getNodeIdentifier() != null) {
                uuids.add(info.getNodeIdentifier());
            }
            if (info.getTranslationNodeIdentifier() != null) {
                uuids.add(info.getTranslationNodeIdentifier());
            }
            uuids.addAll(info.getDeletedTranslationNodeIdentifiers());
        }

        // Build the list of paths to publish
        String workspaceName = session.getWorkspace().getName();
        List<String> paths = new ArrayList<>();
        for (String uuidToPublish : uuids) {
            try {
                paths.add(session.getNodeByIdentifier(uuidToPublish).getPath());
            } catch (RepositoryException e) {
                throw new EditorFormException(e);
            }
        }

        // Schedule publication workflow
        JobDetail jobDetail = BackgroundJob.createJahiaJob("Publication", PublicationJob.class);
        JobDataMap jobDataMap = jobDetail.getJobDataMap();
        jobDataMap.put(PublicationJob.PUBLICATION_UUIDS, uuids);
        jobDataMap.put(PublicationJob.PUBLICATION_PATHS, paths);
        jobDataMap.put(PublicationJob.SOURCE, workspaceName);
        jobDataMap.put(PublicationJob.DESTINATION, Constants.LIVE_WORKSPACE);
        jobDataMap.put(PublicationJob.CHECK_PERMISSIONS, true);
        try {
            schedulerService.scheduleJobNow(jobDetail);
        } catch (SchedulerException e) {
            throw new EditorFormException(e);
        }

        return true;
    }

}
